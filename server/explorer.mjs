import fetch from "node-fetch"

const EXPLORER_GRAPHQL = `https://graphql.minaexplorer.com`
const EXPLORER_API = `https://api.minaexplorer.com`

async function fetchGraphQL(query, variables = {}) {
    try {
        const result = await fetch(
            EXPLORER_GRAPHQL,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            }
        )

        return result.ok ? await result.json() : null
    } catch (error) {
        console.error("The Request to Explorer war aborted! Reason: " + error.name)
        return null
    }
}

export const getBlocks = async (variables) => {
    const query = `
        query($creator: String!, $epoch: Int, $blockHeightMin: Int, $blockHeightMax: Int, $dateTimeMin: DateTime, $dateTimeMax: DateTime){
          blocks(query: {creator: $creator, protocolState: {consensusState: {epoch: $epoch}}, canonical: true, blockHeight_gte: $blockHeightMin, blockHeight_lte: $blockHeightMax, dateTime_gte:$dateTimeMin, dateTime_lte:$dateTimeMax}, sortBy: DATETIME_DESC, limit: 1000) {
            blockHeight
            canonical
            creator
            dateTime
            txFees
            snarkFees
            receivedTime
            stateHash
            stateHashField
            protocolState {
              consensusState {
                blockHeight
                epoch
                slotSinceGenesis
              }
            }
            transactions {
              coinbase
              coinbaseReceiverAccount {
                publicKey
              }
              feeTransfer {
                fee
                recipient
                type
              }
            }
          }
        }
    `;

    return await fetchGraphQL(query, variables)
}

export const getExplorerSummary = async () => {
    const response = await fetch(`${EXPLORER_API}/summary`)
    return response.ok ? await response.json() : null
}

export const processExplorer = async () => {
    let data = await getExplorerSummary()

    if (data) globalThis.explorerInfo.summary = data

    setTimeout(processExplorer, 180000)
}

export const processWinningBlocks = async () => {
    let blockchain = globalThis.nodeInfo.blockchain
    let creator = globalThis.config.publicKeyDelegators
    let reload

    if (blockchain && blockchain.data && blockchain.data.bestChain && blockchain.data.bestChain.length) {
        const {
            blockHeight,
            epoch
        } = blockchain.data.bestChain[0].protocolState.consensusState

        let blocks = await getBlocks({
            creator,
            epoch,
            blockHeightMin: 0,
            blockHeightMax: blockHeight
        })

        globalThis.nodeInfo.winningBlocks = blocks
        reload = 180000
    } else {
        reload = 5000
    }

    setTimeout(processWinningBlocks, reload)
}