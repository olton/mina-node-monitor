const fetch = require("node-fetch")
const {logging} = require("../helpers/logs");
const {parseTime} = require("../helpers/parsers");
const {defaultValue} = require("../helpers/default");
const {sendMessage} = require("../helpers/messangers");
const {timestamp} = require("../helpers/timestamp");

const EXPLORER_GRAPHQL = `https://graphql.minaexplorer.com`
const EXPLORER_API = `https://api.minaexplorer.com`

async function fetchAPI(path = '') {
    try {
        let response = await fetch(`${EXPLORER_API}/${path}`)
        return response.ok ? await response.json() : null
    } catch (e) {
        return null
    }
}

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
        logging("The Request to Explorer war aborted! Reason: " + error.name + " with message " + error.message)
        return null
    }
}

const getBlocks = async (variables) => {
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

const processWinningBlocks = async () => {
    let blockchain = globalThis.cache.blockchain
    let creator = globalThis.config.publicKeyDelegators
    let reload = parseTime('5s')

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

        if (blocks) {
            try {
                const lastBlockData = blocks.data.blocks[0]
                const cacheBlockData = cache.rewards ? cache.rewards.data.blocks[0] : null
                if (
                    blocks.data.blocks.length > 0
                    && (
                        cacheBlockData.blockHeight < lastBlockData.blockHeight
                    )
                ) {
                    const message = `We got last block at \`${timestamp("-", lastBlockData.dateTime)}\` on height \`${lastBlockData.blockHeight}\` with coinbase \`${lastBlockData.transactions.coinbase / 10 ** 9}\` mina.`
                    sendMessage('REWARDS', message)
                }
            } catch (e) {}
            globalThis.cache.rewards = blocks
        }
        reload = parseTime('3m')
    }

    setTimeout(processWinningBlocks, reload)
}

const processBlockchainSummary = async () => {
    let summary = await fetchAPI('summary')
    let reload = parseTime(defaultValue(config.explorer.getBlockchainSummaryInterval, "1m"))

    if (summary) {
        globalThis.cache.explorerSummary = summary
    }

    setTimeout(processBlockchainSummary, reload)
}

const processBlockchainLatestBlocks = async (limit = 1) => {
    let summary = await fetchAPI(`blocks?limit=${limit}`)
    let reload = parseTime(defaultValue(config.explorer.getLatestBlocksInterval, "1m"))

    if (summary && summary.blocks) {
        globalThis.cache.latestBlocks = summary.blocks
    }

    setTimeout(processBlockchainLatestBlocks, reload)
}

module.exports = {
    getBlocks,
    processWinningBlocks,
    processBlockchainSummary,
    processBlockchainLatestBlocks
}