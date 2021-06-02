import fetch from "node-fetch"
import {nodeInfo} from "./node.mjs"
import {TELEGRAM_BOT_URL} from "./telegram.mjs"
import {exec} from "child_process"
import {parseTelegramChatIDs} from "./helpers.mjs"
import {hostname} from "os"

export const processAlerter = async (config) => {
    const {telegramToken, telegramChatIDAlert, blockDiff, restartAfter, restartAfterNotSynced, canRestartNode, restartCmd, alertInterval} = config
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", telegramToken)
    const ids = parseTelegramChatIDs(telegramChatIDAlert)
    const host = hostname()

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

                message = `Restart command executed for ${host} ${ip}. With result ${result}`

                for (const id of ids) {
                    await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
                }
            })
        }

        if (!SYNCED) {
            const message = `Node not synced, status ${syncStatus}! ${host} IP: ${ip}`

            for (const id of ids) {
                await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
            }

            OK_SYNCED = false

            if (globalThis.restartTimerNotSynced / 60000 >= restartAfterNotSynced && globalThis.currentHeight === blockchainLength) {
                globalThis.restartTimerNotSynced = 0
                if (canRestartNode && restartCmd) {
                    restart()
                }
            } else {
                globalThis.restartTimerNotSynced += alertInterval
            }
        }

        if (+blockchainLength && +highestUnvalidatedBlockLengthReceived) {

            const nHeight = +blockchainLength
            const uHeight = +highestUnvalidatedBlockLengthReceived
            const DIFF = Math.abs(uHeight - nHeight)

            if (DIFF >= blockDiff) {
                const message = `Current height different from unvalidated block length on ${DIFF}, in value ${nHeight} of ${uHeight}!\n${host} IP: ${ip}`

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

