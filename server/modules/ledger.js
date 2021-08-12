const fetch = require("node-fetch")

const delegations = async (key) => {
    const link = `https://minastake.com/ledger/delegations.php?publicKey=${key}`
    const data = await fetch(link)
    return data.ok ? data.json() : null
}

const getLedgerInfo = async (path, config) => {
    const delegateKey = config.publicKeyDelegators ?? config.publicKey

    switch (path) {
        case "delegations": return await delegations(delegateKey)
    }
}

const processGetDelegations = async () => {
    const key = globalThis.config.publicKeyDelegators ?? globalThis.config.publicKey
    let data = await delegations(key)

    if (data) globalThis.nodeInfo.delegations = data

    setTimeout(processGetDelegations, 600000)
}

module.exports = {
    processGetDelegations,
    getLedgerInfo,
    delegations
}