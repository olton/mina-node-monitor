const {hostname} = require("os")
const {sendAlert} = require("../helpers/messangers")

const processHello = () => {
    const message = `Hello from Mina Monitor!`

    sendAlert("HELLO", message)
}

module.exports = {
    processHello
}