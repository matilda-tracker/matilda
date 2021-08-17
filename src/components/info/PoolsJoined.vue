<template>
  <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6">
    <i class="fas fa-piggy-bank mr-4 text-3xl"></i>

    <div class="text-gray-700">
      <p class="font-semibold text-3xl">0</p>
      <p>Pools joined</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'PoolsJoined',
  computed: {
    ...mapGetters([
      'HRC1155TokenList',
      'HRC721TokenList',
    ])
  }
}
</script>