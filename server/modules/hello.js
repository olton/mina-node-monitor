const {hostname} = require("os")
const {sendAlert} = require("../helpers/messangers")

const processHello = () => {
    const message = `Node says hello from ${hostname()}`

    sendAlert("HELLO", message)
}

module.exports = {
    processHello
}