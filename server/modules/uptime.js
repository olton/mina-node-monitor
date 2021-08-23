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
    const {publicKeyDelegators} = globalThis.config
    const uptime = await getUptime(publicKeyDelegators)

    globalThis.nodeInfo.uptime = uptime
    globalThis.nodeInfo.uptime2 = uptime
    globalThis.cache.uptime = uptime

    setTimeout(processUptime, 60000)
}

module.exports = {
    processUptime
}