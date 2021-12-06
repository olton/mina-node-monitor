const fetch = require("node-fetch")
const {parseTime} = require("../helpers/parsers")
const {sendMessage} = require("../helpers/messangers")
const {timestamp} = require("../helpers/timestamp");

const getPriceInfo = async (currency = 'usd') => {
    try {
        const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=%CURRENCY%&ids=mina-protocol`.replace("%CURRENCY%", currency.toLowerCase())
        const data = await fetch(url)

        return !data.ok ? null : await data.json()
    } catch (e) {
        return null
    }
}

const processPriceInfo = async () => {
    const {currency, updateInterval} = config.price
    const _updateInterval = parseTime(updateInterval)

    let data = await getPriceInfo(currency)

    if (Array.isArray(data)) {
        data[0].currency = currency
        globalThis.cache.price = data
    }

    setTimeout(processPriceInfo, _updateInterval)
}

const processPriceSend = async () => {
    if (!config) return

    const {price} = config
    const {currency = 'usd', sendInterval = 3600000} = price
    let _interval = parseTime(sendInterval)
    let data = cache.price

    if (data && data.length) {

        const mina = data[0]
        const message = `Mina price is \`${mina.current_price} ${currency.toUpperCase()}\`. Last updated at \`${timestamp("-", mina.last_updated)}\`.`

        sendMessage("PRICE", message)
    } else {
        _interval = parseTime("1m")
    }

    setTimeout(processPriceSend, _interval)
}

module.exports = {
    processPriceInfo,
    processPriceSend
}