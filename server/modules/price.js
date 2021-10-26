const fetch = require("node-fetch")
const {parseTime, parseTelegramChatIDs} = require("../helpers/parsers")
const {TELEGRAM_BOT_URL, discord} = require("../helpers/messangers")
const {logging} = require("../helpers/logs");

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
    const {currency, updateInterval} = globalThis.config.price
    const _updateInterval = parseTime(updateInterval)

    let data = await getPriceInfo(currency)

    if (Array.isArray(data)) {
        data[0].currency = currency
        globalThis.cache.price = data
    }

    setTimeout(processPriceInfo, _updateInterval)
}

const processPriceSend = async () => {
    if (!globalThis.config) return

    const {discordWebHook, telegramChatID, telegramToken, price} = globalThis.config
    const {currency = 'usd', sendInterval = 3600000, targets = []} = price
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)
    let _interval = parseTime(sendInterval)
    let data = globalThis.cache.price

    if (!targets.length) return

    if (data && data.length) {

        const mina = data[0]
        const message = `Current Mina price is ${mina.current_price} ${currency.toUpperCase()}`
        const ids = parseTelegramChatIDs(telegramChatID)

        if (telegramToken && targets.includes("TELEGRAM")) {
            for (const id of ids) {
                fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)).catch((e) => {
                    logging("Error! Can't send message to telegram")
                    logging(e.message)
                })
            }
        }

        if (discordWebHook && targets.includes("DISCORD")) {
            logging(message)
            discord(discordWebHook, message)
        }
    } else {
        _interval = parseTime("1m")
    }

    setTimeout(processPriceSend, _interval)
}

module.exports = {
    processPriceInfo,
    processPriceSend
}