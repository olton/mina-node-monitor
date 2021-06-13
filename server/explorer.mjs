import fetch from "node-fetch"

async function fetchGraphQL(query, variables = {}) {
    try {
        const result = await fetch(
            `https://graphql.minaexplorer.com`,
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
    const response = await fetch("https://api.minaexplorer.com/summary")
    return response.ok ? await response.json() : null
}
