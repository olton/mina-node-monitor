const fetch = require("node-fetch")
const {isset} = require("../helpers/isset");
const {sendMessage} = require("../helpers/messangers");

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

        if (uptime) {
            if (!cache.uptime || uptime.score !== cache.uptime.score) {
                let details = '', message = ''
                if (cache.uptime && isset(cache.uptime.score, false)) {
                    details =  +(cache.uptime.score) > +(uptime.score) ? '`DOWN`' : '`UP`'
                    message = `Your uptime score changed ${details}! New value \`${uptime.score}\` with place \`${uptime.position}\`.`
                } else {
                    message = `Your current uptime score is \`${uptime.score}\` with place \`${uptime.position}\`.`
                }
                sendMessage("UPTIME", message)
            }

            globalThis.cache.uptime = uptime
        }
    } catch (e) {
        console.error(e)
    }

    setTimeout(processUptime, 60000)
}

module.exports = {
    processUptime
}