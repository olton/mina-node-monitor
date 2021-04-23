import fetch from "node-fetch"
import config from "./config.mjs"

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
      externalIp
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
  }
}
`;

const queryBalance = `
query MyQuery {
  account(publicKey: "${config.publicKey}") {
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

async function fetchGraphQL(query, operationName = "MyQuery", variables = {}) {
    try {
        const result = await fetch(
            "http://localhost:3085/graphql",
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

export const nodeInfo = async (obj) => {
    switch (obj) {
        case 'node-status': return await fetchGraphQL(queryNodeStatus)
        case 'balance': return await fetchGraphQL(queryBalance)
        case 'blockchain': return await fetchGraphQL(queryBlockChain)
    }
}
