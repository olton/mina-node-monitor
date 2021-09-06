const fetch = require("node-fetch")

const delegations = async (key) => {
    try {
        const link = `https://minastake.com/ledger/delegations.php?publicKey=${key}`
        const data = await fetch(link)
        return data.ok ? data.json() : null
    } catch (e) {
        console.error("The Request to GraphQL war aborted! Reason: " + e.name + " " + e.message)
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