const {sendMessage} = require("../helpers/messangers");
const {error} = require("../helpers/logs");

const processUptime = (data) => {
    try {
        const {uptime_snark} = data

        if (uptime_snark && uptime_snark.score) {
            let message = '', scoreChanged = false, positionChanged = false, percentChanged = false, rangeChanged = false
            let {position, score, score_percent} = uptime_snark


            if (!cache.uptime) {
                message = `Your current uptime score is \`${score}\` with rate \`${score_percent}%\`, and at the \`${position}\` place.`
            } else {
                let {position: cachedPosition, score: cachedScore, score_percent: cachedScorePercent} = cache.uptime.uptime_snark

                scoreChanged = +(cachedScore) !== +(score)
                percentChanged = +(cachedScorePercent) !== +(score_percent)
                positionChanged = +(cachedPosition) !== +(position)

                if (scoreChanged || percentChanged || positionChanged) {
                    let newValueMessage = `New value \`${score}\` with rate \`${score_percent}%\`, and at the \`${position}\` place.`

                    if (scoreChanged) {
                        message = `Your uptime score changed ${+score > +cachedScore ? 'UP' : 'DOWN'}!`
                    } else if (percentChanged) {
                        message = `Your uptime score percent changed ${+score_percent > +cachedScorePercent ? 'UP' : 'DOWN'}!`
                    } else if (positionChanged) {
                        message = `Your uptime position changed ${+position > +cachedPosition ? 'DOWN' : 'UP'}!`
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