const {parseTime} = require("../helpers/parsers")
const {fetchGraphQL, queryBlockChain} = require("./graphql")

const processBlockchain = async () => {
    const {
        graphql,
        nodeInfoCollectInterval = "30s",
    } = globalThis.config

    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    try {
        globalThis.cache.blockchain = await fetchGraphQL(graphql, queryBlockChain)
    } catch (e) {}

    setTimeout(processBlockchain, _nodeInfoCollectInterval)
}

module.exports = {
    processBlockchain
}