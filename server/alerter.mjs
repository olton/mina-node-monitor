import {nodeInfo} from "./node.mjs"
import {telegram} from "./telegram.mjs"
import {exec} from "child_process"
import {hostname} from "os"
import {getExplorerSummary} from "./explorer.mjs";

export const processAlerter = async (config) => {
    const {
        telegramToken,
        telegramChatIDAlert,
        blockDiff,
        restartAfterMax,
        restartAfterUnv,
        restartAfterPrev,
        restartAfterNotSynced,
        canRestartNode,
        restartCmd,
        alertInterval,
        observeExplorer,
        restartStateException = [],
        restartStateSyncedRules = []
    } = config
    const host = hostname()

    if (!config || !telegramToken || !telegramChatIDAlert) return

    let status = await nodeInfo('node-status', config)

    if (status && status.data && status.data.daemonStatus) {
        const {syncStatus, blockchainLength, highestBlockLengthReceived, highestUnvalidatedBlockLengthReceived, addrsAndPorts} = status.data.daemonStatus
        const ip = addrsAndPorts.externalIp
        const SYNCED = syncStatus === 'SYNCED'
        let OK_SYNCED = true, OK_MAX = true, OK_UNV = true, OK_PREV = true
        const sign = `\nHost: ${host}\nIP: ${ip}`

        const restart = (reason) => {
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

                message = `Restart command executed for ${sign}.\nWith result ${result}\nReason: ${reason}`

                await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})
            })
        }

        if (!SYNCED) {
            const message = `Node not synced, status ${syncStatus}!${sign}`

            await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})

            OK_SYNCED = false

            if (!restartStateException.includes(syncStatus)) {
                if (globalThis.restartTimerNotSynced / 60000 >= restartAfterNotSynced) {
                    globalThis.restartTimerNotSynced = 0
                    if (canRestartNode && restartCmd) {
                        restart('Long non-sync!')
                    }
                } else {
                    globalThis.restartTimerNotSynced += alertInterval
                }
            }
        } else /*SYNCED*/ {
            const nHeight = +blockchainLength
            const mHeight = +highestBlockLengthReceived
            const uHeight = +highestUnvalidatedBlockLengthReceived
            const pHeight = +globalThis.currentHeight
            const DIFF_MAX = mHeight - nHeight
            const DIFF_UNVALIDATED = uHeight - nHeight
            const DIFF_PREVIOUS_HEIGHT = pHeight - nHeight
            let message

            if (DIFF_MAX >= blockDiff) {
                OK_MAX = false
                message = `Difference block height detected! Height ${DIFF_MAX > 0 ? 'less' : 'more'} than max block length!\nDifference: ${DIFF_MAX} ${sign}`
                await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})

                if (restartStateSyncedRules.includes("MAX")) {
                    if (globalThis.restartTimerMax / 60000 >= restartAfterMax) {
                        globalThis.restartTimerMax = 0
                        if (canRestartNode && restartCmd) {
                            restart('Difference to max block length!')
                        }
                    } else {
                        globalThis.restartTimerMax += alertInterval
                    }
                }
            }

            if (DIFF_UNVALIDATED >= blockDiff) {
                OK_UNV = false
                message = `Difference block height detected! Height ${DIFF_UNVALIDATED > 0 ? 'less' : 'more'} than unvalidated block length!\nDifference: ${DIFF_UNVALIDATED} ${sign}`
                await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})

                if (restartStateSyncedRules.includes("UNV")) {
                    if (globalThis.restartTimerUnv / 60000 >= restartAfterUnv) {
                        globalThis.restartTimerUnv = 0
                        if (canRestartNode && restartCmd) {
                            restart('Difference to unvalidated block length!')
                        }
                    } else {
                        globalThis.restartTimerUnv += alertInterval
                    }
                }
            }

            if (globalThis.currentHeightCounter % 2 === 0 && DIFF_PREVIOUS_HEIGHT === 0) {
                OK_PREV = false
                message = `Hanging node detected! BLock height ${nHeight} equal to previous value at ${alertInterval * 2 / 60000} minutes! ${sign}`
                await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})

                if (restartStateSyncedRules.includes("PREV")) {
                    if (globalThis.restartTimerPrev / 60000 >= restartAfterPrev) {
                        globalThis.restartTimerPrev = 0
                        if (canRestartNode && restartCmd) {
                            restart('Long time equal to previous length!')
                        }
                    } else {
                        globalThis.restartTimerPrev += alertInterval
                    }
                }
            }
        }

        globalThis.currentHeight = +blockchainLength
        if (globalThis.currentHeightCounter === Number.MAX_SAFE_INTEGER) {
            globalThis.currentHeightCounter = 1
        } else {
            globalThis.currentHeightCounter++
        }

        if (OK_MAX) globalThis.restartTimerMax = 0
        if (OK_UNV) globalThis.restartTimerUnv = 0
        if (OK_PREV) globalThis.restartTimerPrev = 0
        if (OK_SYNCED) globalThis.restartTimerNotSynced = 0

        if (observeExplorer) {
            const explorer = await getExplorerSummary()
            if (globalThis.currentHeight > 0 && explorer && explorer.blockchainLength && blockchainLength) {
                const DIFF_EXPLORER = +globalThis.currentHeight - explorer.blockchainLength
                let message
                if (Math.abs(DIFF_EXPLORER) >= blockDiff) {
                    message = DIFF_EXPLORER < 0 ? `Node lags behind the Explorer in block height.` : `Node leads the Explorer by block height.`
                    message += `\nDifference: ${DIFF_EXPLORER}\nNode: ${globalThis.currentHeight}\nExplorer: ${explorer.blockchainLength}`
                    await telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})
                }
            }
        }
    }

    setTimeout(() => processAlerter(config), alertInterval)
}

