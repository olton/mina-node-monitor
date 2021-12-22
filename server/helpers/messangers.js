const fetch = require("node-fetch")
const {parseTelegramChatIDs} = require("./parsers.js");
const {logging} = require("./logs");

const sendToDiscord = (url, message, {username = "Mina Monitor", avatar_url = ""} = {}) => {
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

const TELEGRAM_BOT_URL = "https://api.telegram.org/bot%TOKEN%/sendMessage?chat_id=%CHAT_ID%&text=%MESSAGE%&&parse_mode=markdown"

const sendToTelegram = (message, {token, recipients}) => {
    if (!token || !recipients) return

    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", token)

    for (const id of recipients) {
        const url = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
        fetch(encodeURI(url)).catch((e)=>{
            logging("Error! Can't send message to telegram")
            logging(e.message)
        })
    }
}

const sendTo = (check, message, isAlert = false) => {
    const sign = `Sender: \`${globalThis.host.toUpperCase()}\`.`
    const signedMessage = `${isAlert ? 'ALERT: ' : 'INFO: '} ${message} ${sign}`
    const {alertToTelegram, alertToDiscord, telegram: telegramConfig = null, discord: discordConfig = null} = config

    logging(message)

    if (telegramConfig && (check === 'OK' || alertToTelegram.includes(check))) {
        let {token = "", tokenInfo = "", tokenAlert = "", chatID = "", chatIDInfo = "", chatIDAlert = ""} = telegramConfig

        if (token) {
            if (!tokenInfo) tokenInfo = token
            if (!tokenAlert) tokenAlert = token
        }

        if (tokenInfo && !tokenAlert) tokenAlert = tokenInfo
        if (tokenAlert && !tokenInfo) tokenInfo = tokenAlert

        if (isAlert) {
            sendToTelegram(signedMessage, {token: tokenAlert, recipients: parseTelegramChatIDs(chatID).concat(parseTelegramChatIDs(chatIDAlert))})
        } else {
            sendToTelegram(signedMessage, {token: tokenInfo, recipients: parseTelegramChatIDs(chatID).concat(parseTelegramChatIDs(chatIDInfo))})
        }
    }

    if (discordConfig && (check === 'OK' || alertToDiscord.includes(check))) {
        let {webhook = "", webhookInfo = "", webhookAlert = "", botName = "Mina Monitor"} = discordConfig

        if (webhook) {
            if (!webhookInfo) webhookInfo = webhook
            if (!webhookAlert) webhookAlert = webhook
        }

        if (webhookInfo && !webhookAlert) webhookAlert = webhookInfo
        if (webhookAlert && !webhookInfo) webhookInfo = webhookAlert

        if (isAlert) {
            sendToDiscord(webhookAlert, signedMessage, {username: botName})
        } else {
            sendToDiscord(webhookInfo, signedMessage, {username: botName})
        }
    }
}

const sendMessage = (check, message) => {
    const {channel = {"info": []}} = config
    const {info} = channel
    let isAlert = !(info.includes(check))

    sendTo(check, message, isAlert)
}

module.exports = {
    sendMessage
}