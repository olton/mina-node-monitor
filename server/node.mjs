import fetch from "node-fetch"

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

        return result.ok ? await result.json() : {}
    } catch (error) {
        console.error("The Request to GraphQL war aborted! Reason: " + error.name)
        return null
    }
}

async function getBlockSpeed(graphql, length){
    let blocks = await fetchGraphQL(graphql, queryBlockSpeed, {maxLength: length})
    if (!blocks && !blocks.data) {
        return 0
    }
    const {bestChain: chain = []} = blocks.data
    if (!chain.length) {
        return 0
    }
    let speed, begin, end
    begin = +chain[0]["protocolState"]["blockchainState"]["date"]
    end = +chain[chain.length - 1]["protocolState"]["blockchainState"]["date"]
    speed = (end - begin) / length
    return speed
}

export const nodeInfo = async (obj, config) => {
    const {graphql, publicKey, publicKeyDelegators} = config

    switch (obj) {
        case 'node-status': return await fetchGraphQL(graphql, queryNodeStatus)
        case 'balance': return publicKey ? await fetchGraphQL(graphql, queryBalance, {publicKey}) : 0
        case 'blockchain': return await fetchGraphQL(graphql, queryBlockChain)
        case 'consensus': return await fetchGraphQL(graphql, queryConsensus)
        case 'block-speed': return await getBlockSpeed(graphql, 10)
    }
}
