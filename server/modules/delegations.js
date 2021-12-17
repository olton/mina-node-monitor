const fetch = require("node-fetch")
const {logging} = require("../helpers/logs");

const delegations = async (key) => {
    try {
        const link = `https://minastake.com/ledger/delegations.php?publicKey=${key}`
        const data = await fetch(link)
        return data.ok ? data.json() : null
    } catch (e) {
        logging("The Request to Minastake.com for delegations war aborted!")
        logging("Delegation request: Reason: " + e.name + " " + e.message)
        logging("Delegation request: Message: " + e.message)
        return null
    }
}

const processDelegations = async () => {
    const {publicKey, publicKeyDelegators} = globalThis.config
    const key = publicKeyDelegators || publicKey
    let data = await delegations(key)

    if (data) {
        globalThis.cache.delegations = data
    }

    setTimeout(processDelegations, 600000)
}

module.exports = {
    processDelegations
}