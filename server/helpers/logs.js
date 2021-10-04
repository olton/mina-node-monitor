const {timestamp} = require("./timestamp")

const print = (m) => console.log(m)
const logging = (m, error = false) => console[error ? "error" : "log"](timestamp()+" "+m)

module.exports = {
    print,
    logging
}