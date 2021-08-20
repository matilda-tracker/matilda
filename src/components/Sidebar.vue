<template>
  <!-- give the sidebar z-50 class so its higher than the navbar if you want to see the logo -->
  <!-- you will need to add a little "X" button next to the logo in order to close it though -->
  <div
      class="w-2/3 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30"
      :class="sideBarOpen ? '' : 'hidden'" id="main-nav">

    <div class="w-full h-20 border-b border-gray-200 dark:border-gray-700 flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">
        <router-link :to="{ name: 'home' }">
          Matilda
        </router-link>
      </p>
    </div>

    <div class="mb-4 px-4">
      <p class="pl-4 text-sm font-semibold mb-1">MAIN</p>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'home'}">
          <div class="w-full">
            <i class="fas fa-home mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              Dashboard
            </span>
          </div>
        </router-link>
      </div>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'tokens'}">
          <div class="w-full">
            <i class="fas fa-coins mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              Tokens
            </span>
          </div>
        </router-link>
      </div>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'nfts'}">
          <div class="w-full">
            <i class="fas fa-images mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              NFTs
            </span>
          </div>
        </router-link>
      </div>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'pools'}">
          <div class="w-full">
            <i class="fas fa-piggy-bank mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              Pools
            </span>
          </div>
        </router-link>
      </div>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'swap'}">
          <div class="w-full">
            <i class="fas fa-exchange-alt mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              Swap
            </span>
          </div>
        </router-link>
      </div>
      <div
          @click="toggleSidebar()"
          class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
        <router-link :to="{name: 'bridge'}">
          <div class="w-full">
            <i class="fas fa-link mr-4 w-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
              Bridge
            </span>
          </div>
        </router-link>
      </div>
      <div>
        <div
            @click="toggleSidebar()"
            v-if="walletUsed === 'onewallet'"
            class="w-full items-center text-blue-400 py-2 pl-4 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
          <router-link :to="{name: 'staking'}">
            <div class="w-full">
              <i class="fas fa-handshake mr-4 w-4"></i>
              <span class="text-gray-700 dark:text-gray-100">
                Staking
              </span>
            </div>
          </router-link>
        </div>
        <div v-else class="w-full items-center text-blue-400 py-2 pl-4 rounded-lg">
          <div class="w-full">
            <i class="fas fa-handshake mr-4 w-4"></i>
            <span class="line-through text-gray-300 dark:text-gray-700">
              Staking
            </span>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700">

    <harmony-metrics></harmony-metrics>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import HarmonyMetrics from './info/HarmonyMetrics'

export default {
  name: 'Sidebar',
  components: {
    HarmonyMetrics
  },
  computed: {
    ...mapGetters(['walletUsed', 'sideBarOpen'])
  },
  methods: {
    ...mapActions(['toggleSidebar'])
  }
}
</script>