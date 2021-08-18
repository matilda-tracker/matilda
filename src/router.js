import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Tokens from './pages/Tokens'
import NFTs from './pages/NFTs'
import Pools from './pages/Pools'
import Swap from './pages/Swap'
import Search from './pages/Search'

Vue.config.productionTip = false

Vue.use(Router)

const router = new Router({
    // scrollBehavior(to, from, savedPosition) {
    //     return {x: 0, y: 0}
    // },
    mode: "hash",
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/tokens',
            name: 'tokens',
            component: Tokens
        },
        {
            path: '/nfts',
            name: 'nfts',
            component: NFTs
        },
        {
            path: '/pool-references',
            name: 'pools',
            component: Pools
        },
        {
            path: '/swap',
            name: 'swap',
            component: Swap
        },
        {
            path: '/search/:address',
            name: 'search',
            component: Search
        },
        {
            path: '*',
            redirect: '/'
        }
    ]
})

export default router
