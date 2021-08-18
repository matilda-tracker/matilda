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
        theme: {},
        sideBarOpen: false,
        HRC1155TokenList: [],
        HRC721TokenList: [],
        HRC20TokenList: [],
        walletAddress: undefined,
        walletUsed: undefined,

        // METAMASK
        metaMaskChainStatus: undefined,
        metaMaskChainId: undefined,
        metaMaskLoggedIn: undefined,
        metaMaskConnected: undefined,
        metaMaskAccount: undefined,
        metaMaskWallet: undefined
    },
    getters: {
        harmonyMetrics: state => {
            return state.harmonyMetrics
        },
        theme: state => {
            return state.theme
        },
        sideBarOpen: state => {
            return state.sideBarOpen
        },
        HRC1155TokenList: state => {
            return state.HRC1155TokenList
        },
        HRC721TokenList: state => {
            return state.HRC721TokenList
        },
        HRC20TokenList: state => {
            return state.HRC20TokenList
        },
        walletAddress: state => {
            return state.walletAddress
        },
        walletUsed: state => {
            return state.walletUsed
        },

        // METAMASK
        metaMaskChainStatus: state => {
            return state.metaMaskChainStatus
        },
        metaMaskChainId: state => {
            return state.metaMaskChainId
        },
        metaMaskLoggedIn: state => {
            return state.metaMaskLoggedIn
        },
        metaMaskConnected: state => {
            return state.metaMaskConnected
        },
        metaMaskAccount: state => {
            return state.metaMaskAccount
        },
        setMetaMaskWallet: state => {
            return state.setMetaMaskWallet
        }
    },
    mutations: {
        SET_HARMONY_METRICS(state, value) {
          state.harmonyMetrics = value
        },
        SET_THEME(state, theme) {
            state.theme = theme
            localStorage.theme = theme
        },
        TOGGLE_SIDEBAR(state) {
            state.sideBarOpen = !state.sideBarOpen
        },
        SET_HRC1155_TOKEN_LIST(state, value) {
            state.HRC1155TokenList = value
        },
        SET_HRC721_TOKEN_LIST(state, value) {
            state.HRC721TokenList = value
        },
        SET_HRC20_TOKEN_LIST(state, value) {
            state.HRC20TokenList = value
        },
        SET_WALLET_ADDRESS(state, value) {
            state.walletAddress = value
        },
        SET_WALLET_USED(state, value) {
            state.walletUsed = value
        },

        // METAMASK
        SET_METAMASK_CHAIN_STATUS(state, value) {
            state.metaMaskChainStatus = value
        },
        SET_METAMASK_CHAIN_ID(state, value) {
            state.metaMaskChainId = value
        },
        SET_METAMASK_LOGGED_IN(state, value) {
            state.metaMaskLoggedIn = value
        },
        SET_METAMASK_CONNECTION_STATUS(state, value) {
            state.metaMaskConnected = value
        },
        SET_METAMASK_ACCOUNT(state, value) {
            state.metaMaskAccount = value
        },
        SET_METAMASK_WALLET(state, value) {
            state.metaMaskWallet = value
        }
    },
    actions: {
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
        setWalletAddress(context, value) {
            context.commit('SET_WALLET_ADDRESS', value)
        },
        setWalletUsed(context, value) {
            context.commit('SET_WALLET_USED', value)
        },
        toggleSidebar(context) {
            context.commit('TOGGLE_SIDEBAR')
        },

        // BLOCKS
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

        // METRICS
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
        async getTokens(context) {
            const [erc1155, erc721, erc20] = await Promise.all([
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc1155/address/${context.state.walletAddress}/balances`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc721/address/${context.state.walletAddress}/balances`),
                axios.get(`https://explorer-v2-api.hmny.io/v0/erc20/address/${context.state.walletAddress}/balances`)
            ])

            context.dispatch('setTokens', {erc1155, erc721, erc20})
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

            context.commit('SET_HRC1155_TOKEN_LIST', erc1155.data)
            context.commit('SET_HRC721_TOKEN_LIST', erc721.data)
            context.commit('SET_HRC20_TOKEN_LIST', erc20.data)
        },

        // METAMASK
        setMetaMaskChainStatus(context, value) {
            context.commit('SET_METAMASK_CHAIN_STATUS', value)
        },
        setMetaMaskChainId(context, value) {
            context.commit('SET_METAMASK_CHAIN_ID', value)
        },
        setMetaMaskLoggedIn(context, value) {
            context.commit('SET_METAMASK_LOGGED_IN', value)
        },
        setMetaMaskConnectionStatus(context, value) {
            context.commit('SET_METAMASK_CONNECTION_STATUS', value)
        },
        setMetaMaskAccount(context, value) {
            context.commit('SET_METAMASK_ACCOUNT', value)
        },
        setMetaMaskWallet(context, value) {
            context.commit('SET_METAMASK_WALLET', value)
        }
    }
})
