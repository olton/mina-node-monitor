const {isNum} = require("./numbers")

const parseTime = (t) => {
    if (isNum(t)) return Math.abs(+t)
    const pattern = /([0-9]+d)|([0-9]{1,2}h)|([0-9]{1,2}m)|([0-9]{1,2}s)/gm
    const match = t.match(pattern)
    return match.reduce( (acc, val) => {
        let res

        if (val.includes('d')) {
            res = 1000 * 60 * 60 * 24 * parseInt(val)
        } else if (val.includes('h')) {
            res = 1000 * 60 * 60 * parseInt(val)
        } else if (val.includes('m')) {
            res = 1000 * 60 * parseInt(val)
        } else if (val.includes('s')) {
            res = 1000 * parseInt(val)
        }

        return acc + res
    }, 0 )
}

const parseTelegramChatIDs = (s = "") => {
    return [...new Set(Array.isArray(s) ? s : (""+s).split(",").map( v => v.trim() ) )]
}

module.exports = {
    parseTime,
    parseTelegramChatIDs
}
