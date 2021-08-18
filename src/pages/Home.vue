<template>
  <div id="home">

    <!-- breadcrumb -->
    <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center text-blue-500">
          <a href="#" class="text-gray-700 dark:text-gray-100">Home</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="lg:flex justify-between items-center mb-6">
      <p class="text-2xl font-semibold mb-2 lg:mb-0">Welcome, {{ walletAddress | compressAddress }}</p>
      <!--      <button-->
      <!--          class="bg-blue-500 hover:bg-blue-600 focus:outline-none rounded-lg px-6 py-2 text-white font-semibold shadow">-->
      <!--        View Logs-->
      <!--      </button>-->
    </div>

    <info-bar></info-bar>

    <div class="flex flex-wrap -mx-3">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">Recent HRC20 Transactions</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg p-4">
          <div v-if="loading"
               class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-1">
            <div class="w-full text-center">
              <p class="font-semibold text-xl">Loading transactions...</p>
            </div>
          </div>
          <div v-else :key="`${tx.to}-${index}`" v-for="(tx, index) in allDecodedHRC20Transactions"
               class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-1">
            <div>
              <p class="font-semibold text-xl">{{ tx.to | compressAddress }}</p>
              <p>{{ tx.symbol }}</p>
            </div>
            <span class="text-green-500 font-semibold text-lg">{{ tx.amount | formatNumber }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfoBar from '../components/InfoBar'
import {mapGetters} from 'vuex'
import artifact from '../plugins/abi/HRC20.json'
import {Harmony} from '@harmony-js/core'
import {ChainID, ChainType} from '@harmony-js/utils'
import {fromBech32, toBech32} from '@harmony-js/crypto'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['walletAddress'])
  },
  data() {
    return {
      loading: true,
      HRC20Transactions: {},
      allHRC20Transactions: [],
      allDecodedHRC20Transactions: []
    }
  },
  watch: {
    async walletAddress() {
      if (this.walletAddress !== undefined) {
        await this.getHRC20Transactions()
        this.loading = false
      }
    }
  },
  async mounted() {
    if (this.walletAddress !== undefined) {
      await this.getHRC20Transactions()
      this.loading = false
    }
  },
  methods: {
    getContractInstance(contractAddress) {
      const hmy = new Harmony('https://api.s0.t.hmny.io', {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyMainnet,
      })

      return hmy.contracts.createContract(artifact.abi, contractAddress)
    },
    removeDuplicates(txs) {
      let unique = {}
      let newList = []

      txs.forEach((i) => {
        if (!unique[i.blockHash]) {
          unique[i.blockHash] = true
          newList.push(i)
        }
      })

      return newList
    },
    async getHRC20Transactions() {
      const hmy = new Harmony('https://api.s0.t.hmny.io', {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyMainnet,
      })

      const res = await hmy.messenger.send(
          "hmy_getTransactionsHistory",
          [
            {
              address: this.walletAddress,
              fullTx: true,
              order: 'DESC'
            }
          ],
          hmy.messenger.chainPrefix,
          hmy.defaultShardID
      )

      this.allHRC20Transactions = this.removeDuplicates(res.result.transactions)

      await this.allHRC20Transactions.map((tx) => {
        this.decodeInput(tx.to, tx.input)
      })
    },
    async decodeInput(to, hexData) {
      try {
        let contract = undefined

        try {
          contract = this.getContractInstance(fromBech32(to))
        } catch {
          contract = this.getContractInstance(to)
        }

        let decodeParameters = (inputs, data) => {
          if (0 === inputs.length) return []
          let params = contract.abiCoder.decodeParameters(inputs, data)
          params.length = inputs.length
          return Array.from(params)
        }

        const no0x = hexData.startsWith('0x') ? hexData.slice(2) : hexData
        const sig = no0x.slice(0, 8).toLowerCase()
        const method = contract.abiModel.getMethod('0x' + sig)
        if (!method) {
          return false
        }

        const params = decodeParameters(method.inputs, '0x' + no0x.slice(8))
        const decimals = await contract.methods.decimals().call()
        const symbol = await contract.methods.symbol().call()

        this.allDecodedHRC20Transactions.push({
          to: toBech32(params[0]),
          amount: parseFloat(new BigNumber(params[1]).dividedBy(Math.pow(10, new BN(decimals, 16).toNumber())).toString()).toFixed(3),
          symbol
        })
      } catch (err) {
        console.log(err)
        return false
      }
    }
  },
  filters: {
    compressAddress(address) {
      if (address !== undefined) {
        return (
            address.substr(0, 10) +
            "..." +
            address.substr(address.length - 5, address.length)
        )
      }
    },
    formatNumber(nStr) {
      nStr += ''
      let x = nStr.split('.')
      let x1 = x[0]
      let x2 = x.length > 1 ? '.' + x[1] : ''
      let rgx = /(\d+)(\d{3})/
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
      }
      return x1 + x2
    }
  },
  components: {
    InfoBar
  }
}
</script>