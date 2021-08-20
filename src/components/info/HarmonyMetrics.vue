<template>
  <div class="my-4 px-4">
      <p class="hidden md:block pl-4 text-sm font-semibold mb-4">Harmony metrics</p>
      <div class="mb-2">
        <p class="pl-4 text-sm">
          <strong>
            ONE price
          </strong>
        </p>
        <p class="pl-4 text-sm">
          $ {{ parseFloat(harmonyMetrics.onePrice.weightedAvgPrice).toFixed(2) }}
          ({{ parseFloat(harmonyMetrics.onePrice.priceChangePercent).toFixed(2) }}%)
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
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'HarmonyMetrics',
  computed: {
    ...mapGetters(['harmonyMetrics'])
  }
}
</script>