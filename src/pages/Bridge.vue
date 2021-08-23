<template>
  <div id="home">

    <!-- breadcrumb -->
    <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center text-blue-500">
          <a href="/" class="text-gray-700 dark:text-gray-100">Home</a>
          <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
          </svg>
        </li>
        <li class="flex items-center">
          <a href="#" class="text-gray-600 dark:text-gray-100">Bridge</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="flex flex-wrap my-4">
      <div class="w-2/3"></div>
      <div class="w-1/3">
        <div>
          <button
              class="w-full md:w-auto bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg px-4 py-2 mt-2 md:mt-0"
              @click="networkType = 0">
            Binance
          </button>
          <button
              class="w-full md:w-auto bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-400 border border-white dark:border-gray-700 rounded-lg px-4 py-2 mt-2 md:mt-0 ml-4"
              @click="networkType = 1">
            Ethereum
          </button>
        </div>

        <div v-if="networkType === 0" class="mt-4 p-4 border border-gray-200 dark:border-gray-700">
          test
        </div>
        <div v-if="networkType === 1" class="mt-4 p-4 border border-gray-200 dark:border-gray-700">
          test
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3">
      <div class="w-full px-3 mt-4">
        <p @click="toggleAssetList()" class="cursor-pointer text-xl font-semibold mb-4"><i
            :class="`fas fa-chevron-${showAllAssets ? 'up' : 'down'}`"></i> All assets</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2"
             v-if="showAllAssets">
          <div
              :key="token.id"
              v-for="token in assetList"
              class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-3">
            <div class="w-full md:w-3/4">
              <p class="font-semibold text-xl">
                {{ token.name }} <small>({{ token.symbol }})</small>
              </p>

              <span class="md:hidden text-xs md:text-lg text-green-500 font-semibold">
                {{ parseFloat(token.totalLockedNormal).toFixed(2) | formatNumber }} locked <br>
                {{ parseFloat(token.totalLockedUSD).toFixed(2) | formatNumber }} USD
              </span>
              <p class="text-xs md:text-base">
                {{ parseFloat(token.usdPrice).toFixed(2) | formatNumber }} USD per token
              </p>
            </div>
            <span class="w-1/4 hidden md:block text-xs md:text-lg text-green-500 font-semibold">
              {{ parseFloat(token.totalLockedNormal).toFixed(2) | formatNumber }} locked <br>
              {{ parseFloat(token.totalLockedUSD).toFixed(2) | formatNumber }} USD
            </span>
          </div>
        </div>
      </div>

      <div class="w-full px-3 mt-4">
        <p @click="toggleLastOperationsView()" class="cursor-pointer text-xl font-semibold mb-4"><i
            :class="`fas fa-chevron-${showLastOperations ? 'up' : 'down'}`"></i> Last 50 operations</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2"
             v-if="showLastOperations">
          <div
              :key="operation.tokenAddress"
              v-for="operation in operationsList"
              class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-3">
            <div>
              <router-link :to="{ name: 'bridgeOperation', params: { address: operation.id } }">
                <p class="font-semibold text-xl">
                  ID {{ operation.id }}
                  <small>
                    -
                    {{ new Date(operation.timestamp * 1000) }}
                    ({{
                      operation.type === 'one_to_eth' ? operation.network === 'ETHEREUM' ? 'ONE > ETH' : 'ONE > BSC' : operation.network === 'ETHEREUM' ? 'ETH > ONE' : 'BSC > ONE'
                    }})
                  </small>
                </p>

                <span class="md:hidden text-xs md:text-lg text-green-500 font-semibold">
                  {{ operation.amount | formatNumber }} tokens
                </span>
                <p class="text-xs md:text-base">
                  Click to show actions
                </p>
              </router-link>
            </div>
            <span class="hidden md:block text-xs md:text-lg text-green-500 font-semibold">
               {{ operation.amount | formatNumber }} tokens
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {fromBech32, toBech32} from '@harmony-js/crypto'
import {BridgeSDK, TOKEN, EXCHANGE_MODE, NETWORK_TYPE, STATUS} from 'bridge-sdk'
import {mapGetters} from 'vuex'

