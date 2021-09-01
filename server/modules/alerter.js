const {hostname} = require("os")
const {getExplorerSummary} = require("./explorer")
const {sysInfo} = require("./system")
const {daemonStatus} = require("../helpers/node-data");
const {parseTime} = require("../helpers/parsers")
const {sendAlert} = require("../helpers/messangers")
const {restart} = require("../helpers/process")
const {deleteFromArray} = require("../helpers/arrays")

const processAlerter = async () => {
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
        hangInterval = 0,
        hangIntervalAlert = 0,
        memAlert = 0,
        memRestart = 0
    } = globalThis.config
    let reload
    const host = hostname()
    const mem = await sysInfo('mem')
    const usedMem = 100 - Math.round(mem.free * 100 / mem.total)
    const _alertInterval = parseTime(alertInterval)

    let status = daemonStatus(globalThis.nodeInfo.nodeStatus)

    if (status) {
        const {
            syncStatus,
            blockchainLength,
            highestBlockLengthReceived,
            highestUnvalidatedBlockLengthReceived,
            addrsAndPorts,
            peers = 0
        } = status
        const ip = addrsAndPorts.externalIp
        const SYNCED = syncStatus === 'SYNCED'
        const sign = `\nFrom: ${host} (${ip})`

        if (SYNCED) globalThis.restartTimerNotSynced = 0
        if (!SYNCED) globalThis.hangTimer = 0

        if (!SYNCED) {
            if (!restartStateException.includes(syncStatus)) {
                if (globalThis.restartTimerNotSynced >= restartAfterNotSynced) {
                    globalThis.restartTimerNotSynced = 0
                    if (canRestartNode && restartCmd) {
                        restart('Long non-sync!')
                    }
                } else {
                    globalThis.restartTimerNotSynced += _alertInterval
                }
            }
        } else /*SYNCED*/ {
            const nHeight = +blockchainLength
            const mHeight = +highestBlockLengthReceived
            const uHeight = +highestUnvalidatedBlockLengthReceived
            const DIFF_MAX = mHeight - nHeight
            const DIFF_UNVALIDATED = uHeight - nHeight
            let message

            if (globalThis.nodeMemoryUsage !== usedMem) {
                globalThis.nodeMemoryUsage = usedMem

                if (memAlert && usedMem >= memAlert) {
                    sendAlert("MEM", `The node ${host} uses ${usedMem}% of the memory`)
                }
            }

            if (canRestartNode && memRestart && usedMem >= memRestart) {
                restart(`Critical memory usage (${usedMem}%)`)
            }

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
            } else
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
            } else
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
            } else
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

            const _hangIntervalAlert = parseTime(hangIntervalAlert)
            const _hangIntervalRestart = parseTime(hangInterval)

            if (globalThis.currentControlHeight) { // We have a block height!
                if (hangIntervalAlert && globalThis.hangTimer >= _hangIntervalAlert) {

                    if (!globalThis.nodeInfo.health.includes("HANG")) {
                        globalThis.nodeInfo.health.push("HANG")
                    }
                    message = `Hanging node detected!\nBlock height ${nHeight} equal to previous value! ${sign}`
                    sendAlert("HANG", message)

                }

                if (hangInterval && globalThis.hangTimer >= _hangIntervalRestart) {

                    if (restartStateSyncedRules.includes("HANG") && (canRestartNode && restartCmd)) {
                        restart('Hanging node!')
                    }

                    globalThis.hangTimer = 0
                    globalThis.currentControlHeight = nHeight
                    deleteFromArray(globalThis.nodeInfo.health, "HANG")

                }
            }

            globalThis.hangTimer += _alertInterval
        }

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

        reload = _alertInterval
    } else {
        reload = 5000
    }

    setTimeout(processAlerter, reload)
}

module.exports = {
    processAlerter
}