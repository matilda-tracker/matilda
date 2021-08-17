<template>
  <div class="w-full bg-white border text-blue-400 rounded-lg flex items-center p-6 mb-6 xl:mb-0">
    <i class="fas fa-images mr-4 text-3xl"></i>

    <div class="text-gray-700">
      <p class="font-semibold text-3xl">{{ HRC721TokenList.length + HRC1155TokenList.length }}</p>
      <p>NFTs owned</p>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'NFTsOwned',
  computed: {
    ...mapGetters([
      'HRC1155TokenList',
      'HRC721TokenList',
    ])
  }
}
</script>