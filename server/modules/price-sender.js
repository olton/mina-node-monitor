const fetch = require("node-fetch")
const {TELEGRAM_BOT_URL, discord} = require("../helpers/messangers")
const {parseTime, parseTelegramChatIDs} = require("../helpers/parsers")

const processPriceSend = async () => {
    if (!globalThis.config) return

    const {discordWebHook, telegramChatID, telegramToken, price} = globalThis.config
    const {currency = 'usd', sendInterval = 3600000, targets = []} = price
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)
    const _interval = parseTime(sendInterval)
    let data = globalThis.cache.price

    if (!targets.length) return
    if (!data || !data.length) return

    const mina = data[0]
    const message = `Current Mina price is ${mina.current_price} ${currency.toUpperCase()}`
    const ids = parseTelegramChatIDs(telegramChatID)

    if (telegramToken && targets.includes("TELEGRAM")) {
        for (const id of ids) {
            fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)).catch((e)=>{
                console.log("Error! Can't send message to telegram")
                console.log(e.message)
            })
        }
    }

    if (discordWebHook && targets.includes("DISCORD")) {
        discord(discordWebHook, message)
    }

    setTimeout(processPriceSend, _interval)
}

module.exports = {
    processPriceSend
}