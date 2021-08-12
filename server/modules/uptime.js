const fetch = require("node-fetch")

const getUptime = async (key) => {
    if (!key) return null

    const link = `https://minastake.com/uptime/uptime.php?publicKey=${key}`
    let data

    try {
        data = await fetch(link)
        return data.ok ? data.json() : null
    } catch (e) {
        return null
    }
}

const getUptime2 = async (key) => {
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

const processNodeUptime = async (variant = 1) => {
    const {publicKeyDelegators} = globalThis.config
    const fn = variant === 1 ? getUptime : getUptime2
    const uptime = await fn(publicKeyDelegators)

    if (uptime) globalThis.nodeInfo[variant === 1 ? "uptime" : "uptime2"] = uptime

    setTimeout(processNodeUptime, 60000, variant)
}

module.exports = {
    getUptime,
    getUptime2,
    processNodeUptime
}