export default {
  name: 'Bridge',
  computed: {
    ...mapGetters([
      'walletAddress'
    ])
  },
  filters: {
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
  data() {
    return {
      operationsListTest: {},
      operationDetails: {},
      operationStatus: {},
      operationAction: {},
      operationsList: [],
      amountToBridge: 0,
      networkTypes: [
        NETWORK_TYPE.BINANCE,
        NETWORK_TYPE.ETHEREUM
      ],
      networkType: 0,
      exchangeModes: [
        EXCHANGE_MODE.ETH_TO_ONE,
        EXCHANGE_MODE.ONE_TO_ETH
      ],
      exchangeMode: 0,
      tokenTypes: [
        TOKEN.ETH,
        TOKEN.BUSD,
        TOKEN.ERC721,
        TOKEN.ONE,
        TOKEN.LINK,
        TOKEN.ERC20,
        TOKEN.HRC20
      ],
      tokenType: 0,
      tokenAddress: '',
      operationId: 0,
      instance: {},
      metamask: '',
      oneWallet: '',
      bridgeSDK: {},
      selectedToken: undefined,
      assetList: {},
      showLastOperations: false,
      showAllAssets: false
    }
  },
  async mounted() {
    const configs = require('bridge-sdk/lib/configs')

    this.bridgeSDK = await new BridgeSDK({logLevel: 2})
    this.instance = await this.bridgeSDK.init(configs.mainnet)

    const assetList = await this.bridgeSDK.api.getTokensInfo({size: 9999999999999})
    this.assetList = assetList.content.sort((a, b) => {
      return parseFloat(b.totalLockedUSD) - parseFloat(a.totalLockedUSD)
    })

    const operationsList = await this.bridgeSDK.api.getOperations({size: 9999999999999})
    this.operationsList = operationsList.content
        .slice(Math.max(operationsList.content.length - 50, 1))
        .sort((a, b) => {
          return b.id - a.id
        })

    if (this.walletAddress.startsWith('0x')) {
      this.bridgeSDK.setUseMetamask(true)

      this.metamask = this.walletAddress
      this.oneWallet = toBech32(this.walletAddress)
    } else {
      this.bridgeSDK.setUseOneWallet(true)

      this.metamask = fromBech32(this.walletAddress)
      this.oneWallet = this.walletAddress
    }

    let intervalId = setInterval(async () => {
      if (this.operationId) {
        const operation = await this.bridgeSDK.api.getOperation(this.operationId)

        this.operationStatus = operation.status
        this.operationAction = operation.actions.filter(a => a.status === STATUS.IN_PROGRESS)

        if (operation.status !== STATUS.IN_PROGRESS) {
          clearInterval(intervalId)
        }
      }
    }, 4000)
  },
  methods: {
    toggleAssetList() {
      this.showAllAssets = !this.showAllAssets
    },
    toggleLastOperationsView() {
      this.showLastOperations = !this.showLastOperations
    },
    async bridgeToken() {
      try {
        if (this.tokenType === 5) {
          await this.bridgeSDK.sendToken({
            type: this.exchangeModes[this.exchangeMode],
            token: this.tokenTypes[this.tokenType],
            network: this.networkTypes[this.networkType],
            amount: this.amountToBridge,
            erc20Address: this.tokenAddress,
            oneAddress: this.walletAddress.startsWith('0x') ? toBech32(this.walletAddress) : this.walletAddress,
            ethAddress: this.walletAddress.startsWith('one') ? fromBech32(this.walletAddress) : this.walletAddress
          }, (id) => this.operationId = id)
        } else if (this.tokenType === 6) {
          await this.bridgeSDK.sendToken({
            type: this.exchangeModes[this.exchangeMode],
            token: this.tokenTypes[this.tokenType],
            network: this.networkTypes[this.networkType],
            amount: this.amountToBridge,
            hrc20Address: this.tokenAddress,
            oneAddress: this.walletAddress.startsWith('0x') ? toBech32(this.walletAddress) : this.walletAddress,
            ethAddress: this.walletAddress.startsWith('one') ? fromBech32(this.walletAddress) : this.walletAddress
          }, (id) => this.operationId = id)
        } else {
          await this.bridgeSDK.sendToken({
            type: this.exchangeModes[this.exchangeMode],
            token: this.tokenTypes[this.tokenType],
            network: this.networkTypes[this.networkType],
            amount: this.amountToBridge,
            oneAddress: this.walletAddress.startsWith('0x') ? toBech32(this.walletAddress) : this.walletAddress,
            ethAddress: this.walletAddress.startsWith('one') ? fromBech32(this.walletAddress) : this.walletAddress
          }, (id) => this.operationId = id)
        }
      } catch (e) {
        console.log(e.message)
      }
    },
    async getSpecificOperation(operationId) {
      this.operationDetails = await this.bridgeSDK.api.getOperation(operationId);
    }
  }
}
</script>