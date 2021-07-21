import {telegram} from "./telegram.mjs"
import {discord} from "./discord.mjs"
import {exec} from "child_process"
import {hostname} from "os"

export const parseTelegramChatIDs = s => s ? s.split(",").map( v => v.trim() ) : ""

export const timestamp = () => {
    let today = new Date();
    let d = String(today.getDate()).padStart(2, '0');
    let m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let y = today.getFullYear();
    let H = String(today.getHours()).padStart(2, '0');
    let M = String(today.getMinutes()).padStart(2, '0');

    return `${d}/${m}/${y} ${H}:${M}`;
}

export const sendAlert = (check, message) => {
    const {telegramToken, alertToTelegram, telegramChatIDAlert, discordWebHook, alertToDiscord} = globalThis.config

    console.log(message)

    if (telegramToken && alertToTelegram.includes(check)) {
        telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})
    }

    if (discordWebHook && alertToDiscord.includes(check)) {
        discord(discordWebHook, message)
    }
}

export const execCommand = (cmd) => {
    if (!cmd) return

    return exec(cmd, async (error, stdout, stderr) => {
        if (error) {
            console.log(error.stack)
            console.log("Error code: "+error.code)
            console.log("Signal received: "+error.signal)
        }
        if (stderr) console.log(stdout)
        if (stderr) console.log(stderr)
    })
}

export const restart = (reason, target = hostname()) => {
    const {restartCmd} = globalThis.config

    if (!restartCmd) return

    console.log("Restart with message: " + reason)

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

export const deleteFromArray = (arr, val) => {
    const i = arr.indexOf(val)
    if (i > -1) {
        arr.splice(i, 1)
    }
    return arr
}

export const isNum = (v) => !isNaN(v)

export const between = (val, bottom, top, equals) => equals === true ? val >= bottom && val <= top : val > bottom && val < top
