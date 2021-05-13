import fetch from "node-fetch"
import {nodeInfo} from "./node.mjs"
import {getExplorerSummary} from "./explorer.mjs"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"
import {exec} from "child_process"
import {parseTelegramChatIDs} from "./helpers.mjs"

export const processAlerter = async (config) => {
    const {telegramToken, telegramChatIDAlert, blockDiff, restartAfter, restartAfterNotSynced, canRestartNode, restartCmd, alertInterval} = config
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)
    const ids = parseTelegramChatIDs(telegramChatIDAlert)

    let status = await nodeInfo('node-status', config)

    if (!config || !telegramToken || !telegramChatIDAlert) return

    if (status && status.data && status.data.daemonStatus) {
        const {syncStatus, blockchainLength, highestUnvalidatedBlockLengthReceived, addrsAndPorts} = status.data.daemonStatus
        const ip = addrsAndPorts.externalIp
        const SYNCED = syncStatus === 'SYNCED'
        let OK = true, OK_SYNCED = true

        const restart = () => {
            exec(restartCmd, async (error, stdout, stderr) => {
                let message, result

                if (error) {
                    result = error.message
                } else
                if (stderr) {
                    result = stderr
                } else {
                    result = 'OK'
                }

                message = `Restart command executed for ${ip}. With result ${result}`

                for (const id of ids) {
                    await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
                }
            })
        }

        if (!SYNCED) {
            const message = `Node not synced, status ${syncStatus}! IP: ${ip}`

            for (const id of ids) {
                await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
            }

            OK_SYNCED = false

            if (globalThis.restartTimerNotSynced / 60000 >= restartAfter && globalThis.currentHeight === blockchainLength) {
                globalThis.restartTimerNotSynced = 0
                if (canRestartNode && restartCmd) {
                    restart()
                }
            } else {
                globalThis.restartTimerNotSynced += alertInterval
            }
        }

        let explorer = await getExplorerSummary()

        if (explorer && explorer.blockchainLength && blockchainLength) {

            const eHeight = +explorer.blockchainLength
            const nHeight = +blockchainLength
            const uHeight = +highestUnvalidatedBlockLengthReceived
            const DIFF = Math.abs(eHeight - nHeight) > blockDiff
            const U_DIFF = Math.abs(uHeight - nHeight) >= blockDiff

            if (DIFF || U_DIFF) {
                const message = U_DIFF
                    ? `Current height different from unvalidated block length, in value ${nHeight} of ${uHeight}!\nIP: ${ip}`
                    : eHeight > nHeight
                    ? `The Node lags behind Explorer, in value ${nHeight} of ${eHeight}!\nIP: ${ip}`
                    : `The Explorer lags behind Node, in value ${eHeight} of ${nHeight}!\nIP: ${ip}`

                for (const id of ids) {
                    await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
                }

                OK = false

                if (SYNCED) {
                    if (globalThis.restartTimer / 60000 >= restartAfter) {
                        globalThis.restartTimer = 0
                        if (canRestartNode && restartCmd) {
                            restart()
                        }
                    } else {
                        globalThis.restartTimer += alertInterval
                    }
                }
            }
        }

        globalThis.currentHeight = blockchainLength

        if (OK) globalThis.restartTimer = 0
        if (OK_SYNCED) globalThis.restartTimerNotSynced = 0
    }

    setTimeout(() => processAlerter(config), alertInterval)
}

