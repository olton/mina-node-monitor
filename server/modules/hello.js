const {sendAlert} = require("../helpers/messangers")

const processHello = () => {
    const message = `Mina Monitor started successful! Have nice work!`

    sendAlert("HELLO", message, false)
}

module.exports = {
    processHello
}