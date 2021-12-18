const fetch = require("node-fetch")
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
            let message = '', scoreChanged = false, positionChanged = false, rateChanged = false, upDown = ''
            let {position, score, rate, group, positions} = uptime

            positions.sort()

            if (!cache.uptime) {
                message = `Your current uptime score is \`${uptime.score}\` with rate \`${uptime.rate}%\`, and at the \`${uptime.position}\` place in range ${positions[0]}...${positions[positions.length - 1]}.`
            } else {
                let {position: cachedPosition, score: cachedScore, rate: cachedRate, group: cachedGroup, positions: cachedPositions} = cache.uptime

                cachedPositions.sort()

                scoreChanged = +(cachedScore) !== +(score)
                rateChanged = +(cachedRate) !== +(rate)
                positionChanged = positions[0] !== cachedPositions[0] || positions[positions.length - 1] !== cachedPositions[cachedPositions.length - 1]

                if (scoreChanged || rateChanged || positionChanged) {
                    let newValueMessage = `New value \`${score}\` with rate \`${rate}%\`, and at the \`${position}\` place in range ${positions[0]}...${positions[positions.length - 1]}.`
                    if (scoreChanged) {
                        upDown = score > cachedScore ? 'UP' : 'DOWN'
                        message = `Your uptime score changed ${upDown}!`
                    } else if (rateChanged) {
                        upDown = rate > cachedRate ? 'UP' : 'DOWN'
                        message = `Your uptime rate changed ${upDown}!`
                    } else {
                        message = `Your uptime position changed!`
                    }

                    message = `${message} ${newValueMessage}`
                }
            }

            if (message) sendMessage("UPTIME", message)

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