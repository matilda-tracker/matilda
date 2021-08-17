import {mapGetters, mapActions} from 'vuex'
import {ethers} from 'ethers'

export default {
    computed: {
        ...mapGetters(['metaMaskLoggedIn', 'metaMaskAccount', 'metaMaskConnected'])
    },
    methods: {
        ...mapActions(['setWalletAddress', 'setWalletUsed', 'setMetaMaskChainStatus', 'setMetaMaskChainId', 'setMetaMaskAccount', 'setMetaMaskLoggedIn', 'setMetaMaskWallet', 'setMetaMaskConnectionStatus']),

        async connectMetaMask() {
            if (this.metaMaskAccount === true) {
                await this.disconnectMetaMask()
                return
            }

            if (typeof window.ethereum !== undefined) {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send("eth_requestAccounts", [])
                const signer = await provider.getSigner()
                const network = await provider.getNetwork()

                const account = await signer.getAddress()
                this.setMetaMaskAccount(account)
                this.setWalletAddress(account.toLowerCase())
                this.setMetaMaskChainId(network.chainId)

                if (network.chainId !== 1666600000) {
                    this.setMetaMaskChainStatus('wrong')
                    return
                } else {
                    this.setMetaMaskChainStatus('correct')
                }

                this.setMetaMaskWallet({signer})
                this.setMetaMaskLoggedIn(true)

                if (this.metaMaskLoggedIn === true) {
                    this.setMetaMaskConnectionStatus(!this.metaMaskConnected)
                    this.setWalletUsed('metamask')
                }
            }

        },

        async disconnectMetaMask() {
            await this.setDefaultWallet()
            this.setMetaMaskLoggedIn(false)
            this.setMetaMaskConnectionStatus(!this.metaMaskConnected)
        },

        async setDefaultWallet() {
            if (!this.metaMaskLoggedIn) {
                this.setMetaMaskAccount(["0x0000000000000000000000000000000000000003"])
            }
        }
    }
}