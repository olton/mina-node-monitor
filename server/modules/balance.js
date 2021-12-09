const {fetchGraphQL, queryBalance} = require("./graphql");
const {parseTime} = require("../helpers/parsers");
const {addressBalance} = require("../helpers/node-data");
const {SYNC_STATE_SYNCED} = require("../helpers/consts");
const {sendMessage} = require("../helpers/messangers");
const {shortAddress} = require("../helpers/short-address")

const processBalance = async () => {
    const {publicKey = "", publicKeyDelegators = "", nodeInfoCollectInterval = "30s", graphql} = config
    const _nodeInfoCollectInterval = parseTime(nodeInfoCollectInterval)
    const address = publicKey ? publicKey : publicKeyDelegators ? publicKeyDelegators : null

    if (!address) return

    try {
        const balanceData = await fetchGraphQL(graphql, queryBalance, {publicKey: address})

        if (balanceData) {
            const {total = 0, liquid = 0, locked = 0} = addressBalance(balanceData)
            const shortAddr = shortAddress(address, 5)
            const totalValue = (total/10**9).toFixed(4),
                 liquidValue = (liquid/10**9).toFixed(4),
                 lockedValue = (locked/10**9).toFixed(4)

            if (SYNC_STATE_SYNCED === cache.state) {
                if (cache.balance) {
                    const {
                        total: cacheTotal = 0,
                        liquid: cacheLiquid = 0,
                        locked: cacheLocked = 0
                    } = addressBalance(cache.balance)
                    if (+(cacheTotal) !== +(total)) {
                        sendMessage("BALANCE", `Balance for address \`${shortAddr}\` was changed to \`${totalValue}\` (Total), \`${liquidValue}\` (Movable), \`${lockedValue}\` (Locked).`)
                    }
                } else {
                    sendMessage("BALANCE", `Balance state for address \`${shortAddr}\` is \`${totalValue}\` (Total), \`${liquidValue}\` (Movable), \`${lockedValue}\` (Locked).`)
                }
            }

            globalThis.cache.balance = balanceData
        }
    } catch (e) {}

    setTimeout(processBalance, _nodeInfoCollectInterval)
}

module.exports = {
    processBalance
}
