<template>
  <!-- give the sidebar z-50 class so its higher than the navbar if you want to see the logo -->
  <!-- you will need to add a little "X" button next to the logo in order to close it though -->
  <div class="w-1/2 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 border-r z-30"
       :class="sideBarOpen ? '' : 'hidden'" id="main-nav">

    <div class="w-full h-20 border-b flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">
        <router-link :to="{ name: 'home' }">
          HARDASH
        </router-link>
      </p>
    </div>

    <div class="mb-4 px-4">
      <p class="pl-4 text-sm font-semibold mb-1">MAIN</p>
      <div
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <router-link :to="{name: 'home'}">
          <div class="w-full">
            <i class="fas fa-home mr-4"></i>
            <span class="text-gray-700">
            Dashboard
          </span>
          </div>
        </router-link>
      </div>
      <div
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <router-link :to="{name: 'tokens'}">
          <div class="w-full">
            <i class="fas fa-coins mr-4"></i>
            <span class="text-gray-700">
            Tokens
          </span>
          </div>
        </router-link>
      </div>
      <div
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <router-link :to="{name: 'nfts'}">
          <div class="w-full">
            <i class="fas fa-images mr-4"></i>
            <span class="text-gray-700">
            NFTs
          </span>
          </div>
        </router-link>
      </div>
      <div
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer">
        <router-link :to="{name: 'pools'}">
          <div class="w-full">
            <i class="fas fa-piggy-bank mr-4"></i>
            <span class="text-gray-700">
            Pools
          </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    ...mapState(['sideBarOpen'])
  }
}
</script>