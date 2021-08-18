import {ethers} from 'ethers'
import {getHarmonyToken, getHarmonyPrices} from '../harmonyHelper'
import {getHrc20Prices, getParameterCaseInsensitive, returnAPR} from "../chefHelper";
import HRC20_ABI from '../../abi/POOL_HRC.json'

const VIPER_SMARTCHEF_FACTORY_ABI = [{
    'inputs': [],
    'stateMutability': 'nonpayable',
    'type': 'constructor'
}, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'smartChef', 'type': 'address'}],
    'name': 'NewSmartChefContract',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address'
    }, {'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
    'name': 'OwnershipTransferred',
    'type': 'event'
}, {
    'inputs': [{
        'internalType': 'contract ICustomERC20',
        'name': '_stakedToken',
        'type': 'address'
    }, {'internalType': 'contract ICustomERC20', 'name': '_rewardToken', 'type': 'address'}, {
        'internalType': 'uint256',
        'name': '_rewardPerBlock',
        'type': 'uint256'
    }, {'internalType': 'uint256', 'name': '_startBlock', 'type': 'uint256'}, {
        'internalType': 'uint256',
        'name': '_endBlock',
        'type': 'uint256'
    }, {'internalType': 'uint256', 'name': '_poolLimitPerUser', 'type': 'uint256'}, {
        'internalType': 'address',
        'name': '_admin',
        'type': 'address'
    }], 'name': 'deployPool', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [],
    'name': 'owner',
    'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}]
const VIPER_SMARTCHEF_INITIALIZABLE_ABI = [{
    'inputs': [],
    'stateMutability': 'nonpayable',
    'type': 'constructor'
}, {
    'anonymous': false,
    'inputs': [{
        'indexed': false,
        'internalType': 'address',
        'name': 'tokenRecovered',
        'type': 'address'
    }, {'indexed': false, 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}],
    'name': 'AdminTokenRecovery',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address'}, {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
    }],
    'name': 'Deposit',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address'}, {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
    }],
    'name': 'EmergencyWithdraw',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'internalType': 'uint256', 'name': 'poolLimitPerUser', 'type': 'uint256'}],
    'name': 'NewPoolLimit',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'internalType': 'uint256', 'name': 'rewardPerBlock', 'type': 'uint256'}],
    'name': 'NewRewardPerBlock',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{
        'indexed': false,
        'internalType': 'uint256',
        'name': 'startBlock',
        'type': 'uint256'
    }, {'indexed': false, 'internalType': 'uint256', 'name': 'endBlock', 'type': 'uint256'}],
    'name': 'NewStartAndEndBlocks',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address'
    }, {'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
    'name': 'OwnershipTransferred',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': false, 'internalType': 'uint256', 'name': 'blockNumber', 'type': 'uint256'}],
    'name': 'RewardsStop',
    'type': 'event'
}, {
    'anonymous': false,
    'inputs': [{'indexed': true, 'internalType': 'address', 'name': 'user', 'type': 'address'}, {
        'indexed': false,
        'internalType': 'uint256',
        'name': 'amount',
        'type': 'uint256'
    }],
    'name': 'Withdraw',
    'type': 'event'
}, {
    'inputs': [],
    'name': 'PRECISION_FACTOR',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'SMART_CHEF_FACTORY',
    'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'accTokenPerShare',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'uint256', 'name': '_amount', 'type': 'uint256'}],
    'name': 'deposit',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'uint256', 'name': '_amount', 'type': 'uint256'}],
    'name': 'emergencyRewardWithdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'emergencyWithdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'endBlock',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'hasUserLimit',
    'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{
        'internalType': 'contract ICustomERC20',
        'name': '_stakedToken',
        'type': 'address'
    }, {'internalType': 'contract ICustomERC20', 'name': '_rewardToken', 'type': 'address'}, {
        'internalType': 'uint256',
        'name': '_rewardPerBlock',
        'type': 'uint256'
    }, {'internalType': 'uint256', 'name': '_startBlock', 'type': 'uint256'}, {
        'internalType': 'uint256',
        'name': '_endBlock',
        'type': 'uint256'
    }, {'internalType': 'uint256', 'name': '_poolLimitPerUser', 'type': 'uint256'}, {
        'internalType': 'address',
        'name': '_admin',
        'type': 'address'
    }], 'name': 'initialize', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [],
    'name': 'isInitialized',
    'outputs': [{'internalType': 'bool', 'name': '', 'type': 'bool'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'lastRewardBlock',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'owner',
    'outputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'address', 'name': '_user', 'type': 'address'}],
    'name': 'pendingReward',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'poolLimitPerUser',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'address', 'name': '_tokenAddress', 'type': 'address'}, {
        'internalType': 'uint256',
        'name': '_tokenAmount',
        'type': 'uint256'
    }], 'name': 'recoverWrongTokens', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'rewardPerBlock',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'rewardToken',
    'outputs': [{'internalType': 'contract ICustomERC20', 'name': '', 'type': 'address'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'stakedToken',
    'outputs': [{'internalType': 'contract ICustomERC20', 'name': '', 'type': 'address'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'startBlock',
    'outputs': [{'internalType': 'uint256', 'name': '', 'type': 'uint256'}],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'stopReward',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'address', 'name': 'newOwner', 'type': 'address'}],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'bool', 'name': '_hasUserLimit', 'type': 'bool'}, {
        'internalType': 'uint256',
        'name': '_poolLimitPerUser',
        'type': 'uint256'
    }], 'name': 'updatePoolLimitPerUser', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [{'internalType': 'uint256', 'name': '_rewardPerBlock', 'type': 'uint256'}],
    'name': 'updateRewardPerBlock',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'uint256', 'name': '_startBlock', 'type': 'uint256'}, {
        'internalType': 'uint256',
        'name': '_endBlock',
        'type': 'uint256'
    }], 'name': 'updateStartAndEndBlocks', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [{'internalType': 'address', 'name': '', 'type': 'address'}],
    'name': 'userInfo',
    'outputs': [{'internalType': 'uint256', 'name': 'amount', 'type': 'uint256'}, {
        'internalType': 'uint256',
        'name': 'rewardDebt',
        'type': 'uint256'
    }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{'internalType': 'uint256', 'name': '_amount', 'type': 'uint256'}],
    'name': 'withdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}]

