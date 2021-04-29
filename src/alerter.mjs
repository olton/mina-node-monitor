import fetch from "node-fetch"
import {nodeInfo} from "./node.mjs"
import {getExplorerSummary} from "./explorer.mjs"
import {TELEGRAM_BOT_URL} from "./telegram.js"

export const processAlerter = async (config) => {
    const BLOCK_DIFF = config.blockDiff
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", config.telegramToken)

    let status = await nodeInfo('node-status')

    if (!config || !config.telegramToken || !config.telegramChatID) return

    if (status && status.data && status.data.daemonStatus) {
        const {syncStatus, blockchainLength, addrsAndPorts} = status.data.daemonStatus
        const ip = addrsAndPorts.externalIp
        const ids = config.telegramChatID.split(",").map( v => v.trim() )
        let target

        if (syncStatus !== 'SYNCED') {
            // send sync status
            const message = `Node not synced, in status ${syncStatus}!\nIP: ${ip}`

            for (const id of ids) {
                target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
                await fetch(target)
            }
        }

        let explorer = await getExplorerSummary()

        if (explorer && explorer.blockchainLength && blockchainLength) {
            if (Math.abs(+explorer.blockchainLength - +blockchainLength) >= BLOCK_DIFF) {
                // send blocks diffs
                const message = `Blockchain length is incorrect, in value ${blockchainLength} of ${explorer.blockchainLength}!\nIP: ${ip}`

                for (const id of ids) {
                    target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
                    await fetch(target)
                }
            }
        }
    }

    setTimeout(() => processAlerter(config), config.alertInterval)
}

