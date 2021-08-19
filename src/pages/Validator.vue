<template>
  <div id='home'>

    <!-- breadcrumb -->
    <nav class='text-sm font-semibold mb-6' aria-label='Breadcrumb'>
      <ol class='list-none p-0 inline-flex'>
        <li class='flex items-center text-blue-500'>
          <a href='/' class='text-gray-700 dark:text-gray-100'>Home</a>
          <svg class='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
            <path
                d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z'/>
          </svg>
        </li>
        <li class='flex items-center'>
          <a href='#' class='text-gray-600 dark:text-gray-100'>Validator info</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="lg:flex justify-between items-center mb-6">
      <p class="text-2xl font-semibold mb-2 lg:mb-0">{{ validator.validator.name }}</p>
    </div>

    <div class="flex flex-wrap">
      <div class="w-full md:w-2/3 lg:w-3/4 mb-6 break-all md:pr-8">
        <p>
          <strong>
            Validator name:
          </strong>
          <span>
          {{ validator.validator.name }}
        </span>
        </p>
        <p>
          <strong>
            Validator contact:
          </strong>
          <span>
          {{ validator.validator['security-contact'] }}
        </span>
        </p>
        <p>
          <strong>
            Validator website:
          </strong>
          <span>
          {{ validator.validator.website }}
        </span>
        </p>
        <br>
        <p>
          <strong>
            Validator status:
          </strong>
          <span>
          {{ validator['epos-status'] }} ({{ validator['active-status'] }})
        </span>
        </p>
        <p>
          <strong>
            Validator start block:
          </strong>
          <span>
          #{{ validator.validator['creation-height'] }}
        </span>
        </p>
        <p>
          <strong>
            Validator identity:
          </strong>
          <span>
          {{ validator.validator.identity }}
        </span>
        </p>

        <br>

        <p class="break-normal">
          <strong>
            Validator description:
          </strong>
          <br>
          <span>
          {{ validator.validator.details }}
        </span>
        </p>
      </div>
      <div
          class="w-full md:w-1/3 lg:w-1/4 mb-6 break-all md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-4">
        <p>
          <strong>
            Fee:
          </strong>
          <span>
          {{ (parseFloat(validator.validator['rate']) * 100).toFixed(2) }}%
        </span>
        </p>
        <p>
          <strong>
            Max fee:
          </strong>
          <span>
          {{ (parseFloat(validator.validator['max-rate']) * 100).toFixed(2) }}%
        </span>
        </p>
        <p>
          <strong>
            Max fee change:
          </strong>
          <span>
          {{ (parseFloat(validator.validator['max-change-rate']) * 100).toFixed(2) }}%
        </span>
        </p>
        <br>
        <p>
          <strong>
            Signing percentage:
          </strong>
          <span>
          {{
              (parseFloat(validator['current-epoch-performance']['current-epoch-signing-percent']['current-epoch-signing-percentage']) * 100).toFixed(3)
            }}%
        </span>
        </p>
        <br>
        <p>
          <strong>
            Lifetime Rewards:
          </strong>
          <span>
          {{ validator.lifetime['reward-accumulated'] | parseBigNumberToWei | formatNumber }}
        </span>
        </p>
        <p>
          <strong>
            Current APR:
          </strong>
          <span>
          {{ (parseFloat(validator.lifetime.apr) * 100).toFixed(2) }}%
        </span>
        </p>
        <br>
        <p>
          <strong>
            Total staked:
          </strong>
          <br>
          <span>
          {{ validator['total-delegation'] | parseBigNumberToWei | formatNumber }} ONE
        </span>
        </p>
        <br>
        <p>
          <strong>
            Max delegation:
          </strong>
          <br>
          <span>
          {{ validator.validator['max-total-delegation'] | parseBigNumberToWei | formatNumber }} ONE
        </span>
        </p>
      </div>

      <div class="w-full">
        <button
            class="w-full md:w-auto bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg px-4 py-2 mt-2 md:mt-0"
            @click="$modal.show('delegate')">
          Delegate
        </button>
        <button
            class="w-full md:w-auto bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg px-4 py-2 mt-2 md:mt-0 md:ml-2"
            @click="$modal.show('undelegate')">
          Undelegate
        </button>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3 mt-16" v-if="validator.validator.delegations.length > 0">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">Top delegators</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2">
          <div
              :key="delegator['delegator-address']"
              v-for="delegator in delegations"
              class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-3">
            <div>
              <p class="font-semibold">
                {{ delegator['delegator-address'] | compressAddress }}
              </p>
            </div>
            <span class="text-green-500 font-semibold">
               {{ delegator.amount | parseBigNumberToWei | formatNumber }} ONE
            </span>
          </div>
        </div>
      </div>
    </div>

    <window name="delegate" height="auto">
      <div class="flex flex-wrap p-8 bg-white dark:bg-gray-800 border dark:border-gray-500">
        <div class="w-full mb-4">
          <p class="text-2xl">
            Delegate to {{ validatorAddress | compressAddress }}
          </p>
          <hr class="mt-3">
        </div>

        <br>

        <small>Your ONE balance: {{ oneBalance | parseBigNumberToWei | formatNumber }}</small>
        <div class="w-full flex">
          <input v-model="amountToDelegate" class="w-3/4 h-12 rounded-l-lg px-4 bg-gray-100 dark:bg-white text-black"
                 type="number" placeholder="Amount to delegate...">
          <button
              class="w-1/4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-r-lg h-12 mt-2 md:mt-0"
              type="button"
              @click="amountToDelegate = parseBigNumberToWei(oneBalance)">
            Max
          </button>
        </div>

        <button
            class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg h-12 mt-8"
            type="button"
            @click="delegateToValidator(amountToDelegate)">
          Delegate
        </button>
      </div>
    </window>
    <window name="undelegate" height="auto">
      <div class="flex flex-wrap p-8 bg-white dark:bg-gray-800 border dark:border-gray-500">
        <div class="w-full mb-4">
          <p class="text-2xl">
            Undelegate from {{ validatorAddress | compressAddress }}
          </p>
          <hr class="mt-3">
        </div>


        <br>

        <small>Your staked ONE: 1000</small>
        <div class="w-full flex">
          <input v-model="amountToUndelegate" class="w-3/4 h-12 bg-gray-100 dark:bg-white rounded-l-lg px-4 text-black"
                 type="number" placeholder="Amount to undelegate...">
          <button
              class="w-1/4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-r-lg h-12 mt-2 md:mt-0"
              type="button"
              @click="amountToUndelegate = 1000">
            Max
          </button>
        </div>

        <button
            class="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg h-12 mt-8"
            type="button"
            @click="undelegateFromValidator(amountToUndelegate)">
          Undelegate
        </button>
      </div>
    </window>

  </div>