const VIPER_SMARTCHEF_FACTORY_ADDR = '0x410ce9879d14919cbc9693406d5950a60d3b0f48'

const EXTRACTED_POOLS = [
    '0x5c84935da00817c167b3e2e857d9269f9e211334',
    '0xae2d26605c293d0c8b68c905f0dc81f1d3ac2ac1',
    '0xf37d2132c358cc51386fae9f8485d38d42be21a5',
    '0xf2ac00a3ba3e04cca11a1b62cf366b1c3fa2f196',
    '0xbd19b4af9e4a03575d92d127708b0c142a7ec1b7',
    '0x9b37d0017eae7a5027b1536f8c9f4b5cdbb971e2',
    '0x6cf157a593de05026b691dcd850c472c8cb75b89',
    '0xf33e9c1ad490d760e9a1ea9e24e56bdcdc87f279',
    '0x3e3a5850714541c573ecb746bdfb4900fd8717d7',
    '0xa58c2cbf2050f47749c44b6fb249ab77f109ef39',
    '0x2af8c7bfbc2ba194a4853262b1a3ec86595022d9',
    '0xa0cb12f792b11f4098a83fd4d5bc6fa02bfb0625',
    '0x55b20ba7b948a46b1c30a639b5b870614004a5ea',
    '0x3aecf4edec6ed3cdf5b7eebf73fd16e2e8319e1e',
    '0x75de75158b0ce2fe38eaf61632f96ecd713a6ff7',
    '0xe112217c21661623a90bc64f5cbe644906d9e923', // 0x231aa77c03c6883876c6ce9fb29f514341d158c35e0a9e99c9fdda5d10ff0dd4
]

const PRELOAD_PRICES_POOL = [
    '0x96025483bd32c645b822a5a08004b84d674537cb', // ONE-VIPER
]

const PRELOAD_TOKEN_INDICES = [
    '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a', // ONE
    '0xea589e93ff18b1a1f1e9bac7ef3e86ab62addc79', // VIPER
]

const LAST_EXTRACTED_BLOCK = 16009205
const BLOCKS_TO_EXTRACT = 1000

const FIXED_DECIMALS = 2

