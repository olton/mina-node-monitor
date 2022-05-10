const {timestamp} = require("./timestamp")

const print = (m) => console.log(m)
const logging = (m, error = false, ...rest) => console[error ? "error" : "log"](timestamp()+" "+m, ...rest)
const log = (m, ...rest) => console["log"](timestamp()+" "+m, ...rest)
const error = (m, ...rest) => console["error"](timestamp()+" "+m, ...rest)

module.exports = {
    print,
    logging,
    error,
    log
}