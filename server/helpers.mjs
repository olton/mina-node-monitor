import {telegram} from "./telegram.mjs";
import {discord} from "./discord.mjs";

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

    if (telegramToken && alertToTelegram.includes(check)) {
        telegram(message, {token: telegramToken, recipients: telegramChatIDAlert})
    }

    if (discordWebHook && alertToDiscord.includes(check)) {
        discord(discordWebHook, message)
    }
}