export async function main() {
    const App = {}

    App.web3Provider = window.ethereum
    App.provider = new ethers.providers.Web3Provider(window.ethereum)

    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    App.YOUR_ADDRESS = accounts[0]

    console.log(`Initialized ${App.YOUR_ADDRESS}`)
    console.log('Reading smart contracts...')

    const blockNumber = await App.provider.getBlockNumber()
    let pools = EXTRACTED_POOLS

    if (LAST_EXTRACTED_BLOCK + BLOCKS_TO_EXTRACT < blockNumber) {
        console.log(`Pools was last extracted on block ${LAST_EXTRACTED_BLOCK}.`)
        console.log(`Not querying for new pools for performance reasons.`)
        console.log(`Some newer pools may not show up.`)
    } else {
        const VIPER_SMARTCHEF_FACTORY = new ethers.Contract(VIPER_SMARTCHEF_FACTORY_ADDR, VIPER_SMARTCHEF_FACTORY_ABI, App.provider)
        const smartchefFilter = VIPER_SMARTCHEF_FACTORY.filters.NewSmartChefContract()

        try {
            const poolsDynExtracted = (await VIPER_SMARTCHEF_FACTORY.queryFilter(
                smartchefFilter,
                Math.max(blockNumber - BLOCKS_TO_EXTRACT, LAST_EXTRACTED_BLOCK)
            )).map(log => ethers.utils.hexDataSlice(log.topics[1], 12))

            if (poolsDynExtracted.length > 0) {
                console.log(`Found additional pools after last extracted.`)
                console.log(`Those pool might disappear from vfat in the future until it is added to vfat manually`)
            }

            console.log(poolsDynExtracted)
            pools = [].concat(pools, poolsDynExtracted)

        } catch (error) {
            console.error(error)
            console.log(`Pools was last extracted on block ${LAST_EXTRACTED_BLOCK}.`)
            console.log(`Some newer pools may not show up.`)
        }
    }

    const basePrices = await getHarmonyPrices()

    return await loadViperSmartChefContracts(App, basePrices, pools, blockNumber)
}

function getViperUniPair(token0, token1) {
    if (ethers.utils.hexlify(token0) > ethers.utils.hexlify(token1)) [token0, token1] = [token1, token0]
    return ethers.utils.hexDataSlice(
        ethers.utils.solidityKeccak256(['bytes', 'address', 'bytes', 'bytes'], [
            '0xff',
            '0x7D02c116b98d0965ba7B642ace0183ad8b8D2196',
            ethers.utils.solidityKeccak256(['address', 'address'], [token0, token1]),
            '0x162f79e638367cd45a118c778971dfd8d96c625d2798d3b71994b035cfe9b6dc'
        ]),
        12
    )
}

