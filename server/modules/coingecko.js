const fetch = require("node-fetch")
const {parseTime} = require("../helpers/parsers")

const getPriceInfo = async (currency = 'usd') => {
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

const processPriceInfo = async () => {
    const {currency, updateInterval} = globalThis.config.price
    const _updateInterval = parseTime(updateInterval)

    let data = await getPriceInfo(currency)

    if (data) {
        data[0].currency = currency
        globalThis.priceInfo = data
    }

    setTimeout(processPriceInfo, _updateInterval)
}

module.exports = {
    getPriceInfo,
    processPriceInfo
}