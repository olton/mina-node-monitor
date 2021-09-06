const fetch = require("node-fetch")
const {performance} = require("perf_hooks")
const {hostname} = require("os")
const {parseTime} = require("../helpers/parsers")
const {daemonStatus} = require("../helpers/node-data")
const {sendAlert} = require("../helpers/messangers")
const {fetchGraphQL, queryNextBlock, queryBlockSpeed, queryNodeStatus, queryBalance, queryBlockChain, queryConsensus} = require("./graphql");
const {SYNC_STATE_UNKNOWN} = require("../helpers/consts");


async function getNextBlockTime(graphql){
    let time = await fetchGraphQL(graphql, queryNextBlock)
    if (!time || !time.data) {
        return null
    }
    try {
        return time.data.daemonStatus.nextBlockProduction.times
    } catch (e) {
        return null
    }
}

async function getBlockSpeed(graphql, length){
    let blocks = await fetchGraphQL(graphql, queryBlockSpeed, {maxLength: length})
    if (!blocks || !blocks.data) {
        return 0
    }

    const {bestChain: chain = []} = blocks.data

    if (!chain || !chain.length) {
        return 0
    }

    let speed, begin, end
    begin = +chain[0]["protocolState"]["blockchainState"]["date"]
    end = +chain[chain.length - 1]["protocolState"]["blockchainState"]["date"]
    speed = (end - begin) / length
    return speed
}

const processCollectNodeInfo = async () => {
    const {
        graphql,
        publicKey,
        blockSpeedDistance = 10,
        nodeInfoCollectInterval = 30000,
        blockDiff = 2
    } = globalThis.config

    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    let start = performance.now()

    let nodeStatus = await fetchGraphQL(graphql, queryNodeStatus)
    let balance = publicKey ? await fetchGraphQL(graphql, queryBalance, {publicKey}) : 0
    let blockchain = await fetchGraphQL(graphql, queryBlockChain)
    let consensus = await fetchGraphQL(graphql, queryConsensus)
    let blockSpeed = await getBlockSpeed(graphql, blockSpeedDistance)
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
            addrsAndPorts,
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
    globalThis.cache.balance = balance
    globalThis.cache.blockchain = blockchain
    globalThis.cache.consensus = consensus
    globalThis.cache.speed = blockSpeed
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
