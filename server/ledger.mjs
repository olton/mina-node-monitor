import fetch from "node-fetch";

const delegations = async (key) => {
    const link = `https://minastake.com/ledger/delegations.php?publicKey=${key}`
    const data = await fetch(link)
    return data.ok ? data.json() : null
}

export const getLedgerInfo = async (path, config) => {
    const delegateKey = config.publicKeyDelegators ?? config.publicKey

    switch (path) {
        case "delegations": return await delegations(delegateKey)
    }
}