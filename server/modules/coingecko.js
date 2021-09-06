const fetch = require("node-fetch")
const {parseTime} = require("../helpers/parsers")

const getPriceInfo = async (currency = 'usd') => {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())
        const data = await fetch(url)

        if (!data.ok) {
            return null
        }

        return await data.json()
    } catch (e) {
        return null
    }
}

const processPriceInfo = async () => {
    const {currency, updateInterval} = globalThis.config.price
    const _updateInterval = parseTime(updateInterval)

    let data = await getPriceInfo(currency)

    if (data) {
        data[0].currency = currency
        globalThis.cache.price = data
    }

    setTimeout(processPriceInfo, _updateInterval)
}

module.exports = {
    processPriceInfo
}