import fetch from "node-fetch"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"
import {parseTelegramChatIDs, timestamp} from "./helpers.mjs";
import {discord} from "./discord.mjs";
import {getPriceInfo} from "./coingecko.mjs";

export const processPriceSend = async (config) => {
    const {discordWebHook, telegramChatID, telegramToken} = config
    const {currency = 'usd', interval = 3600000, targets = []} = config.price
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)
    let price

    if (!config || targets.length === 0) return

    price = await getPriceInfo(currency)

    if (price && price.length) {
        const mina = price[0]
        const message = `Current Mina price is ${mina.current_price} ${currency.toUpperCase()}. Timestamp: ${timestamp()}`
        const ids = parseTelegramChatIDs(telegramChatID)

        if (telegramToken && targets.includes("TELEGRAM")) {
            for (const id of ids) {
                await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
            }
        }

        if (discordWebHook && targets.includes("DISCORD")) {
            await discord(discordWebHook, message)
        }
    }

    setTimeout(() => processPriceSend(config), interval)
}

