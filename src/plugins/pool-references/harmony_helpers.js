import {lookUpPrices} from './ethers_helper'
import {ethers} from 'ethers'

import HRC20_ABI from '../abi/POOL_HRC.json'
import UNI_ABI from '../abi/POOL_UNI.json'

const HarmonyTokens = [
    { "id": "binance-usd", "symbol": "bscBUSD", "contract": "0x0aB43550A6915F9f67d0c454C2E90385E6497EaA"},
    { "id": "tether", "symbol": "1USDT", "contract": "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f"},
    { "id": "harmony", "symbol": "WONE", "contract": "0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a"},
    { "id": "sushi", "symbol": "SUSHI", "contract": "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A"}
];

export async function getHarmonyPrices() {
    const idPrices = await lookUpPrices(HarmonyTokens.map(x => x.id))
    const prices = {}
    for (const bt of HarmonyTokens)
        if (idPrices[bt.id])
            prices[bt.contract] = idPrices[bt.id]
    return prices
}

export async function getHarmonyUniPool(App, pool, poolAddress, stakingAddress) {
    let q0, q1
    const reserves = await pool.getReserves()
    q0 = reserves._reserve0
    q1 = reserves._reserve1
    const decimals = await pool.decimals()
    const token0 = await pool.token0()
    const token1 = await pool.token1()
    return {
        symbol: await pool.symbol(),
        name: await pool.name(),
        address: poolAddress,
        token0,
        q0,
        token1,
        q1,
        totalSupply: await pool.totalSupply() / 10 ** decimals,
        stakingAddress: stakingAddress,
        staked: await pool.balanceOf(stakingAddress) / 10 ** decimals,
        decimals: decimals,
        unstaked: await pool.balanceOf(App.YOUR_ADDRESS) / 10 ** decimals,
        contract: pool,
        tokens: [token0, token1],
        is1inch: false
    }
}

export async function getHRC20(App, token, address, stakingAddress) {
    if (address === '0x0000000000000000000000000000000000000000') {
        return {
            address,
            name: 'Harmony',
            symbol: 'Harmony',
            totalSupply: 1e8,
            decimals: 18,
            staked: 0,
            unstaked: 0,
            contract: null,
            tokens: [address]
        }
    }
    const decimals = await token.decimals()
    return {
        address,
        name: await token.name(),
        symbol: await token.symbol(),
        totalSupply: await token.totalSupply(),
        decimals: decimals,
        staked: await token.balanceOf(stakingAddress) / 10 ** decimals,
        unstaked: await token.balanceOf(App.YOUR_ADDRESS) / 10 ** decimals,
        contract: token,
        tokens: [address]
    }
}

export async function getHarmonyStoredToken(App, tokenAddress, stakingAddress, type) {
    switch (type) {
        case 'uniswap':
            // eslint-disable-next-line no-case-declarations,no-undef
            let pool = new ethers.Contract(tokenAddress, UNI_ABI, App.provider)
            return await getHarmonyUniPool(App, pool, tokenAddress, stakingAddress)
        case 'hrc20':
            // eslint-disable-next-line no-case-declarations,no-undef
            let hrc20 = new ethers.Contract(tokenAddress, HRC20_ABI, App.provider)
            return await getHRC20(App, hrc20, tokenAddress, stakingAddress)
    }
}

export async function getHarmonyToken(App, tokenAddress, stakingAddress) {
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        return getHRC20(App, null, tokenAddress, '')
    }
    const type = window.localStorage.getItem(tokenAddress)
    if (type) return getHarmonyStoredToken(App, tokenAddress, stakingAddress, type)
    try {
        // eslint-disable-next-line no-undef
        const pool = new ethers.Contract(tokenAddress, UNI_ABI, App.provider)
        // eslint-disable-next-line no-unused-vars
        const _token0 = await pool.token0()
        const uniPool = await getHarmonyUniPool(App, pool, tokenAddress, stakingAddress)
        window.localStorage.setItem(tokenAddress, 'uniswap')
        return uniPool
        // eslint-disable-next-line no-empty
    } catch (err) {
    }
    try {
        // eslint-disable-next-line no-undef
        const hrc20 = new ethers.Contract(tokenAddress, HRC20_ABI, App.provider)
        console.log(hrc20)
        // eslint-disable-next-line no-unused-vars
        const _name = await hrc20.name()
        const hrc20tok = await getHRC20(App, hrc20, tokenAddress, stakingAddress)
        window.localStorage.setItem(tokenAddress, 'hrc20')
        return hrc20tok
    } catch (err) {
        console.log(err)
        console.log(`Couldn't match ${tokenAddress} to any known token type.`)
    }
}

