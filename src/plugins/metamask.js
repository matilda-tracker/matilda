import {mapGetters, mapActions} from 'vuex'
import {ethers} from 'ethers'

export default {
    computed: {
        ...mapGetters(['walletAddress', 'walletConnected'])
    },
    methods: {
        ...mapActions(['setWallet', 'setWalletAddress', 'setWalletUsed', 'setWalletConnectionStatus', 'setChainId']),

        async connectMetaMask() {
            if (typeof window.ethereum !== undefined) {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send("eth_requestAccounts", [])
                const signer = await provider.getSigner()
                const network = await provider.getNetwork()

                const account = await signer.getAddress()
                this.setWalletAddress(account.toLowerCase())
                this.setChainId(network.chainId)

                this.setWallet({signer})
                this.setWalletConnectionStatus(!this.walletConnected)
                this.setWalletUsed('metamask')
            } else {
                console.log('No metamask installed...')
            }
        },

        async disconnectMetaMask() {
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