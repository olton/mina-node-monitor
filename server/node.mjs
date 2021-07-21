import fetch from "node-fetch"
import {performance} from "perf_hooks"

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

export async function getNextBlockTime(graphql){
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

export const processCollectNodeInfo = async () => {
    const {
        graphql,
        publicKey,
        blockSpeedDistance = 10,
        nodeInfoCollectInterval = 30000,
        blockDiff = 2
    } = globalThis.config

    let start = performance.now()

    let nodeStatus = await fetchGraphQL(graphql, queryNodeStatus)
    let balance = publicKey ? await fetchGraphQL(graphql, queryBalance, {publicKey}) : 0
    let blockchain = await fetchGraphQL(graphql, queryBlockChain)
    let consensus = await fetchGraphQL(graphql, queryConsensus)
    let blockSpeed = await getBlockSpeed(graphql, blockSpeedDistance)
    let nextBlock = null

    globalThis.nodeInfo.responseTime = performance.now() - start

    //console.log("Node response time: ", (globalThis.nodeInfo.responseTime/1000).toFixed(2))

    let health = []

    if (globalThis.nodeInfo.health.includes("HANG")) {
        health.push("HANG")
    }

    if (nodeStatus && nodeStatus.data && nodeStatus.data.daemonStatus) {
        const {
            syncStatus,
            peers = 0,
            blockchainLength: blockHeight = 0,
            highestBlockLengthReceived: maxHeight = 0,
            highestUnvalidatedBlockLengthReceived: unvHeight = 0,
            nextBlockProduction
        } = nodeStatus.data.daemonStatus

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

            if (peers === 0) {
                health.push("NO-PEERS")
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
    } else {
        health.push("UNKNOWN")
    }

    globalThis.nodeInfo.nodeStatus = nodeStatus
    globalThis.nodeInfo.balance = balance
    globalThis.nodeInfo.blockchain = blockchain
    globalThis.nodeInfo.consensus = consensus
    globalThis.nodeInfo.blockSpeed = blockSpeed
    globalThis.nodeInfo.health = health
    // globalThis.nodeInfo.nextBlock = nextBlock

    setTimeout(processCollectNodeInfo, nodeInfoCollectInterval)
}