</template>

<script>
import axios from 'axios'
import {mapGetters} from 'vuex'
import {ChainID, ChainType, Unit} from '@harmony-js/utils'
import {HarmonyAddress} from '@harmony-js/crypto'
import {StakingFactory} from '@harmony-js/staking'
import {Harmony} from '@harmony-js/core'
import BN from 'bn.js'

export default {
  name: 'Validator',
  filters: {
    compressAddress(address) {
      return (
          address.substr(0, 10) +
          '...' +
          address.substr(address.length - 5, address.length)
      )
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
    },
    parseBigNumberToWei(x) {
      if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        let e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x.toString().slice(0, -18)
    }
  },
  computed: {
    ...mapGetters(['oneBalance', 'walletAddress', 'chainId', 'wallet'])
  },
  data() {
    return {
      validatorAddress: '',
      amountToDelegate: undefined,
      amountToUndelegate: undefined,
      validator: [],
      delegations: [],
      delegate: {
        sentTxn: {},
        txnHash: {},
      }
    }
  },
  created() {
    this.validatorAddress = this.$route.params.address
  },
  async mounted() {
    const validator = await axios.post('https://rpc.s0.t.hmny.io',
        {
          'jsonrpc': '2.0',
          'id': 1,
          'method': 'hmyv2_getValidatorInformation',
          'params': [
            this.validatorAddress
          ]
        })

    validator.data.result.validator.delegations.map((x) => {
      if (x.amount > 999999999999999999) {
        this.delegations.push(x)
      }
    })

    this.delegations.sort((a, b) => {
      return b.amount - a.amount
    })

    this.validator = validator.data.result
  },
  methods: {
    async delegateToValidator() {
      const hmy = new Harmony('https://api.s0.t.hmny.io', {
        chainType: ChainType.Harmony,
        chainId: ChainID.HmyMainnet,
      })

      const stakingTxn = new StakingFactory(hmy.messenger)
          .delegate({
            delegatorAddress: new HarmonyAddress(this.walletAddress).checksum,
            validatorAddress: new HarmonyAddress(this.validatorAddress).checksum,
            amount: Unit.Szabo(this.amountToDelegate).toHex()
          })
          .setTxParams({
            gasPrice: Unit.One('10').toHex(),
            gasLimit: Unit.Wei(new BN('1000001').add(new BN('20000'))).toHex(),
            chainId: hmy.chainId
          })
          .build()

      stakingTxn.setFromAddress(new HarmonyAddress(this.walletAddress).checksum)

      const signedTxn = await this.wallet.wallet.signTransaction(stakingTxn)
      const [sentTxn, txnHash] = await signedTxn.sendTransaction()

      this.delegate.sentTxn = sentTxn
      this.delegate.txnHash = txnHash
    },
    async undelegateFromValidator() {

    },
    parseBigNumberToWei(x) {
      if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        let e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x.toString().slice(0, -18)
    }
  }
}
</script>