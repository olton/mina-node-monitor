import fetch from "node-fetch"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"
import {parseTelegramChatIDs, timestamp} from "./helpers.mjs";
import {discord} from "./discord.mjs";

export const processPriceSend = async () => {
    if (!globalThis.config) return

    const {discordWebHook, telegramChatID, telegramToken, price} = globalThis.config
    const {currency = 'usd', interval = 3600000, targets = []} = price
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)

    if (!targets.length) return

    let data = globalThis.priceInfo

    if (data && data.length) {
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
    }

    setTimeout(processPriceSend, interval)
}

