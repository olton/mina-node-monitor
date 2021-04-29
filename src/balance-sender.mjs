import fetch from "node-fetch"
import {nodeInfo} from "./node.mjs"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"

export const processBalanceSend = async (config) => {
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", config.telegramToken)

    if (!config.publicKey) return
    if (!config.balanceSendInterval) return

    let status = await nodeInfo('balance', config)

    if (!config || !config.telegramToken || !config.telegramChatID) return

    if (status && status.data && status.data.account) {
        const {balance} = status.data.account
        const message = `Current balance: ${(balance.total / 10**9).toFixed(4)}\nliquid: ${(balance.liquid / 10**9).toFixed(4)}`
        const ids = config.telegramChatID.split(",").map( v => v.trim() )
        let target

        for (const id of ids) {
            target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
            await fetch(target)
        }
    }

    setTimeout(() => processBalanceSend(config), config.balanceSendInterval)
}
