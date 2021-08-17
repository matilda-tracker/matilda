<template>
  <div id="home">

    <!-- breadcrumb -->
    <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center text-blue-500">
          <a href="/" class="text-gray-700">Home</a>
          <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
          </svg>
        </li>
        <li class="flex items-center">
          <a href="#" class="text-gray-600">Tokens</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="flex flex-wrap -mx-3">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">Tokens</p>
        <div class="w-full bg-white border rounded-lg p-4">
          <div
              :key="token.tokenAddress"
              v-for="token in HRC20TokenList"
              class="w-full bg-gray-100 border rounded-lg flex justify-between items-center px-4 py-2 mb-4">
            <div>
              <router-link :to="{ name: 'search', params: { address: token.tokenAddress } }">
                <p class="font-semibold text-xl">
                  {{ token.tokenAddress | compressAddress }}
                </p>
                <p>
                  Click for holders list
                </p>
              </router-link>
            </div>
            <span class="text-green-500 font-semibold text-lg">
               {{ token.balance | formatNumber }}
            </span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import InfoBar from '../components/InfoBar'
import {mapGetters} from 'vuex'

export default {
  name: 'Tokens',
  filters: {
    compressAddress(address) {
      return (
          address.substr(0, 10) +
          "..." +
          address.substr(address.length - 5, address.length)
      );
    },
    formatNumber(nStr) {
      nStr += '';
      let x = nStr.split('.');
      let x1 = x[0];
      let x2 = x.length > 1 ? '.' + x[1] : '';
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }
  },
  components: {
    InfoBar
  },
  computed: {
    ...mapGetters([
      'HRC20TokenList'
    ])
  }
}
</script>