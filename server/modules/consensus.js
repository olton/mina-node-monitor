const {parseTime} = require("../helpers/parsers")
const {fetchGraphQL, queryConsensus} = require("./graphql")

const processConsensus = async () => {
    const {
        graphql,
        nodeInfoCollectInterval = "30s",
    } = globalThis.config

    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    try {
        let consensus = await fetchGraphQL(graphql, queryConsensus)
        globalThis.cache.consensus = consensus
    } catch (e) {}

    setTimeout(processConsensus, _nodeInfoCollectInterval)
}

module.exports = {
    processConsensus
}