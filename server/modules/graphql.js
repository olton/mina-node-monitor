const fetch = require("node-fetch");

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
    timing {
      vesting_period
      vesting_increment
      initial_mininum_balance
      cliff_time
      cliff_amount
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

module.exports = {
    queryNodeStatus,
    queryNextBlock,
    queryBalance,
    queryBlockChain,
    queryConsensus,
    queryBlockSpeed,
    fetchGraphQL
}