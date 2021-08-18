<template>
  <div class="flex justify-between items-center cursor-pointer" @click="toggleTheme()">
    <div class="w-10 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out" :class="{ 'bg-green-400': theme === 'light'}">
      <div class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out" :class="{ 'translate-x-4': theme === 'light' }"></div>
    </div>
    <p class="text-xs my-auto pl-2">Lights {{ theme === 'light' ? 'off' : 'on'}}!</p>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex"

export default {
  computed: {
    ...mapGetters(['theme'])
  },
  methods: {
    ...mapActions(['toggleTheme', 'initTheme'])
  }
}
</script>