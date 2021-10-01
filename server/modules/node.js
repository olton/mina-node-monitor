const {performance} = require("perf_hooks")
const {hostname} = require("os")
const {parseTime} = require("../helpers/parsers")
const {daemonStatus} = require("../helpers/node-data")
const {sendAlert} = require("../helpers/messangers")
const {fetchGraphQL, queryNodeStatus} = require("./graphql");
const {SYNC_STATE_UNKNOWN} = require("../helpers/consts");

const processCollectNodeInfo = async () => {
    const {
        graphql,
        nodeInfoCollectInterval = "30s",
        blockDiff = 2
    } = globalThis.config

    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    let start = performance.now()

    let nodeStatus = await fetchGraphQL(graphql, queryNodeStatus)
    let nextBlock = null, currentState = "UNKNOWN"

    globalThis.cache.responseTime = performance.now() - start

    let health = []

    if (globalThis.cache.health && globalThis.cache.health.includes("HANG")) {
        health.push("HANG")
    }

    const status = daemonStatus(nodeStatus)
    const sign = ` Host: ${hostname()}`
    const ver = nodeStatus ? nodeStatus.data.version : "UNKNOWN"

    if (status) {
        const {
            syncStatus,
            peers = [],
            blockchainLength: blockHeight = 0,
            highestBlockLengthReceived: maxHeight = 0,
            highestUnvalidatedBlockLengthReceived: unvHeight = 0,
            nextBlockProduction
        } = status

        if (globalThis.previousState !== syncStatus) {
            sendAlert("STATUS", `We got a new node status \`${syncStatus}\` (previous: \`${globalThis.previousState}\`)!${sign}`)
            globalThis.previousState = syncStatus
        }

        let times = nextBlockProduction ? nextBlockProduction.times : []

        if (times.length) {
            nextBlock = +(times[0].startTime)
        } else {
            nextBlock = 0
        }

        if (syncStatus === "SYNCED") {
            if (peers.length === 0) {
                health.push("NO PEERS")
            }

            if (blockHeight) {
                if (
                    (maxHeight && Math.abs(blockHeight - maxHeight) >= blockDiff) ||
                    (unvHeight && Math.abs(blockHeight - unvHeight) >= blockDiff)
                ) {
                    health.push("FORK")
                }
            }
        } else {
            health.push("NON-SYNCED")
        }

        currentState = syncStatus
    } else {
        if (globalThis.previousState !== SYNC_STATE_UNKNOWN) {
            sendAlert("STATUS", `We got a new node status \`UNKNOWN\` (old status: \`${globalThis.previousState}\`)!${sign}`)
        }
        globalThis.previousState = SYNC_STATE_UNKNOWN
        health.push("UNKNOWN")
    }

    globalThis.cache.nodeStatus = nodeStatus
    globalThis.cache.daemon = status
    globalThis.cache.health = health
    globalThis.cache.nextBlock = nextBlock
    globalThis.cache.state = currentState
    globalThis.cache.peers = status ? status.peers : 0
    globalThis.cache.version = ver

    setTimeout(processCollectNodeInfo, _nodeInfoCollectInterval)
}

module.exports = {
    processCollectNodeInfo
}

