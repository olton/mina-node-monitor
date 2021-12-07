const {exec} = require("child_process")
const {sendMessage} = require("./messangers")
const {logging} = require("./logs");

const restart = (reason) => {
    const {restartCmd} = globalThis.config

    if (!restartCmd) return

    logging("Restart with message: " + reason)

    globalThis.hangTimer = 0
    globalThis.restartTimerNotSynced = 0

    exec(restartCmd, async (error, stdout, stderr) => {
        let message, result

        if (error) {
            result = error.message
        } else
        if (stderr) {
            result = stderr
        } else {
            result = 'OK'
        }

        message = `Restart command executed with result ${result}\nReason: ${reason}`
        sendMessage("RESTART", message)
    })
}

const execCommand = (cmd) => {
    if (!cmd) return

    return exec(cmd, async (error, stdout, stderr) => {
        if (error) {
            logging("Error code: "+error.code)
            logging("Signal received: "+error.signal)
        }
        if (stdout) logging(stdout)
        if (stderr) logging(stderr)
    })
}

module.exports = {
    restart,
    execCommand
}