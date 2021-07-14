import fetch from "node-fetch"

export const getUptime = async (key) => {
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

export const processNodeUptime = async () => {
    const {publicKeyDelegators} = globalThis.config
    const uptime = await getUptime(publicKeyDelegators)

    if (uptime) globalThis.nodeInfo.uptime = uptime

    setTimeout(processNodeUptime, 60000)
}
