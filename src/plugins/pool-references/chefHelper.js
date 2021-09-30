import axios from 'axios'
import {ethers} from 'ethers'
import HRC20_ABI from '../abi/POOL_HRC.json'

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []

export function getParameterCaseInsensitive(object, key) {
    return object[Object.keys(object)
        .find(k => k.toLowerCase() === key.toLowerCase())
        ]
}

export function formatMoney(amount, decimalCount = 2, decimal = '.', thousands = ',') {
    try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount

        const negativeSign = amount < 0 ? '-' : ''

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString()
        let j = (i.length > 3) ? i.length % 3 : 0

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '')
    } catch (e) {
        console.log(e)
    }
}

export async function lookUpPrices(idArray) {
    const prices = {}

    for (const id_chunk of chunk(idArray, 50)) {
        let ids = id_chunk.join('%2C')
        let res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)

        for (const [key, v] of Object.entries(res.data)) {
            if (v.usd) prices[key] = v
        }
    }

    return prices
}

export function getHrc20Prices(prices, pool) {
    let price = getParameterCaseInsensitive(prices, pool.address)?.usd
    let tvl = pool.totalSupply * price / 10 ** pool.decimals
    let stakedTVL = pool.staked * price
    let poolUrl = `https://explorer.harmony.one/address/${pool.address}`

    const name = `<a href='${poolUrl}' target='_blank'>${pool.symbol}</a>`

    return {
        stakedTVL,
        price,
        stakeTokenTicker: pool.symbol,
        pairLinks: {
            pairLink: name,
            addLiquidityLink: '',
            removeLiquidityLink: '',
            swapLink: '',
            price0: '',
            price1: '',
            totalStaked: `${pool.staked.toFixed(4)}`,
            totalStakedDollars: `$${formatMoney(stakedTVL)}`,
            tvl: `$${formatMoney(tvl)}`
        }
    }
}

export function returnChefPool(App, chefAbi, chefAddr, prices, tokens, poolInfo, poolIndex, poolPrices, totalAllocPoints, rewardsPerWeek, rewardTokenTicker, rewardTokenAddress, pendingRewardsFunction, fixedDecimals, claimFunction, chain, depositFee = 0, withdrawFee = 0) {
    fixedDecimals = fixedDecimals ?? 2
    const sp = (poolInfo.stakedToken == null) ? null : getHrc20Prices(prices, poolInfo.stakedToken, chain)

    let poolRewardsPerWeek = poolInfo.allocPoints / totalAllocPoints * rewardsPerWeek
    if (poolRewardsPerWeek === 0 && rewardsPerWeek !== 0) return

    const userStaked = poolInfo.userLPStaked ?? poolInfo.userStaked
    const rewardPrice = getParameterCaseInsensitive(prices, rewardTokenAddress)?.usd
    const stakedTVL = sp?.stakedTVL ?? poolPrices.stakedTVL

    const apr = returnAPR(rewardTokenTicker, rewardPrice, poolRewardsPerWeek, poolPrices.stakeTokenTicker, stakedTVL, userStaked, poolPrices.price, fixedDecimals)

    return {
        App,
        chefAbi,
        chefAddr,
        poolIndex,
        poolAddress: poolInfo.address,
        pendingRewardsFunction,
        rewardTokenTicker,
        stakeTokenTicker: poolPrices.stakeTokenTicker,
        unstaked: poolInfo.poolToken.unstaked,
        staked: poolInfo.userStaked,
        pendingRewards: poolInfo.pendingRewardTokens,
        fixedDecimals,
        claimFunction,
        rewardPrice,
        chain,
        depositFee,
        withdrawFee,
        apr
    }
}

