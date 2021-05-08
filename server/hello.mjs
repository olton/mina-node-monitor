import fetch from "node-fetch"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"

export const processHello = async (config) => {
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", config.telegramToken)
    const ids = config.telegramChatID.split(",").map( v => v.trim() )
    const message = `Node says hello from ${config.host.split(":")[0]}`
    let target

    for (const id of ids) {
        target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
        await fetch(target)
    }
}
