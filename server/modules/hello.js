const {hostname} = require("os")
const {sendAlert} = require("../helpers/messangers")

const processHello = () => {
    const message = `Node says hello!`

    sendAlert("HELLO", message)
}

module.exports = {
    processHello
}