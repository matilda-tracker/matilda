<template>
  <div class="flex flex-wrap -mx-3 mb-20">
    <div class="w-full md:w-1/2 xl:w-1/4 px-3">
      <total-balance></total-balance>
    </div>

    <div class="w-full md:w-1/2 xl:w-1/4 px-3">
      <tokens-owned></tokens-owned>
    </div>

    <div class="w-full md:w-1/2 xl:w-1/4 px-3">
      <nfts-owned></nfts-owned>
    </div>

    <div class="w-full md:w-1/2 xl:w-1/4 px-3">
      <pools-joined></pools-joined>
    </div>
  </div>
</template>

<script>
import TotalBalance from '../components/info/TotalBalance'
import TokensOwned from '../components/info/TokensOwned'
import NftsOwned from '../components/info/NFTsOwned'
import PoolsJoined from '../components/info/PoolsJoined'

export default {
  name: 'Home',
  components: {
    TotalBalance,
    TokensOwned,
    NftsOwned,
    PoolsJoined
  },
}
</script>