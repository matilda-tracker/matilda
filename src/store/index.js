import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {ethers} from 'ethers'
import BN from 'bn.js'

import {Harmony} from '@harmony-js/core'
import {ChainID, ChainType} from '@harmony-js/utils'

import artifact from '../plugins/abi/HRC20.json'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // WALLET
        walletAddress: undefined,
        walletUsed: undefined,
        walletConnected: undefined,
        wallet: undefined,

        // NETWORK
        chainId: undefined,

        // GENERAL
        theme: {},
        sideBarOpen: false,

        // METRICS
        harmonyMetrics: {
            onePrice: {
                weightedAvgPrice: 0,
                priceChangePercent: 0
            },
            shard0Latency: 0,
            shard1Latency: 0,
            shard2Latency: 0,
            shard3Latency: 0,
            averageLatency: 0
        },

        // USER SPECIFIC
        HRC1155TokenList: [],
        HRC721TokenList: [],
        HRC20TokenList: [],
        oneBalance: 0
    },
    getters: {
        // WALLET
        walletAddress: state => {
            return state.walletAddress
        },
        walletUsed: state => {
            return state.walletUsed
        },
        walletConnected: state => {
            return state.walletConnected
        },
        wallet: state => {
            return state.wallet
        },

        // NETWORK
        chainId: state => {
            return state.chainId
        },

        // GENERAL
        theme: state => {
            return state.theme
        },
        sideBarOpen: state => {
            return state.sideBarOpen
        },

        // METRICS
        harmonyMetrics: state => {
            return state.harmonyMetrics
        },

        // USER SPECIFIC
        HRC1155TokenList: state => {
            return state.HRC1155TokenList
        },
        HRC721TokenList: state => {
            return state.HRC721TokenList
        },
        HRC20TokenList: state => {
            return state.HRC20TokenList
        },
        oneBalance: state => {
            return state.oneBalance
        }
    },
    mutations: {
        // WALLET
        SET_WALLET_ADDRESS(state, value) {
            state.walletAddress = value
        },
        SET_WALLET_USED(state, value) {
            state.walletUsed = value
        },
        SET_WALLET_CONNECTION_STATUS(state, value) {
            state.walletConnected = value
        },
        SET_WALLET(state, value) {
            state.wallet = value
        },

        // NETWORK
        SET_CHAIN_ID(state, value) {
            state.chainId = value
        },

        // GENERAL
        SET_THEME(state, theme) {
            state.theme = theme
            localStorage.theme = theme
        },
        TOGGLE_SIDEBAR(state) {
            state.sideBarOpen = !state.sideBarOpen
        },

        // METRICS
        SET_HARMONY_METRICS(state, value) {
          state.harmonyMetrics = value
        },

        // USER SPECIFIC
        SET_HRC1155_TOKEN_LIST(state, value) {
            state.HRC1155TokenList = value
        },
        SET_HRC721_TOKEN_LIST(state, value) {
            state.HRC721TokenList = value
        },
        SET_HRC20_TOKEN_LIST(state, value) {
            state.HRC20TokenList = value
        },
        SET_ONE_BALANCE(state, value) {
            state.oneBalance = value
        }
    },
    actions: {
        // WALLET
        setWalletAddress(context, value) {
            context.commit('SET_WALLET_ADDRESS', value)
        },
        setWalletUsed(context, value) {
            context.commit('SET_WALLET_USED', value)
        },
        setWalletConnectionStatus(context, value) {
            context.commit('SET_WALLET_CONNECTION_STATUS', value)
        },
        setWallet(context, value) {
            context.commit('SET_WALLET', value)
        },

        // NETWORK
        setChainId(context, value) {
            context.commit('SET_CHAIN_ID', value)
        },

        // GENERAL
        toggleTheme({commit}) {
            switch (localStorage.theme) {
                case 'light':
                    commit('SET_THEME', 'dark')
                    break

                default:
                    commit('SET_THEME', 'light')
                    break
            }
        },
        initTheme({commit}) {
            const cachedTheme = localStorage.theme ? localStorage.theme : false
            //  `true` if the user has set theme to `dark` on browser/OS
            const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

            if (cachedTheme)
                commit('SET_THEME', cachedTheme)
            else if (userPrefersDark)
                commit('SET_THEME', 'dark')
            else
                commit('SET_THEME', 'light')

        },
        toggleSidebar(context) {
            context.commit('TOGGLE_SIDEBAR')
        },

        // METRICS
        getLatency(context, blocks) {
            const blocksTimestamp = blocks
                .map((b) => new Date(b.timestamp).getTime())
                .sort((a, b) => (a < b ? -1 : 1))

            const diffs = []

            for (let i = blocksTimestamp.length - 1; i > 0; i--) {
                diffs.push(blocksTimestamp[i] - blocksTimestamp[i - 1])
            }

            return diffs.reduce((acc, t) => acc + t, 0) / diffs.length / 1000
        },
        async getBlockChainData(context) {
            const [onePrice, txVolume, shard0, shard1, shard2, shard3] = await Promise.all([
                axios.get(`https://explorer-v2-api.hmny.io/v0/price/actual/ONEUSDT`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/metrics/transactionCount14d`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/shard/0/block`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/shard/1/block`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/shard/2/block`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/shard/3/block`)
            ])

            let fourteenDayTxVolume = 0

            await txVolume.data.map((tx) => {
                fourteenDayTxVolume += parseInt(tx.count)
            })

            const shard0Latency = await context.dispatch('getLatency', shard0.data)
            const shard1Latency = await context.dispatch('getLatency', shard1.data)
            const shard2Latency = await context.dispatch('getLatency', shard2.data)
            const shard3Latency = await context.dispatch('getLatency', shard3.data)

            const averageLatency = (shard0Latency + shard1Latency + shard2Latency + shard3Latency) / 4

            context.commit('SET_HARMONY_METRICS', {
                onePrice: onePrice.data,
                txVolume: txVolume.data,
                fourteenDayTxVolume,
                shard0Latency,
                shard1Latency,
                shard2Latency,
                shard3Latency,
                averageLatency
            })
        },

        // USER SPECIFIC
        async getTokens(context) {
            const [erc1155, erc721, erc20, one] = await Promise.all([
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc1155/address/${context.state.walletAddress}/balances`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc721/address/${context.state.walletAddress}/balances`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc20/address/${context.state.walletAddress}/balances`),
                axios.post('https://rpc.s0.t.hmny.io', {
                    'jsonrpc': '2.0',
                    'id': 1,
                    'method': 'hmyv2_getBalance',
                    'params': [
                        context.state.walletAddress
                    ]
                })
            ])

            context.dispatch('setTokens', {erc1155, erc721, erc20})
            context.commit('SET_ONE_BALANCE', one.data.result)
        },
        async setTokens(context, {erc1155, erc721, erc20}) {
            await erc20.data.map(async (token) => {

                const hmy = new Harmony('https://api.s0.t.hmny.io', {
                    chainType: ChainType.Harmony,
                    chainId: ChainID.HmyMainnet,
                })

                const contract = hmy.contracts.createContract(artifact.abi, token.tokenAddress)

                const decimals = await contract.methods.decimals().call()
                token.decimals = new BN(decimals, 16).toNumber()

                token.name = await contract.methods.name().call()
                token.symbol = await contract.methods.symbol().call()
                token.balance = parseFloat(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3)
            })

            await erc1155.data.map(async (token) => {

                const hmy = new Harmony('https://api.s0.t.hmny.io', {
                    chainType: ChainType.Harmony,
                    chainId: ChainID.HmyMainnet,
                })

                const contract = hmy.contracts.createContract(artifact.abi, token.tokenAddress)

                token.name = await contract.methods.name().call()
                token.symbol = await contract.methods.symbol().call()
                token.balance = parseFloat(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3)
            })

            await erc721.data.map(async (token) => {

                const hmy = new Harmony('https://api.s0.t.hmny.io', {
                    chainType: ChainType.Harmony,
                    chainId: ChainID.HmyMainnet,
                })

                const contract = hmy.contracts.createContract(artifact.abi, token.tokenAddress)

                token.name = await contract.methods.name().call()
                token.symbol = await contract.methods.symbol().call()
                token.balance = parseFloat(ethers.utils.formatUnits(token.balance, token.decimals)).toFixed(3)
            })

            context.commit('SET_HRC1155_TOKEN_LIST', erc1155.data)
            context.commit('SET_HRC721_TOKEN_LIST', erc721.data)
            context.commit('SET_HRC20_TOKEN_LIST', erc20.data)
        }
    }
})
