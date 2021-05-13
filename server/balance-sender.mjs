import fetch from "node-fetch"
import {nodeInfo} from "./node.mjs"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"
import {parseTelegramChatIDs} from "./helpers.mjs";

export const processBalanceSend = async (config) => {
    const {balanceSendInterval, telegramChatID, telegramToken, publicKey} = config
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)

    if (!config || !telegramToken || !telegramChatID || !balanceSendInterval || !publicKey) return

    let status = await nodeInfo('balance', config)

    if (status && status.data && status.data.account && status.data.account.balance) {
        const {total, liquid, locked, unknown, blockHeight} = status.data.account.balance
        const message =
`
Balance: ${(total / 10**9).toFixed(4)}
Liquid: ${(liquid / 10**9).toFixed(4)}
Locked: ${(locked / 10**9).toFixed(4)}
Height: ${blockHeight}
`
        const ids = parseTelegramChatIDs(telegramChatID)
        let target

        if (globalThis.currentBalance === total) {
            return
        }

        globalThis.currentBalance = total

        for (const id of ids) {
            target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
            await fetch(target)
        }
    }

    setTimeout(() => processBalanceSend(config), balanceSendInterval)
}

