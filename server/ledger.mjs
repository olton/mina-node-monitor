import fetch from "node-fetch";

const delegators = async (key) => {
    const link = `https://minastake.com/ledger/delegators.php?publicKey=${key}`
    const data = await fetch(link)
    return data.ok ? data.json() : null
}

export const getLedgerInfo = async (path, config) => {
    const publicKey = config.publicKey
    const delegatorsKey = config.publicKeyDelegators ?? config.publicKey

    switch (path) {
        case "delegators": return await delegators(delegatorsKey)
    }
}