import {parseTelegramChatIDs} from "./helpers.mjs";
import fetch from "node-fetch";

export const TELEGRAM_BOT_URL = "https://api.telegram.org/bot%TOKEN%/sendMessage?chat_id=%CHAT_ID%&text=%MESSAGE%"

export const telegram = async (message, {token, recipients}) => {
    const TELEGRAM_URL = TELEGRAM_BOT_URL.replace("%TOKEN%", token)
    const ids = parseTelegramChatIDs(recipients)

    for (const id of ids) {
        await fetch(TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message))
    }
}