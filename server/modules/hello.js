const {sendMessage} = require("../helpers/messangers")

const processHello = () => {
    const message = `Mina Monitor started successful! Have nice work!`

    sendMessage("HELLO", message, false)
}

module.exports = {
    processHello
}