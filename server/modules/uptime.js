const {sendMessage} = require("../helpers/messangers");
const {error} = require("../helpers/logs");

const processUptime = (data) => {
    try {
        const {uptime, line} = data

        if (uptime && uptime.score) {
            let message = '', scoreChanged = false, positionChanged = false, rateChanged = false, rangeChanged = false
            let {position, score, rate, range} = uptime


            if (!cache.uptime) {
                message = `Your current uptime score is \`${uptime.score}\` with rate \`${uptime.rate}%\`, and at the \`${uptime.position}\` place in range ${range.min}...${range.max}.`
            } else {
                let {position: cachedPosition, score: cachedScore, rate: cachedRate, range: cachedRange} = cache.uptime.uptime

                scoreChanged = +(cachedScore) !== +(score)
                rateChanged = +(cachedRate) !== +(rate)
                positionChanged = +(cachedPosition) !== +(position)
                rangeChanged = (+(cachedRange.min) !== +(range.min)) || (+(cachedRange.max) !== +(range.max))

                if (scoreChanged || rateChanged || positionChanged || rangeChanged) {
                    let newValueMessage = `New value \`${score}\` with rate \`${rate}%\`, and at the \`${position}\` place in range ${range.min}..${range.max}.`

                    if (scoreChanged) {
                        message = `Your uptime score changed ${+score > +cachedScore ? 'UP' : 'DOWN'}!`
                    } else if (rateChanged) {
                        message = `Your uptime rate changed ${+rate > +cachedRate ? 'UP' : 'DOWN'}!`
                    } else if (positionChanged) {
                        message = `Your uptime position changed ${+position > +cachedPosition ? 'UP' : 'DOWN'}!`
                    } else if (rangeChanged) {
                        message = `Your uptime range changed from ${cachedRange.min}..${cachedRange.max} to ${range.min}..${range.max}`
                    } else {
                        message = `Your uptime position changed!`
                    }

                    message = `${message} ${newValueMessage}`
                }
            }

            if (message) sendMessage("UPTIME", message)

            globalThis.cache.uptime = data
        }

    } catch (e) {
        error(e.message)
    }
}

module.exports = {
    processUptime,
}