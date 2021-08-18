import axios from 'axios'

const chunk = (arr, n) => arr.length ? [arr.slice(0, n), ...chunk(arr.slice(n), n)] : []

export async function lookUpPrices(id_array) {
    const prices = {}

    for (const id_chunk of chunk(id_array, 50)) {
        let ids = id_chunk.join('%2C')
        let res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)

        for (const [key, v] of Object.entries(res.data)) {
            if (v.usd) prices[key] = v
        }
    }

    return prices
}