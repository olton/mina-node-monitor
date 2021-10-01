const {parseTime} = require("../helpers/parsers");
const {fetchGraphQL, queryBlockSpeed} = require("./graphql");

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

const processBlockSpeed = async () => {
    const {
        graphql,
        blockSpeedDistance = 10,
        nodeInfoCollectInterval = "30s",
    } = globalThis.config

    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    try {
        let blockSpeed = await getBlockSpeed(graphql, blockSpeedDistance)
        globalThis.cache.speed = blockSpeed
    } catch (e) {}

    setTimeout(processBlockSpeed, _nodeInfoCollectInterval)
}

module.exports = {
    processBlockSpeed
}