export async function loadHarmonySynthetixPoolInfo(App, tokens, prices, stakingAbi, stakingAddress,
                                            rewardTokenFunction, stakeTokenFunction) {
    const STAKING_POOL = new ethers.Contract(stakingAddress, stakingAbi, App.provider)

    if (!STAKING_POOL.callStatic[stakeTokenFunction]) {
        console.log(`Couldn't find stake function ${stakeTokenFunction}`)
    }
    const stakeTokenAddress = await STAKING_POOL.callStatic[stakeTokenFunction]()

    const rewardTokenAddress = await STAKING_POOL.callStatic[rewardTokenFunction]()

    let stakeToken = await getHarmonyToken(App, stakeTokenAddress, stakingAddress)

    if (stakeTokenAddress.toLowerCase() === rewardTokenAddress.toLowerCase()) {
        stakeToken.staked = await STAKING_POOL.totalSupply() / 10 ** stakeToken.decimals
    }

    let newPriceAddresses = stakeToken.tokens.filter(x =>
        // eslint-disable-next-line no-undef
        !getParameterCaseInsensitive(prices, x))
    // eslint-disable-next-line no-undef
    let newPrices = await lookUpTokenPrices(newPriceAddresses)
    for (const key in newPrices) {
        if (newPrices[key]?.usd)
            prices[key] = newPrices[key]
    }
    let newTokenAddresses = stakeToken.tokens.filter(x =>
        // eslint-disable-next-line no-undef
        !getParameterCaseInsensitive(tokens, x))
    for (const address of newTokenAddresses) {
        tokens[address] = await getHarmonyToken(App, address, stakingAddress)
    }
    // eslint-disable-next-line no-undef
    if (!getParameterCaseInsensitive(tokens, rewardTokenAddress)) {
        tokens[rewardTokenAddress] = await getHarmonyToken(App, rewardTokenAddress, stakingAddress)
    }
    // eslint-disable-next-line no-undef
    const rewardToken = getParameterCaseInsensitive(tokens, rewardTokenAddress)

    const rewardTokenTicker = rewardToken.symbol

    // eslint-disable-next-line no-undef
    const poolPrices = getPoolPrices(tokens, prices, stakeToken, 'Harmony')

    if (!poolPrices) {
        console.log(`Couldn't calculate prices for pool ${stakeTokenAddress}`)
        return null
    }

    const stakeTokenTicker = poolPrices.stakeTokenTicker

    const stakeTokenPrice =
        // eslint-disable-next-line no-undef
        prices[stakeTokenAddress]?.usd ?? getParameterCaseInsensitive(prices, stakeTokenAddress)?.usd
    // eslint-disable-next-line no-undef
    const rewardTokenPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd

    const periodFinish = await STAKING_POOL.periodFinish()
    const rewardRate = await STAKING_POOL.rewardRate()
    const weeklyRewards = (Date.now() / 1000 > periodFinish) ? 0 : rewardRate / 1e18 * 604800

    const usdPerWeek = weeklyRewards * rewardTokenPrice

    const staked_tvl = poolPrices.staked_tvl

    const userStaked = await STAKING_POOL.balanceOf(App.YOUR_ADDRESS) / 10 ** stakeToken.decimals

    const userUnstaked = stakeToken.unstaked

    const earned = await STAKING_POOL.earned(App.YOUR_ADDRESS) / 10 ** rewardToken.decimals

    return {
        stakingAddress,
        poolPrices,
        stakeTokenAddress,
        rewardTokenAddress,
        stakeTokenTicker,
        rewardTokenTicker,
        stakeTokenPrice,
        rewardTokenPrice,
        weeklyRewards,
        usdPerWeek,
        staked_tvl,
        userStaked,
        userUnstaked,
        earned
    }
}

export async function loadHarmonySynthetixPool(App, tokens, prices, abi, address, rewardTokenFunction, stakeTokenFunction) {
    const info = await loadHarmonySynthetixPoolInfo(App, tokens, prices, abi, address, rewardTokenFunction, stakeTokenFunction)
    if (!info) return null
    // eslint-disable-next-line no-undef
    return await printSynthetixPool(App, info, 'Harmony')
}

