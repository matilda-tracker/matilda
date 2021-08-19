<template>
  <div id='home'>

    <!-- breadcrumb -->
    <nav class='text-sm font-semibold mb-6' aria-label='Breadcrumb'>
      <ol class='list-none p-0 inline-flex'>
        <li class='flex items-center text-blue-500'>
          <a href='/' class='text-gray-700 dark:text-gray-100'>Home</a>
          <svg class='fill-current w-3 h-3 mx-3' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'>
            <path
                d='M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z'/>
          </svg>
        </li>
        <li class='flex items-center'>
          <a href='#' class='text-gray-600 dark:text-gray-100'>Swap</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="flex flex-wrap -mx-3">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">Validators</p>
        <div class="w-full bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-lg px-4 py-2">
          <div v-if="loading"
               class="w-full bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-3">
            <div class="w-full text-center">
              <p class="font-semibold text-xl">Loading validators...</p>
            </div>
          </div>
          <div
              v-else
              :key="validator.validator.identity + index"
              v-for="(validator, index) in allValidators"
              class="w-full flex bg-gray-100 dark:bg-gray-900 border border-white dark:border-gray-900 rounded-lg flex justify-between items-center px-4 py-2 my-3">
            <div class="w-full md:w-4/5">
              <router-link :to="{ name: 'validator', params: { address: validator.validator.address } }">
                <p class="font-semibold text-xl">
                  {{ validator.validator.name }}
                </p>

                <span class="md:hidden text-xs md:text-lg text-green-500 font-semibold">
                   Delegators: {{ validator.validator.delegations.length }} <br>
                    Delegated: {{ validator['total-delegation'] | parseBigNumberToWei | formatNumber }}
                </span>
                <p class="text-xs md:text-base">
                  Click for more information
                </p>
              </router-link>
            </div>

            <span class="w-1/5 hidden md:block text-xs md:text-lg text-green-500 font-semibold">
              Delegators: {{ validator.validator.delegations.length }} <br>
              Delegated: {{ validator['total-delegation'] | parseBigNumberToWei | formatNumber }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Staking',
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
    },
    parseBigNumberToWei(x) {
      if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1])
        if (e) {
          x *= Math.pow(10, e - 1)
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2)
        }
      } else {
        let e = parseInt(x.toString().split('+')[1])
        if (e > 20) {
          e -= 20
          x /= Math.pow(10, e)
          x += (new Array(e + 1)).join('0')
        }
      }
      return x.toString().slice(0, -18)
    }
  },
  data() {
    return {
      loading: true,
      allValidators: []
    }
  },
  async mounted() {
    await axios.post('https://rpc.s0.t.hmny.io', {
      'jsonrpc': '2.0',
      'id': 1,
      'method': 'hmyv2_getAllValidatorInformation',
      'params': [
        0
      ]
    }).then((res) => {
      this.allValidators = res.data.result
      this.loading = false
    })
  }
}
</script>