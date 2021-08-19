<template>
  <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6">
    <i class="fas fa-money-check-alt mr-4 text-3xls"></i>

    <div class="text-gray-700">
      <p class="font-semibold text-3xl">${{ oneBalance * harmonyMetrics.onePrice.weightedAvgPrice | parseBigNumberToWei }}</p>
      <p>ONE balance</p>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'TotalBalance',
  computed: {
    ...mapGetters(['harmonyMetrics', 'oneBalance'])
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
      return (parseInt(x.toString().slice(0, -16)) / 100)
    }
  }
}
</script>