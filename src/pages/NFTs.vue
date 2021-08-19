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
          <a href="#" class="text-gray-600 dark:text-gray-100">NFT</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="flex flex-wrap -mx-3">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">HRC721 tokens</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2">
          <div
              :key="`${token.tokenAddress}${token.tokenID}`"
              v-for="token in HRC721TokenList"
              class="w-full bg-gray-100 dark:bg-gray-900 border  border-white dark:border-gray-900 rounded-lg justify-between items-center px-4 py-2 my-3">
            <a :href="`https://explorer.harmony.one/inventory/erc721/${token.tokenAddress}/${token.tokenID}`" target="_blank">
              <div class="flex">
                <div class="my-auto w-auto">
                  <img class="w-28 h-auto"
                       :src="token.meta.image ? token.meta.image : 'https://upload.wikimedia.org/wikipedia/commons/2/24/NFT_Icon.png'"
                       alt="token.meta.name">
                </div>
                <div class="my-auto w-11/12 pl-8">
                  <p class="font-semibold text-xl">
                    {{ token.name }} ({{ token.symbol }})
                  </p>
                  <p class="break-all">
                    Token address: {{ token.tokenAddress }} <br>
                    Token id: {{ token.tokenID }}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3 mt-8">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">HRC1155 tokens</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2">
          <div
              :key="`${token.tokenAddress}${token.tokenID}`"
              v-for="token in HRC1155TokenList"
              class="w-full bg-gray-100 dark:bg-gray-900 border  border-white dark:border-gray-900 rounded-lg justify-between items-center px-4 py-2 my-3">
            <a :href="`https://explorer.harmony.one/inventory/erc1155/${token.tokenAddress}/${token.tokenID}`" target="_blank">
              <div class="flex">
                <div class="my-auto w-auto">
                  <img class="w-28 h-auto"
                       src="https://upload.wikimedia.org/wikipedia/commons/2/24/NFT_Icon.png"
                       alt="token.meta.name">
                </div>
                <div class="my-auto w-11/12 pl-8">
                  <p class="font-semibold text-xl">
                    {{ token.name }} ({{ token.symbol }})
                  </p>
                  <p class="break-all">
                    Token address: {{ token.tokenAddress }} <br>
                    Token id: {{ token.tokenID }}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Tokens',
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
  computed: {
    ...mapGetters([
      'HRC721TokenList',
      'HRC1155TokenList'
    ])
  }
}
</script>