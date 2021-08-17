import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {ethers} from 'ethers'

import {Harmony} from '@harmony-js/core'
import {ChainID, ChainType} from '@harmony-js/utils'

import artifact from '../plugins/abi/HRC20.json'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
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

                const contract = hmy.contracts.createContract(artifact.abi, token.tokenAddress);
                token.name = await contract.methods.name().call()

                token.balance = parseFloat(ethers.utils.formatEther(token.balance)).toFixed(4)
            })

            erc20.data.sort((a, b) => {
                return b.balance - a.balance
            })

            context.commit('SET_HRC1155_TOKEN_LIST', erc1155.data)
            context.commit('SET_HRC721_TOKEN_LIST', erc721.data)
            context.commit('SET_HRC20_TOKEN_LIST', erc20.data)
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
