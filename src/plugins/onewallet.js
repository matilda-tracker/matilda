import {fromBech32} from '@harmony-js/crypto'
import {HarmonyExtension} from '@harmony-js/core'
import {mapGetters, mapActions} from 'vuex'

export default {
    computed: {
        ...mapGetters(['walletAddress', 'walletConnected'])
    },
    methods: {
        ...mapActions(['setWallet', 'setWalletAddress', 'setWalletUsed', 'setWalletConnectionStatus', 'setChainId']),

        async connectOneWallet() {
            if (typeof window.onewallet !== undefined && window.onewallet.isOneWallet) {
                const oneWallet = window.onewallet

                const getAccount = await oneWallet.getAccount()

                let extension = new HarmonyExtension(window.onewallet)
                extension.setShardID(0)

                this.setChainId(extension.wallet.network.chain_id)
                this.setWallet(extension)
                this.setWalletAddress(fromBech32(getAccount.address).toLowerCase())
                this.setWalletConnectionStatus(true)
                this.setWalletUsed('onewallet')
            } else {
                console.log('No oneWallet installed...')
            }
        },

        async disconnectOneWallet() {
            await this.setDefaultWallet()
            this.setWalletConnectionStatus(!this.walletConnected)
        },

        async setDefaultWallet() {
            if (!this.walletConnected) {
                this.setWalletAddress(["0x0000000000000000000000000000000000000003"])
            }
        }
    }
}