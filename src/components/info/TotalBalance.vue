<template>
  <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6">
    <i class="fas fa-money-check-alt mr-4 text-3xls"></i>

    <div class="text-gray-700">
      <p class="font-semibold text-3xl">${{ 0 | formatNumber}}</p>
      <p>Total balance</p>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TotalBalance',
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
}
</script>