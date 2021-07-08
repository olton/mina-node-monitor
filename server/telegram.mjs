import {parseTelegramChatIDs} from "./helpers.mjs";
import fetch from "node-fetch";

export const TELEGRAM_BOT_URL = "https://api.telegram.org/bot%TOKEN%/sendMessage?chat_id=%CHAT_ID%&text=%MESSAGE%"

export const telegram = (message, {token, recipients}) => {
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", token)
    const ids = parseTelegramChatIDs(recipients)

    for (const id of ids) {
        const url = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
        fetch(encodeURI(url)).catch((e)=>{
            console.log("Error! Can't send message to telegram")
            console.log(e.message)
        })
    }
}