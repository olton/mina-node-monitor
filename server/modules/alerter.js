const {sysInfo} = require("./system")
const {parseTime} = require("../helpers/parsers")
const {sendAlert} = require("../helpers/messangers")
const {restart} = require("../helpers/process")
const {deleteFromArray} = require("../helpers/arrays")
const {secondsToTime} = require("../helpers/timestamp");

const processAlerter = async () => {
    if (!globalThis.config) return

    const {
        blockDiff = 3,
        blockDiffToRestart = 10,
        restartAfterNotSynced,
        canRestartNode,
        restartCmd,
        alertInterval,
        restartStateException = [],
        restartStateSyncedRules = [],
        hangInterval = 0,
        hangIntervalAlert = 0,
        memAlert = 0,
        memRestart = 0,
        restartAfterUptime = 0
    } = globalThis.config

    let reload

    const host = globalThis.host
    const mem = await sysInfo('mem')
    const usedMem = 100 - Math.round(mem.free * 100 / mem.total)
    const _alertInterval = parseTime(alertInterval)
    const _restartAfterUptime = parseTime(restartAfterUptime)
    const _restartAfterNotSynced = parseTime(restartAfterNotSynced)

    let daemon = globalThis.cache.daemon
    let explorerSummary = globalThis.cache.explorerSummary

    if (daemon) {
        const {
            syncStatus,
            blockchainLength,
            highestBlockLengthReceived,
            highestUnvalidatedBlockLengthReceived,
            addrsAndPorts,
            peers = 0,
            uptimeSecs
        } = daemon

        const SYNCED = syncStatus === 'SYNCED'

        if (SYNCED) globalThis.restartTimerNotSynced = 0
        if (!SYNCED) globalThis.hangTimer = 0

        if (!SYNCED) {
            if (!restartStateException.includes(syncStatus)) {
                if (globalThis.restartTimerNotSynced >= _restartAfterNotSynced) {
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
            const canCheckFork = mHeight && uHeight
            let message

            if (explorerSummary && explorerSummary.blockchainLength) {
                const exHeight = +(explorerSummary.blockchainLength)
                const exDiff = nHeight - exHeight

                if (blockDiff && nHeight && canCheckFork && exDiff !== 0 && Math.abs(exDiff) >= blockDiff) {
                    sendAlert("EXPLORER", `Node height \`${exDiff > 0 ? 'more' : 'less'}\` then Explorer by \`${Math.abs(exDiff)}\` blocks.`)
                }
            }

            if (_restartAfterUptime && +uptimeSecs * 1000 >= _restartAfterUptime) {
                const {d, h, m, s} = secondsToTime(+uptimeSecs)
                restart(`Restarted by long uptime ${d}d ${h}h ${m}m ${s}s.`)
            }

            if (globalThis.nodeMemoryUsage !== usedMem) {
                globalThis.nodeMemoryUsage = usedMem

                if (memAlert && usedMem >= memAlert) {
                    sendAlert("MEM", `High memory usage detected! The node uses \`${usedMem}%\` of the memory.`)
                }
            }

            if (canRestartNode && memRestart && usedMem >= memRestart) {
                restart(`Critical memory usage (${usedMem}%)`)
            }

            if (+peers <= 0) {
                message = `No peers!`
                sendAlert("PEERS", message)
            }

            if (canCheckFork) {
                if (blockDiff && mHeight && DIFF_MAX >= blockDiff) {
                    message = `Fork detected! Inconsistency with \`MAX\`. Diff: \`${Math.abs(DIFF_MAX)}\`, Height: \`${nHeight}\` instead of \`${mHeight}\`.`
                    sendAlert("MAX", message)

                    if (restartStateSyncedRules.includes("MAX")) {
                        if (blockDiffToRestart && DIFF_MAX >= blockDiffToRestart) {
                            if (canRestartNode && restartCmd) {
                                restart('MAX Fork!')
                            }
                        }
                    }
                } else if (blockDiff && mHeight && DIFF_MAX < 0 && Math.abs(DIFF_MAX) >= blockDiff) {
                    message = `Forward Fork detected! Inconsistency with \`MAX\`. Diff: \`${Math.abs(DIFF_MAX)}\`, Height: \`${nHeight}\` instead of \`${mHeight}\`.`
                    sendAlert("FORWARD-MAX", message)

                    if (restartStateSyncedRules.includes("FORWARD-MAX")) {
                        if (blockDiffToRestart && DIFF_MAX >= blockDiffToRestart) {
                            if (canRestartNode && restartCmd) {
                                restart('MAX Forward Fork!')
                            }
                        }
                    }
                } else if (blockDiff && uHeight && DIFF_UNVALIDATED >= blockDiff) {
                    message = `Fork detected! Inconsistency with \`MAX UNVALIDATED\`. Diff: \`${Math.abs(DIFF_UNVALIDATED)}\`, Height: \`${nHeight}\` instead of \`${uHeight}\`.`
                    sendAlert("FORK", message)

                    if (restartStateSyncedRules.includes("FORK")) {
                        if (blockDiffToRestart && DIFF_UNVALIDATED >= blockDiffToRestart) {
                            if (canRestartNode && restartCmd) {
                                restart('Node in Fork!')
                            }
                        }
                    }
                } else if (blockDiff && uHeight && DIFF_UNVALIDATED < 0 && Math.abs(DIFF_UNVALIDATED) >= blockDiff) {
                    message = `Forward Fork detected! Inconsistency with \`MAX UNVALIDATED\`. Diff: \`${Math.abs(DIFF_UNVALIDATED)}\`, Height: \`${nHeight}\` instead of \`${uHeight}\`.`
                    sendAlert("FORWARD-FORK", message)

                    if (restartStateSyncedRules.includes("FORWARD-FORK")) {
                        if (blockDiffToRestart && Math.abs(DIFF_UNVALIDATED) >= blockDiffToRestart) {
                            if (canRestartNode && restartCmd) {
                                restart('Node in Forward Fork!')
                            }
                        }
                    }
                }
            }

            if (globalThis.currentControlHeight !== nHeight) {
                globalThis.hangTimer = 0
                globalThis.currentControlHeight = nHeight
                deleteFromArray(globalThis.cache.health, "HANG")
            }

            const _hangIntervalAlert = parseTime(hangIntervalAlert)
            const _hangIntervalRestart = parseTime(hangInterval)

            if (globalThis.currentControlHeight) { // We have a block height!
                if (hangIntervalAlert && globalThis.hangTimer >= _hangIntervalAlert) {

                    if (!globalThis.cache.health.includes("HANG")) {
                        globalThis.cache.health.push("HANG")
                    }
                    message = `Hanging node detected! Block height \`${nHeight}\` same as previous value for a long time - \`${secondsToTime(hangTimer/1000).m}\` minutes!`
                    sendAlert("HANG", message)
                }

                if (hangInterval && globalThis.hangTimer >= _hangIntervalRestart) {

                    if (restartStateSyncedRules.includes("HANG") && (canRestartNode && restartCmd)) {
                        restart('Hanging node!')
                    }

                    globalThis.hangTimer = 0
                    globalThis.currentControlHeight = nHeight
                    deleteFromArray(globalThis.cache.health, "HANG")

                }
            }

            globalThis.hangTimer += _alertInterval
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