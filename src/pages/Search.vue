<template>
  <div id="home">

    <!-- breadcrumb -->
    <nav class="text-sm font-semibold mb-6" aria-label="Breadcrumb">
      <ol class="list-none p-0 inline-flex">
        <li class="flex items-center text-blue-500">
          <a href="/" class="text-gray-700">Home</a>
          <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
                d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
          </svg>
        </li>
        <li class="flex items-center">
          <a href="#" class="text-gray-600">Contract info</a>
        </li>
      </ol>
    </nav>
    <!-- breadcrumb end -->

    <div class="lg:flex justify-between items-center mb-6">
      <p class="text-2xl font-semibold mb-2 lg:mb-0">{{ contractAddress }}</p>
    </div>

    <div class="mb-6">
      <p>
        <strong>
          Contract creator:
        </strong>
        <span>
          {{ contractInfo.creatorAddress }}
        </span>
      </p>
      <p>
        <strong>
          Contract address:
        </strong>
        <span>
          {{ contractInfo.address }}
        </span>
      </p>

      <br>

      <p>
        <strong>
          Creation hash:
        </strong>
        <span>
          {{ contractInfo.transactionHash }}
        </span>
      </p>
      <p>
        <strong>
          Creation block number:
        </strong>
        <span>
          {{ contractInfo.blockNumber }}
        </span>
      </p>
      <p>
        <strong>
          Creation block hash:
        </strong>
        <span>
          {{ contractInfo.blockHash }}
        </span>
      </p>

      <br>

      <p>
        <strong>
          IPFS hash:
        </strong>
        <span>
          {{ contractInfo.IPFSHash }}
        </span>
      </p>
      <p>
        <strong>
          Solidity version:
        </strong>
        <span>
          {{ contractInfo.solidityVersion }}
        </span>
      </p>
      <p>
        <strong>
          ByteCode:
        </strong>
      </p>
      <div class="max-w-full max-h-48 break-all overflow-y-scroll border-2 p-2 border-gray-200 mt-2">
        <code>
          {{ contractInfo.bytecode }}
        </code>
      </div>
    </div>

    <div class="flex flex-wrap -mx-3 mt-16" v-if="holdersList.length > 0">
      <div class="w-full px-3">
        <p class="text-xl font-semibold mb-4">Top holders</p>
        <div class="w-full bg-white border rounded-lg p-4">
          <div
              :key="holder.ownerAddress"
              v-for="holder in holdersList"
              class="w-full bg-gray-100 border rounded-lg flex justify-between items-center px-4 py-2 mb-4">
            <div>
              <p class="font-semibold">
                {{ holder.ownerAddress }}
              </p>
            </div>
            <span class="text-green-500 font-semibold">
               {{ holder.balance }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import {ethers} from 'ethers'

export default {
  name: 'Search',
  filters: {
    formatNumber(nStr) {
      nStr += '';
      let x = nStr.split('.');
      let x1 = x[0];
      let x2 = x.length > 1 ? '.' + x[1] : '';
      let rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    }
  },
  data() {
    return {
      contractAddress: '',
      contractInfo: {},
      holdersList: []
    }
  },
  created() {
    this.contractAddress = this.$route.params.address
  },
  async mounted() {
    const [contractInfo, holdersList] = await Promise.all([
      axios.get(`https://explorer-v2-api.hmny.io/v0/shard/0/address/${this.contractAddress}/contract`),
      axios.get(`https://explorer-v2-api.hmny.io/v0/erc20/token/${this.contractAddress}/holders`)
    ])

    this.contractInfo = contractInfo.data

    holdersList.data.map((token) => {
      token.balance = parseFloat(ethers.utils.formatEther(token.balance)).toFixed(4)
    })

    holdersList.data.sort((a, b) => {
      return b.balance - a.balance
    })
    this.holdersList = holdersList.data
  }
}
</script>