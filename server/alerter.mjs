import {hostname} from "os"
import {getExplorerSummary} from "./explorer.mjs";
import {sendAlert, restart, deleteFromArray} from "./helpers.mjs";
import {sysInfo} from "./system.mjs";

export const processAlerter = async () => {
    if (!globalThis.config) return

    const {
        blockDiff = 2,
        blockDiffToRestart = 4,
        restartAfterNotSynced,
        canRestartNode,
        restartCmd,
        alertInterval,
        observeExplorer,
        restartStateException = [],
        restartStateSyncedRules = [],
        hangInterval = 1800000,
        hangIntervalAlert = 900000,
        memAlert = 90,
        memRestart = 0
    } = globalThis.config
    let reload
    const host = hostname()
    const mem = sysInfo('mem')
    const usedMem = 100 - Math.round(mem.free * 100 / mem.total)

    if (usedMem >= memAlert) {
        sendAlert("MEM", `The node uses more than ${usedMem}% of the memory`)
    }

    if (memRestart !== 0 && usedMem >= memRestart) {
        restart(`Critical memory usage (${usedMem}%)`)
    }

    let status = globalThis.nodeInfo.nodeStatus

    if (status && status.data && status.data.daemonStatus) {
        const {syncStatus, blockchainLength, highestBlockLengthReceived, highestUnvalidatedBlockLengthReceived, addrsAndPorts, peers = 0} = status.data.daemonStatus
        const ip = addrsAndPorts.externalIp
        const SYNCED = syncStatus === 'SYNCED'
        let OK_SYNCED = true
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

            if (globalThis.currentControlHeight !== nHeight) {
                globalThis.hangTimer = 0
                globalThis.currentControlHeight = nHeight
                deleteFromArray(globalThis.nodeInfo.health, "HANG")
            }

            if (globalThis.hangTimer >= hangIntervalAlert) {
                const DIFF_HANG = nHeight - globalThis.currentControlHeight === 0

                if (globalThis.currentControlHeight && DIFF_HANG) {
                    if (!globalThis.nodeInfo.health.includes("HANG")) {
                        globalThis.nodeInfo.health.push("HANG")
                    }
                    message = `Hanging node detected!\nBlock height ${nHeight} equal to previous value! ${sign}`
                    sendAlert("HANG", message)
                }
            }

            if (globalThis.hangTimer >= hangInterval) {
                const DIFF_HANG = nHeight - globalThis.currentControlHeight === 0

                if (globalThis.currentControlHeight && DIFF_HANG) {
                    if (restartStateSyncedRules.includes("HANG") && (canRestartNode && restartCmd)) {
                        restart('Hanging node!')
                    }
                }

                globalThis.hangTimer = 0
                globalThis.currentControlHeight = nHeight
                deleteFromArray(globalThis.nodeInfo.health, "HANG")
            }

            globalThis.hangTimer += alertInterval
        }

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

        reload = alertInterval
    } else {
        reload = 5000
    }

    setTimeout(processAlerter, reload)
}
