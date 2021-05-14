import fetch from "node-fetch"

export const getUptime = async (key) => {
    if (!key) return null
    const link = `https://minastake.com/utils/uptime.php?publicKey=${key}`
    const data = await fetch(link)
    return data.ok ? data.json() : null
}