export async function loadHarmonyBasisFork(data) {
    // eslint-disable-next-line no-undef
    const App = await init_ethers()

    console.log(`Initialized ${App.YOUR_ADDRESS}`)
    console.log('Reading smart contracts...\n')

    let tokens = {}
    let prices = {}
    let totalStaked = 0

    let p1 = await loadHarmonySynthetixPool(App, tokens, prices, data.PoolABI,
        data.SharePool.address, data.SharePool.rewardToken, data.SharePool.stakeToken)
    totalStaked += p1.staked_tvl

    if (data.SharePool2) {
        let p3 = await loadHarmonySynthetixPool(App, tokens, prices, data.PoolABI,
            data.SharePool2.address, data.SharePool2.rewardToken, data.SharePool2.stakeToken)
        totalStaked += p3.staked_tvl
    }

    let p2 = await loadHarmonySynthetixPool(App, tokens, prices, data.PoolABI,
        data.CashPool.address, data.CashPool.rewardToken, data.CashPool.stakeToken)
    totalStaked += p2.staked_tvl

    if (data.SeedBanks) {
        let p = await loadMultipleHarmonySynthetixPools(App, tokens, prices, data.SeedBanks)
        totalStaked += p.staked_tvl
        if (p.totalUserStaked > 0) {
            // eslint-disable-next-line no-undef
            console.log(`You are staking a total of $${formatMoney(p.totalUserStaked)} at an APR of ${(p.totalApr * 100).toFixed(2)}%\n`)
        }
    }

    if (!data.SeedBanks) {
        if (data.Boardrooms) {
            for (const boardroom of data.Boardrooms) {
                // eslint-disable-next-line no-undef
                let br = await loadBoardroom(App, prices, boardroom.address, data.Oracle, data.UniswapLP, data.Cash,
                    data.ShareTicker, data.CashTicker, data.ExpansionsPerDay, data.MaximumExpansion,
                    data.Decimals, boardroom.ratio, data.TargetMantissa)
                totalStaked += br.staked_tvl
            }
        } else {
            // eslint-disable-next-line no-undef
            let br = await loadBoardroom(App, prices, data.Boardroom, data.Oracle, data.UniswapLP, data.Cash,
                data.ShareTicker, data.CashTicker, data.ExpansionsPerDay, data.MaximumExpansion,
                data.Decimals, 1, data.TargetMantissa)
            totalStaked += br.staked_tvl
        }
    }

    // eslint-disable-next-line no-undef
    console.log(`Total staked: $${formatMoney(totalStaked)}`)

    // eslint-disable-next-line no-undef
    hideLoading()
}

export async function getHarmonyPoolInfo(app, chefContract, chefAddress, poolIndex, pendingRewardsFunction) {
    const poolInfo = await chefContract.poolInfo(poolIndex)
    if (poolInfo.allocPoint === 0) {
        return {
            address: poolInfo.lpToken,
            allocPoints: poolInfo.allocPoint ?? 1,
            poolToken: null,
            userStaked: 0,
            pendingRewardTokens: 0,
        }
    }
    const poolToken = await getHarmonyToken(app, poolInfo.lpToken, chefAddress)
    const userInfo = await chefContract.userInfo(poolIndex, app.YOUR_ADDRESS)
    const pendingRewardTokens = await chefContract.callStatic[pendingRewardsFunction](poolIndex, app.YOUR_ADDRESS)
    const staked = userInfo.amount / 10 ** poolToken.decimals
    return {
        address: poolInfo.lpToken,
        allocPoints: poolInfo.allocPoint ?? 1,
        poolToken: poolToken,
        userStaked: staked,
        pendingRewardTokens: pendingRewardTokens / 10 ** 18,
    }
}

