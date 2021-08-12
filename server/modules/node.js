const fetch = require("node-fetch")
const {performance} = require("perf_hooks")
const {hostname} = require("os")
const {parseTime} = require("../helpers/parsers")
const {daemonStatus} = require("../helpers/node-data")
const {sendAlert} = require("../helpers/messangers")

const queryNodeStatus = `
query MyQuery {
  version
  syncStatus
  daemonStatus {
    syncStatus
    blockchainLength
    peers {
      host
      libp2pPort
      peerId
    }
    addrsAndPorts {
      libp2pPort
      externalIp
      clientPort
      bindIp
    }
    uptimeSecs
    highestBlockLengthReceived
    highestUnvalidatedBlockLengthReceived
    nextBlockProduction {
      times {
        endTime
        epoch
        globalSlot
        slot
        startTime
      }
    }
    blockProductionKeys
    snarkWorker
    snarkWorkFee
    consensusTimeNow {
      epoch
    }
  }
}
`;

const queryNextBlock = `
query MyQuery {
  version
  daemonStatus {
    nextBlockProduction {
      times {
        endTime
        epoch
        globalSlot
        slot
        startTime
      }
    }
  }
}
`;

const queryBalance = `
query ($publicKey: String!) {
  account(publicKey: $publicKey) {
    balance {
      total
      blockHeight
      liquid
      locked
      stateHash
      unknown
    }
  }
}
`;

const queryBlockChain = `
query MyQuery {
  bestChain(maxLength: 1) {
    protocolState {
      consensusState {
        blockHeight
        totalCurrency
        epochCount
        epoch
        slot
        slotSinceGenesis
      }
    }
  }
}
`;

const queryConsensus = `
query MyQuery {
  daemonStatus {
    consensusConfiguration {
      acceptableNetworkDelay
      delta
      epochDuration
      genesisStateTimestamp
      k
      slotDuration
      slotsPerEpoch
    }
    consensusTimeNow {
      startTime
      slot
      globalSlot
      epoch
      endTime
    }
    consensusTimeBestTip {
      startTime
      slot
      globalSlot
      epoch
      endTime
    }
  }
}
`;

const queryBlockSpeed = `
query ($maxLength: Int) {
  version
  bestChain(maxLength: $maxLength) {
    protocolState {
      blockchainState {
        date
      }
      consensusState {
        blockHeight
      }
    }
  }
}
`;

async function fetchGraphQL(addr, query, variables = {}) {
    try {
        const result = await fetch(
            `http://${addr}/graphql`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables,
                })
            }
        )

        return result.ok ? await result.json() : null
    } catch (error) {
        console.error("The Request to GraphQL war aborted! Reason: " + error.name)
        return null
    }
}

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

    globalThis.nodeInfo.state = "UNKNOWN"

    let start = performance.now()

    let nodeStatus = await fetchGraphQL(graphql, queryNodeStatus)
    let balance = publicKey ? await fetchGraphQL(graphql, queryBalance, {publicKey}) : 0
    let blockchain = await fetchGraphQL(graphql, queryBlockChain)
    let consensus = await fetchGraphQL(graphql, queryConsensus)
    let blockSpeed = await getBlockSpeed(graphql, blockSpeedDistance)
    let nextBlock = null

    globalThis.nodeInfo.responseTime = performance.now() - start

    let health = []

    if (globalThis.nodeInfo.health.includes("HANG")) {
        health.push("HANG")
    }

    const status = daemonStatus(nodeStatus)
    const sign = ` Host: ${hostname()}`

    if (status) {
        const {
            syncStatus,
            peers = 0,
            addrsAndPorts,
            blockchainLength: blockHeight = 0,
            highestBlockLengthReceived: maxHeight = 0,
            highestUnvalidatedBlockLengthReceived: unvHeight = 0,
            nextBlockProduction
        } = status

        const ip = addrsAndPorts.externalIp

        if (globalThis.nodeInfo.previousState !== syncStatus) {
            sendAlert("STATUS", `We got a new node status \`${syncStatus}\` (previous: \`${globalThis.nodeInfo.previousState}\`)!${sign}`)
            globalThis.nodeInfo.previousState = syncStatus
        }

        let times = nextBlockProduction ? nextBlockProduction.times : []

        if (times.length) {
            nextBlock = +(times[0].startTime)
        } else {
            nextBlock = 0
        }

        if (syncStatus === "SYNCED") {
            if (peers <= 0) {
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

        globalThis.nodeInfo.state = syncStatus
    } else {
        if (globalThis.nodeInfo.previousState !== 'UNKNOWN') {
            sendAlert("STATUS", `We got a new node status \`UNKNOWN\` (old status: \`${globalThis.nodeInfo.previousState}\`)!${sign}`)
        }
        globalThis.nodeInfo.previousState = 'UNKNOWN'
        health.push("UNKNOWN")
    }

    globalThis.nodeInfo.nodeStatus = nodeStatus
    globalThis.nodeInfo.balance = balance
    globalThis.nodeInfo.blockchain = blockchain
    globalThis.nodeInfo.consensus = consensus
    globalThis.nodeInfo.blockSpeed = blockSpeed
    globalThis.nodeInfo.health = health
    globalThis.nodeInfo.nextBlock = nextBlock

    setTimeout(processCollectNodeInfo, _nodeInfoCollectInterval)
}

module.exports = {
    getNextBlockTime,
    getBlockSpeed,
    processCollectNodeInfo
}
