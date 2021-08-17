<template>
  <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6 xl:mb-0">
    <i class="fas fa-coins mr-4 text-3xl"></i>

    <div class="text-gray-700">
      <p class="font-semibold text-3xl">{{ HRC20TokenList.length }}</p>
      <p>Tokens Owned</p>
    </div>

  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'TokensOwned',
  computed: {
    ...mapGetters([
      'HRC20TokenList'
    ])
  }
}
</script>