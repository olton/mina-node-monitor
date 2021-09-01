const {hostname} = require("os")
const {exec} = require("child_process")
const {sendAlert} = require("./messangers")

const restart = (reason, target = hostname()) => {
    const {restartCmd} = globalThis.config

    if (!restartCmd) return

    console.log("Restart with message: " + reason)

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

        message = `Restart command executed for ${target}.\nWith result ${result}\nReason: ${reason}`
        sendAlert("RESTART", message)
    })
}

const execCommand = (cmd) => {
    if (!cmd) return

    return exec(cmd, async (error, stdout, stderr) => {
        if (error) {
            console.log(error.stack)
            console.log("Error code: "+error.code)
            console.log("Signal received: "+error.signal)
        }
        if (stdout) console.log(stdout)
        if (stderr) console.log(stderr)
    })
}

module.exports = {
    restart,
    execCommand
}