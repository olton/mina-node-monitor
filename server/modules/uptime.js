const fetch = require("node-fetch")

const getUptime = async (key) => {
    if (!key) return null

    const link = `https://minastake.com/uptime/uptime2.php?publicKey=${key}`
    let data

    try {
        data = await fetch(link)
        return data.ok ? data.json() : null
    } catch (e) {
        return null
    }
}

const processUptime = async () => {
    try {
        const {publicKeyDelegators} = globalThis.config
        const uptime = await getUptime(publicKeyDelegators)

        globalThis.cache.uptime = uptime
    } catch (e) {}

    setTimeout(processUptime, 60000)
}

module.exports = {
    processUptime
}