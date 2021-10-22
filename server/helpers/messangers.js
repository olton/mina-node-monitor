const fetch = require("node-fetch")
const {hostname} = require("os")
const {parseTelegramChatIDs} = require("./parsers.js");
const {logging} = require("./logs");

const discord = (url, message, {username = "Mina Monitor", avatar_url = ""} = {}) => {
    const params = {
        username,
        avatar_url,
        content: `${message}\n------------------\n`
    }

    fetch(url, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    }).catch((e) => {
        logging("Error! Can't send message to discord")
        logging(e.message)
    })
}

const TELEGRAM_BOT_URL = "https://api.telegram.org/bot%TOKEN%/sendMessage?chat_id=%CHAT_ID%&text=%MESSAGE%"

const telegram = (message, {token, recipients}) => {
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", token)
    const ids = parseTelegramChatIDs(recipients)

    for (const id of ids) {
        const url = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
        fetch(encodeURI(url)).catch((e)=>{
            logging("Error! Can't send message to telegram")
            logging(e.message)
        })
    }
}

const sendAlert = (check, message) => {
    const {telegramToken, alertToTelegram, telegramChatIDAlert, discordWebHook, alertToDiscord} = globalThis.config
    const sign = globalThis.host || hostname()
    const signedMessage = `${message} From ${sign}`

    logging(message)

    if (telegramToken && (check === 'OK' || alertToTelegram.includes(check))) {
        telegram(signedMessage, {token: telegramToken, recipients: telegramChatIDAlert})
    }

    if (discordWebHook && (check === 'OK' || alertToDiscord.includes(check))) {
        discord(discordWebHook, signedMessage)
    }
}


module.exports = {
    discord,
    telegram,
    sendAlert,
    TELEGRAM_BOT_URL
}