const {hostname} = require("os")
const {sendAlert} = require("../helpers/messangers")

const processHello = () => {
    const {host} = globalThis.config
    const message = `Node says hello from ${hostname()} (${host.split(":")[0]})`

    sendAlert("HELLO", message)
}

module.exports = {
    processHello
}