async function loadViperSmartChefContracts(App, prices, chefAddresses, blockNumber) {
    console.log(App)
    const poolCount = parseInt(chefAddresses.length, 10)

    console.log(`Found ${poolCount} pools.`)
    console.log(`Showing incentivized pools only.`)

    let tokens = {}

    const poolInfos = await Promise.all(chefAddresses.map(async (x) =>
        await getViperSmartChefPoolInfo(App, x, blockNumber)))

    await Promise.all(poolInfos.filter(x => x.stakedToken).map(async (x) => {
        tokens[x.stakedToken.address] = x.stakedToken
        tokens[x.rewardToken.address] = x.rewardToken
        if (x.stakedToken.tokens) {
            await Promise.all(x.stakedToken.tokens.map(async (x) => {
                tokens[x] = await getHarmonyToken(App, x, '0x0000000000000000000000000000000000000000')
            }))
        }
    }))

    await Promise.all(PRELOAD_PRICES_POOL.map(async (x) => {
        const pool = await getHarmonyToken(App, x, '0x0000000000000000000000000000000000000000')
        getHrc20Prices(prices, pool, 'Harmony')
    }))

    // TODO: multicall?
    await Promise.all(Object.keys(tokens).filter(x => (x !== 'undefined' && !x.tokens && !prices[x])).map(x =>
        Promise.all(PRELOAD_TOKEN_INDICES.map(
            async (index) => {
                const poolAddr = getViperUniPair(index, x)
                if (await App.provider.getCode(poolAddr) === ethers.utils.hexlify('0x')) return
                const pool = await getHarmonyToken(App, poolAddr, '0x0000000000000000000000000000000000000000')
                if (pool) getHrc20Prices(prices, pool, 'Harmony')
            }
        ))
    ))

    const poolPrices = poolInfos.map(poolInfo => poolInfo.stakedToken ? getHrc20Prices(prices, poolInfo.stakedToken, 'Harmony') : undefined)

    console.log('Finished reading smart contracts.')

    let aprs = []
    for (let i = 0; i < poolCount; i++) {
        if (poolInfos[i].rewardPerBlock && poolPrices[i]) {
            const apr = returnViperSmartChefPool(App, chefAddresses[i], prices, poolInfos[i], i, poolPrices[i])
            aprs.push(apr)
        } else console.log([i, chefAddresses[i], poolInfos[i].stakedToken, poolInfos[i].rewardToken])
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

    return {prices, totalUserStaked, totalStaked, averageApr, aprs}
}

async function getViperSmartChefPoolInfo(App, chefAddress, blockNumber) {
    const chefContract = new ethers.Contract(chefAddress, VIPER_SMARTCHEF_INITIALIZABLE_ABI, App.provider)
    const poolInfo = {
        stakedToken: await chefContract.stakedToken(),
        rewardToken: await chefContract.rewardToken(),
        rewardPerBlock: await chefContract.rewardPerBlock(),
        startBlock: await chefContract.startBlock(),
        endBlock: await chefContract.endBlock(),
    }

    const stakedToken = await getHarmonyToken(App, poolInfo.stakedToken, chefAddress)
    const rewardToken = await getHarmonyToken(App, poolInfo.rewardToken, chefAddress)

    const emptyPool = {
        stakedToken,
        rewardToken,
        rewardPerBlock: 0,
        userStaked: 0,
        pendingRewardTokens: 0,
    }

    if (rewardToken.staked === 0 || poolInfo.rewardPerBlock === 0 || blockNumber < poolInfo.startBlock || blockNumber > poolInfo.endBlock) return emptyPool

    const userInfo = await chefContract.userInfo(App.YOUR_ADDRESS)
    const pendingRewardTokens = await chefContract.pendingReward(App.YOUR_ADDRESS)
    const userStaked = userInfo.amount / 10 ** stakedToken.decimals

    return {
        stakedToken,
        rewardToken,
        rewardPerBlock: poolInfo.rewardPerBlock / 10 ** rewardToken.decimals,
        userStaked,
        pendingRewardTokens: pendingRewardTokens / 10 ** rewardToken.decimals,
    }
}

function returnViperSmartChefPool(App, chefAddr, prices, poolInfo, poolIndex, poolPrices) {
    const poolRewardsPerWeek = poolInfo.rewardPerBlock * 604800 / 2

    if (poolRewardsPerWeek === 0) return

    const userStaked = poolInfo.userStaked
    const rewardPrice = getParameterCaseInsensitive(prices, poolInfo.rewardToken.address)?.usd
    const stakedTVL = poolPrices.stakedTVL

    return returnAPR(poolInfo.rewardToken.symbol, rewardPrice, poolRewardsPerWeek, poolPrices.stakeTokenTicker, stakedTVL, userStaked, poolPrices.price, FIXED_DECIMALS)
}

export async function viperSmartChefContract_stake(chefAddress, stakeTokenAddr, App) {
    const signer = App.provider.getSigner()

    const STAKING_TOKEN = new ethers.Contract(stakeTokenAddr, HRC20_ABI, signer)
    const CHEF_CONTRACT = new ethers.Contract(chefAddress, VIPER_SMARTCHEF_INITIALIZABLE_ABI, signer)

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
            .then(async function () {
                CHEF_CONTRACT.deposit(currentTokens, {gasLimit: 500000})
                    .then(function (t) {
                        App.provider.waitForTransaction(t.hash).then(function () {

                        })
                    })
                    .catch(function () {
                        console.log('Something went wrong.')
                    })
            })
            .catch(function () {
                console.log('Something went wrong.')
            })
    } else {
        alert('You have no tokens to stake!!')
    }
}

export async function viperSmartChefContract_unstake(chefAddress, poolIndex, App) {
    const signer = App.provider.getSigner()

    const CHEF_CONTRACT = new ethers.Contract(chefAddress, VIPER_SMARTCHEF_INITIALIZABLE_ABI, signer)

    const currentStakedAmount = (await CHEF_CONTRACT.userInfo(poolIndex, App.YOUR_ADDRESS)).amount

    if (currentStakedAmount > 0) {

        CHEF_CONTRACT.withdraw(currentStakedAmount, {gasLimit: 500000})
            .then(function (t) {
                return App.provider.waitForTransaction(t.hash)
            })
            .catch(function () {

            })
    }
}

export async function viperSmartChefContract_claim(chefAddress, App) {
    const signer = App.provider.getSigner()

    const CHEF_CONTRACT = new ethers.Contract(chefAddress, VIPER_SMARTCHEF_INITIALIZABLE_ABI, signer)

    const earnedTokenAmount = await CHEF_CONTRACT.pendingReward(App.YOUR_ADDRESS) / 1e18

    if (earnedTokenAmount > 0) {
        CHEF_CONTRACT.deposit(0, {gasLimit: 500000})
            .then((t) => {
                return App.provider.waitForTransaction(t.hash)
            })
    }
}