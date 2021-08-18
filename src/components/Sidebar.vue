<template>
  <!-- give the sidebar z-50 class so its higher than the navbar if you want to see the logo -->
  <!-- you will need to add a little "X" button next to the logo in order to close it though -->
  <div
      class="w-2/3 md:w-1/3 lg:w-64 fixed md:top-0 md:left-0 h-screen lg:block bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30"
      :class="sideBarOpen ? '' : 'hidden'" id="main-nav">

    <div class="w-full h-20 border-b border-gray-200 dark:border-gray-700 flex px-4 items-center mb-8">
      <p class="font-semibold text-3xl text-blue-400 pl-4">
        <router-link :to="{ name: 'home' }">
          HARDASH
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
            <i class="fas fa-home mr-4"></i>
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
            <i class="fas fa-coins mr-4"></i>
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
            <i class="fas fa-images mr-4"></i>
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
            <i class="fas fa-piggy-bank mr-4"></i>
            <span class="text-gray-700 dark:text-gray-100">
            Pools
          </span>
          </div>
        </router-link>
      </div>
    </div>

    <hr class="border-gray-200 dark:border-gray-700">

    <div class="my-4 px-4">
      <p class="hidden md:block pl-4 text-sm font-semibold mb-4">Harmony metrics</p>
      <div class="mb-2">
        <p class="pl-4 text-sm">
          <strong>
            ONE price
          </strong>
        </p>
        <p class="pl-4 text-sm">
          $ {{ parseFloat(harmonyMetrics.onePrice.weightedAvgPrice).toFixed(2) }} ({{ parseFloat(harmonyMetrics.onePrice.priceChangePercent).toFixed(2) }}%)
        </p>
      </div>
      <div class="hidden md:block mb-2">
        <p class="pl-4 text-sm">
          <strong>
            14 Day tx volume
          </strong>
        </p>
        <p class="pl-4 text-sm">{{ harmonyMetrics.fourteenDayTxVolume }}</p>
      </div>
      <div class="hidden md:block mb-2">
        <p class="pl-4 text-sm">
          <strong>
            Shard count
          </strong>
        </p>
        <p class="pl-4 text-sm">4</p>
      </div>
      <div class="mb-2">
        <p class="pl-4 text-sm">
          <strong>
            Shard latency
          </strong>
        </p>
        <p class="pl-4 text-sm">Shard 0: {{ harmonyMetrics.shard0Latency.toFixed(2) }}s</p>
        <p class="pl-4 text-sm">Shard 1: {{ harmonyMetrics.shard1Latency.toFixed(2) }}s</p>
        <p class="pl-4 text-sm">Shard 2: {{ harmonyMetrics.shard2Latency.toFixed(2) }}s</p>
        <p class="pl-4 text-sm">Shard 3: {{ harmonyMetrics.shard3Latency.toFixed(2) }}s</p>
        <p class="pl-4 text-sm mt-2">
          <strong>
            Average latency
          </strong>
        </p>
        <p class="pl-4 text-sm">
          {{ harmonyMetrics.averageLatency.toFixed(2) }}s
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    ...mapState(['sideBarOpen', 'harmonyMetrics'])
  },
  methods: {
    ...mapActions(['toggleSidebar'])
  }
}
</script>