const fetch = require("node-fetch")
const {sendMessage} = require("../helpers/messangers");
const {parseTime} = require("../helpers/parsers");

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
    const minInterval = parseTime('5m')
    let {uptimeUpdateInterval = minInterval} = config

    if (uptimeUpdateInterval < minInterval) {
        uptimeUpdateInterval = minInterval
    }

    try {
        const {publicKeyDelegators} = globalThis.config
        const uptime = await getUptime(publicKeyDelegators)

        if (uptime && uptime.score) {
            let message = '', scoreChanged = false, positionChanged = false, rateChanged = false
            let {position, score, rate, group, positions} = uptime

            positions = positions.map( v => +v ).sort( (a, b) => a - b)

            if (!cache.uptime) {
                message = `Your current uptime score is \`${uptime.score}\` with rate \`${uptime.rate}%\`, and at the \`${uptime.position}\` place in range ${positions[0]}...${positions[positions.length - 1]}.`
            } else {
                let {position: cachedPosition, score: cachedScore, rate: cachedRate, group: cachedGroup, positions: cachedPositions} = cache.uptime

                scoreChanged = +(cachedScore) !== +(score)
                rateChanged = +(cachedRate) !== +(rate)
                positionChanged = positions[0] !== cachedPositions[0] || positions[positions.length - 1] !== cachedPositions[cachedPositions.length - 1]

                console.log('Uptime changes: ', scoreChanged, rateChanged, positionChanged)

                if (scoreChanged || rateChanged || positionChanged) {
                    let newValueMessage = `New value \`${score}\` with rate \`${rate}%\`, and at the \`${position}\` place in range ${positions[0]}...${positions[positions.length - 1]}.`
                    if (scoreChanged) {
                        message = `Your uptime score changed ${score > cachedScore ? 'UP' : 'DOWN'}!`
                    } else if (rateChanged) {
                        message = `Your uptime rate changed ${rate > cachedRate ? 'UP' : 'DOWN'}!`
                    } else {
                        message = `Your uptime position changed!`
                    }

                    message = `${message} ${newValueMessage}`
                }
            }

            if (message) sendMessage("UPTIME", message)

            globalThis.cache.uptime = {
                ...uptime,
                positions
            }
        }
    } catch (e) {
        console.error(e)
    }

    setTimeout(processUptime, uptimeUpdateInterval)
}

module.exports = {
    processUptime
}