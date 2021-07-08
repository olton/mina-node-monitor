import {hostname} from "os"
import {getExplorerSummary} from "./explorer.mjs";
import {sendAlert, restart} from "./helpers.mjs";

export const processAlerter = async () => {
    if (!globalThis.config) return

    const {
        blockDiff = 2,
        blockDiffToRestart = 4,
        restartAfterPrev,
        restartAfterNotSynced,
        canRestartNode,
        restartCmd,
        alertInterval,
        observeExplorer,
        restartStateException = [],
        restartStateSyncedRules = [],
    } = globalThis.config

    const host = hostname()

    let status = globalThis.nodeInfo.nodeStatus

    if (status && status.data && status.data.daemonStatus) {
        const {syncStatus, blockchainLength, highestBlockLengthReceived, highestUnvalidatedBlockLengthReceived, addrsAndPorts, peers = 0} = status.data.daemonStatus
        const ip = addrsAndPorts.externalIp
        const SYNCED = syncStatus === 'SYNCED'
        let OK_SYNCED = true, OK_PREV = true
        const sign = `\nHost: ${host}\nIP: ${ip}`

        if (!SYNCED) {
            const blocks = `\nBlock height ${blockchainLength} of ${highestUnvalidatedBlockLengthReceived ? highestUnvalidatedBlockLengthReceived : highestBlockLengthReceived}`
            const message = `Node not synced, status ${syncStatus} ${syncStatus === 'CATCHUP' ? blocks : ''} !${sign}`

            sendAlert("NOT-SYNCED", message)

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
            const DIFF_MAX = mHeight - nHeight
            const DIFF_UNVALIDATED = uHeight - nHeight
            let message

            if (+peers <= 0) {
                message = `No peers! ${sign}`
                sendAlert("PEERS", message)
            }

            if (mHeight && DIFF_MAX >= blockDiff) {
                message = `MAX Fork detected!\nDifference: ${Math.abs(DIFF_MAX)}\nHeight: ${nHeight}\nMax: ${mHeight} ${sign}`
                sendAlert("MAX", message)

                if (restartStateSyncedRules.includes("MAX")) {
                    if (DIFF_MAX >= blockDiffToRestart) {
                        if (canRestartNode && restartCmd) {
                            restart('MAX Fork!')
                        }
                    }
                }
            }

            if (mHeight && DIFF_MAX < 0 && Math.abs(DIFF_MAX) >= blockDiff) {
                message = `MAX Forward Fork detected!\nDifference: ${Math.abs(DIFF_MAX)}\nHeight: ${nHeight}\nMax: ${mHeight} ${sign}`
                sendAlert("FORWARD-MAX", message)

                if (restartStateSyncedRules.includes("FORWARD-MAX")) {
                    if (DIFF_MAX >= blockDiffToRestart) {
                        if (canRestartNode && restartCmd) {
                            restart('MAX Forward Fork!')
                        }
                    }
                }
            }

            if (uHeight && DIFF_UNVALIDATED >= blockDiff) {
                message = `Fork detected!\nHeight ${DIFF_UNVALIDATED > 0 ? 'less' : 'more'} than unvalidated block length!\nDifference: ${Math.abs(DIFF_UNVALIDATED)}\nNode: ${nHeight}\nUnvalidated: ${uHeight} ${sign}`
                sendAlert("FORK", message)

                if (restartStateSyncedRules.includes("FORK")) {
                    if (DIFF_UNVALIDATED >= blockDiffToRestart) {
                        if (canRestartNode && restartCmd) {
                            restart('Node in Fork!')
                        }
                    }
                }
            }

            if (uHeight && DIFF_UNVALIDATED < 0 && Math.abs(DIFF_UNVALIDATED) >= blockDiff) {
                message = `Forward fork detected!\nHeight ${DIFF_UNVALIDATED > 0 ? 'less' : 'more'} than unvalidated block length!\nDifference: ${Math.abs(DIFF_UNVALIDATED)}\nNode: ${nHeight}\nUnvalidated: ${uHeight} ${sign}`
                sendAlert("FORWARD-FORK", message)

                if (restartStateSyncedRules.includes("FORWARD-FORK")) {
                    if (Math.abs(DIFF_UNVALIDATED) >= blockDiffToRestart) {
                        if (canRestartNode && restartCmd) {
                            restart('Node in Forward Fork!')
                        }
                    }
                }
            }

            if (globalThis.controlCounter % 2 === 0 && globalThis.currentControlHeight !== 0) {
                if (nHeight - globalThis.currentControlHeight === 0) {
                    OK_PREV = false
                    message = `Hanging node detected!\nBlock height ${nHeight} equal to previous value! ${sign}`

                    sendAlert("HANG", message)

                    if (restartStateSyncedRules.includes("PREV") || restartStateSyncedRules.includes("HANG")) {
                        if (globalThis.restartTimerPrev >= restartAfterPrev) {
                            globalThis.restartTimerPrev = 0
                            if (canRestartNode && restartCmd) {
                                restart('Long time equal to previous length!')
                            }
                        } else {
                            globalThis.restartTimerPrev++
                        }
                    }
                } else {
                    globalThis.currentControlHeight = globalThis.currentHeight
                }
            }

            globalThis.currentHeight = +blockchainLength
            if (globalThis.currentControlHeight === 0) {
                globalThis.currentControlHeight = globalThis.currentHeight
            }
        }

        if (globalThis.controlCounter === Number.MAX_SAFE_INTEGER) {
            globalThis.controlCounter = 1
        } else {
            globalThis.controlCounter++
        }

        if (OK_PREV) globalThis.restartTimerPrev = 0
        if (OK_SYNCED) globalThis.restartTimerNotSynced = 0

        if (SYNCED && globalThis.currentHeight > 0 && observeExplorer) {
            const explorer = await getExplorerSummary()
            if (explorer && explorer.blockchainLength && blockchainLength) {
                const DIFF_EXPLORER = +globalThis.currentHeight - explorer.blockchainLength
                let message
                if (Math.abs(DIFF_EXPLORER) >= blockDiff) {
                    message = DIFF_EXPLORER < 0 ? `Node lags behind the Explorer in block height.` : `Node leads the Explorer by block height.`
                    message += `\nDifference: ${DIFF_EXPLORER}\nNode: ${globalThis.currentHeight}\nExplorer: ${explorer.blockchainLength}${sign}`
                    sendAlert("EXPLORER", message)
                }
            }
        }
    }

    setTimeout(() => processAlerter(), alertInterval)
}
