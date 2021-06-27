import fetch from "node-fetch"

export const getPriceInfo = async (currency = 'usd') => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())
    const data = await fetch(url)

    if (!data.ok) {
        return null
    }

    try {
        return await data.json()
    } catch (e) {
        return null
    }
}
