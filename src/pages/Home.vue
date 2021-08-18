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
        <p class="text-xl font-semibold mb-4">Recent Transactions</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg p-4">
<!--          <div class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 mb-4">-->
<!--            <div>-->
<!--              <p class="font-semibold text-xl">0x987sv98wu....fh93h2h93r23</p>-->
<!--              <p>XYA</p>-->
<!--            </div>-->
<!--            <span class="text-green-500 font-semibold text-lg">23,297.40</span>-->
<!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfoBar from '../components/InfoBar'
import {mapGetters} from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['walletAddress'])
  },
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
  }
}
</script>