export async function loadHarmonyChefContract(App, tokens, prices, chef, chefAddress, chefAbi, rewardTokenTicker,
                                       rewardTokenFunction, rewardsPerBlockFunction, rewardsPerWeekFixed, pendingRewardsFunction,
                                       deathPoolIndices, hideFooter) {
    const chefContract = chef ?? new ethers.Contract(chefAddress, chefAbi, App.provider)

    const poolCount = parseInt(await chefContract.poolLength(), 10)
    const totalAllocPoints = await chefContract.totalAllocPoint()

    console.log(`Found ${poolCount} pools.\n`)

    console.log(`Showing incentivized pools only.\n`)

    tokens = {}


    const rewardTokenAddress = await chefContract.callStatic[rewardTokenFunction]()
    const rewardToken = await getHarmonyToken(App, rewardTokenAddress, chefAddress)
    const rewardsPerWeek = rewardsPerWeekFixed ??
        await chefContract.callStatic[rewardsPerBlockFunction]()
        / 10 ** rewardToken.decimals * 604800 / 3

    const poolInfos = await Promise.all([...Array(poolCount).keys()].map(async (x) =>
        await getHarmonyPoolInfo(App, chefContract, chefAddress, x, pendingRewardsFunction)))

    let tokenAddresses = [].concat.apply([], poolInfos.filter(x => x.poolToken).map(x => x.poolToken.tokens))

    await Promise.all(tokenAddresses.map(async (address) => {
        tokens[address] = await getHarmonyToken(App, address, chefAddress)
    }))

    if (deathPoolIndices) {   //load prices for the deathpool assets
        deathPoolIndices.map(i => poolInfos[i])
            .map(poolInfo =>
                // eslint-disable-next-line no-undef
                poolInfo.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken, 'Harmony') : undefined)
    }

    // eslint-disable-next-line no-undef
    const poolPrices = poolInfos.map(poolInfo => poolInfo.poolToken ? getPoolPrices(tokens, prices, poolInfo.poolToken, 'Harmony') : undefined)


    console.log('Finished reading smart contracts.\n')

    let aprs = []
    for (let i = 0; i < poolCount; i++) {
        if (poolPrices[i]) {
            // eslint-disable-next-line no-undef
            const apr = printChefPool(App, chefAbi, chefAddress, prices, tokens, poolInfos[i], i, poolPrices[i],
                totalAllocPoints, rewardsPerWeek, rewardTokenTicker, rewardTokenAddress,
                pendingRewardsFunction, null, null, 'bsc')
            aprs.push(apr)
        }
    }
    let totalUserStaked = 0, totalStaked = 0, averageApr = 0
    for (const a of aprs) {
        if (!isNaN(a.totalStakedUsd)) {
            totalStaked += a.totalStakedUsd
        }
        if (a.userStakedUsd > 0) {
            totalUserStaked += a.userStakedUsd
            averageApr += a.userStakedUsd * a.yearlyAPR / 100
        }
    }
    averageApr = averageApr / totalUserStaked

    if (!hideFooter) {
        // eslint-disable-next-line no-undef
        console.log(`Total Staked: $${formatMoney(totalStaked)}`)
        if (totalUserStaked > 0) {
            // eslint-disable-next-line no-undef
            console.log(`\nYou are staking a total of $${formatMoney(totalUserStaked)} at an average APR of ${(averageApr * 100).toFixed(2)}%`)
            console.log(`Estimated earnings:`
                // eslint-disable-next-line no-undef
                + ` Day $${formatMoney(totalUserStaked * averageApr / 365)}`
                // eslint-disable-next-line no-undef
                + ` Week $${formatMoney(totalUserStaked * averageApr / 52)}`
                // eslint-disable-next-line no-undef
                + ` Year $${formatMoney(totalUserStaked * averageApr)}\n`)
        }
    }

    return {prices, totalUserStaked, totalStaked, averageApr}
}

export async function loadMultipleHarmonySynthetixPools(App, tokens, prices, pools) {
    let totalStaked = 0, totalUserStaked = 0, individualAPRs = []
    const infos = await Promise.all(pools.map(p =>
        loadHarmonySynthetixPoolInfo(App, tokens, prices, p.abi, p.address, p.rewardTokenFunction, p.stakeTokenFunction)))
    for (const i of infos) {
        // eslint-disable-next-line no-undef
        let p = await printSynthetixPool(App, i, 'Harmony')
        totalStaked += p.staked_tvl || 0
        totalUserStaked += p.userStaked || 0
        if (p.userStaked > 0) {
            individualAPRs.push(p.userStaked * p.apr / 100)
        }
    }
    let totalApr = totalUserStaked === 0 ? 0 : individualAPRs.reduce((x, y) => x + y, 0) / totalUserStaked
    return {staked_tvl: totalStaked, totalUserStaked, totalApr}
}

export async function loadMultipleHarmonySynthetixPoolsSequential(App, tokens, prices, pools) {
    let totalStaked = 0, totalUserStaked = 0, individualAPRs = []
    for (const p of pools) {
        let res = await loadHarmonySynthetixPool(App, tokens, prices, p.abi, p.address, p.rewardTokenFunction, p.stakeTokenFunction)
        if (!res) continue
        totalStaked += res.staked_tvl || 0
        totalUserStaked += res.userStaked || 0
        if (res.userStaked > 0) {
            individualAPRs.push(res.userStaked * res.apr / 100)
        }
    }
    let totalApr = totalUserStaked === 0 ? 0 : individualAPRs.reduce((x, y) => x + y, 0) / totalUserStaked
    return {staked_tvl: totalStaked, totalUserStaked, totalApr}
}