export function returnAPR(rewardTokenTicker, rewardPrice, poolRewardsPerWeek, stakeTokenTicker, stakedTVL, userStaked, poolTokenPrice, fixedDecimals) {
    fixedDecimals = fixedDecimals ?? 2

    let usdPerWeek = poolRewardsPerWeek * rewardPrice
    let weeklyAPR = usdPerWeek / stakedTVL * 100
    let dailyAPR = weeklyAPR / 7
    let yearlyAPR = weeklyAPR * 52
    let userStakedUsd = userStaked * poolTokenPrice
    let userStakedPct = userStakedUsd / stakedTVL * 100
    let userWeeklyRewards = userStakedPct * poolRewardsPerWeek / 100
    let userDailyRewards = userWeeklyRewards / 7
    let userYearlyRewards = userWeeklyRewards * 52

    return {
        poolRewardsPerWeek: poolRewardsPerWeek,
        rewardPrice: rewardPrice,
        usdPerWeek: usdPerWeek,
        stakedTVL: stakedTVL,
        info: {
            perWeek: `${rewardTokenTicker} Per Week: ${poolRewardsPerWeek.toFixed(fixedDecimals)} ($${formatMoney(usdPerWeek)})`,
            collection: `APR: Day ${dailyAPR.toFixed(2)}% Week ${weeklyAPR.toFixed(2)}% Year ${yearlyAPR.toFixed(2)}%`,
            stakingCount: `You are staking ${userStaked.toFixed(fixedDecimals)} ${stakeTokenTicker} ($${formatMoney(userStakedUsd)}), ${userStakedPct.toFixed(2)}% of the pool.`,
            estimatedEarning: `Estimated ${rewardTokenTicker} earnings:`
                + ` Day ${userDailyRewards.toFixed(fixedDecimals)} ($${formatMoney(userDailyRewards * rewardPrice)})`
                + ` Week ${userWeeklyRewards.toFixed(fixedDecimals)} ($${formatMoney(userWeeklyRewards * rewardPrice)})`
                + ` Year ${userYearlyRewards.toFixed(fixedDecimals)} ($${formatMoney(userYearlyRewards * rewardPrice)})`
        },
        userStakedUsd,
        totalStakedUsd: stakedTVL,
        userStakedPct,
        yearlyAPR,
        userYearlyUsd: userYearlyRewards * rewardPrice
    }
}

export async function chefContractStake(chefAbi, chefAddress, poolIndex, stakeTokenAddr, App) {
    const signer = App.provider.getSigner()

    const STAKING_TOKEN = new ethers.Contract(stakeTokenAddr, HRC20_ABI, signer)
    const CHEF_CONTRACT = new ethers.Contract(chefAddress, chefAbi, signer)

    const currentTokens = await STAKING_TOKEN.balanceOf(App.YOUR_ADDRESS)
    const allowedTokens = await STAKING_TOKEN.allowance(App.YOUR_ADDRESS, chefAddress)

    let allow = Promise.resolve()

    if (allowedTokens / 1e18 < currentTokens / 1e18) {
        allow = STAKING_TOKEN.approve(chefAddress, ethers.constants.MaxUint256)
            .then((t) => {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(() => {
                alert('Try resetting your approval to 0 first')
            })
    }

    if (currentTokens / 1e18 > 0) {
        allow
            .then(async () => {
                CHEF_CONTRACT.deposit(poolIndex, currentTokens, {gasLimit: 500000})
                    .then((t) => {
                        App.provider.waitForTransaction(t.hash)
                    })
                    .catch(() => {
                        console.log('Something went wrong.')
                    })
            })
            .catch(() => {
                console.log('Something went wrong.')
            })
    } else {
        alert('You have no tokens to stake!')
    }
}

export async function chefContractUnstake(chefAbi, chefAddress, poolIndex, App, pendingRewardsFunction) {
    const signer = App.provider.getSigner()
    const CHEF_CONTRACT = new ethers.Contract(chefAddress, chefAbi, signer)

    const currentStakedAmount = (await CHEF_CONTRACT.userInfo(poolIndex, App.YOUR_ADDRESS)).amount
    const earnedTokenAmount = await CHEF_CONTRACT.callStatic[pendingRewardsFunction](poolIndex, App.YOUR_ADDRESS) / 1e18

    if (earnedTokenAmount > 0) {
        CHEF_CONTRACT.withdraw(poolIndex, currentStakedAmount, {gasLimit: 500000})
            .then((t) => {
                return App.provider.waitForTransaction(t.hash)
            })
    }
}

export async function chefContractClaim(chefAbi, chefAddress, poolIndex, App, pendingRewardsFunction, claimFunction) {
    const signer = App.provider.getSigner()

    const CHEF_CONTRACT = new ethers.Contract(chefAddress, chefAbi, signer)

    const earnedTokenAmount = await CHEF_CONTRACT.callStatic[pendingRewardsFunction](poolIndex, App.YOUR_ADDRESS) / 1e18

    if (earnedTokenAmount > 0) {
        if (claimFunction) {
            claimFunction(poolIndex, {gasLimit: 500000})
                .then((t) => {
                    return App.provider.waitForTransaction(t.hash)
                })
        } else {
            CHEF_CONTRACT.deposit(poolIndex, 0, {gasLimit: 500000})
                .then((t) => {
                    return App.provider.waitForTransaction(t.hash)
                })
        }
    }
}