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
query MyQuery {
  account(publicKey: "%PUBLIC_KEY%") {
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

async function fetchGraphQL(addr, query, operationName = "MyQuery", variables = {}) {
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
                    operationName: operationName,
                    variables: variables,
                })
            }
        )

        return result.ok ? await result.json() : {}
    } catch (error) {
        console.error("The Request to GraphQL war aborted! Reason: " + error.name)
        return null
    }
}

export const nodeInfo = async (obj, config) => {
    const {graphql, publicKey} = config

    switch (obj) {
        case 'node-status': return await fetchGraphQL(graphql, queryNodeStatus)
        case 'balance': return publicKey ? await fetchGraphQL(graphql, queryBalance.replace("%PUBLIC_KEY%", publicKey)) : 0
        case 'blockchain': return await fetchGraphQL(graphql, queryBlockChain)
        case 'consensus': return await fetchGraphQL(graphql, queryConsensus)
    }
}
