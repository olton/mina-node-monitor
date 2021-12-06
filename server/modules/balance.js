const {fetchGraphQL, queryBalance} = require("./graphql");
const {parseTime} = require("../helpers/parsers");
const {addressBalance} = require("../helpers/node-data");
const {SYNC_STATE_SYNCED, SYNC_STATE_CATCHUP} = require("../helpers/consts");
const {sendAlert, sendMessage} = require("../helpers/messangers");

const processBalance = async () => {
    const {publicKey, nodeInfoCollectInterval = "30s", graphql} = globalThis.config
    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)

    try {
        globalThis.cache.balance = publicKey ? await fetchGraphQL(graphql, queryBalance, {publicKey}) : 0
    } catch (e) {}

    setTimeout(processBalance, _nodeInfoCollectInterval)
}

const processBalanceSend = async () => {
    if (!globalThis.config || !globalThis.config.publicKey) return

    const {balanceSendInterval} = globalThis.config
    const _balanceSendInterval = parseTime(balanceSendInterval)

    let reload

    let balance = addressBalance(globalThis.cache.balance)
    let daemon = globalThis.cache.daemon

    if (balance && daemon && [SYNC_STATE_SYNCED, SYNC_STATE_CATCHUP].includes(daemon.syncStatus)) {
        const {total, liquid, locked} = balance
        const message =`Balance state: ${(total / 10**9).toFixed(4)} [T], ${(liquid / 10**9).toFixed(4)} [M], ${(locked / 10**9).toFixed(4)} [L].`

        globalThis.currentBalance = total
        sendMessage("BALANCE", message)
        reload = _balanceSendInterval
    } else {
        reload = 5000
    }

    setTimeout(processBalanceSend, reload)
}

module.exports = {
    processBalance,
    processBalanceSend
}
