import {telegram} from "./telegram.mjs"
import {hostname} from "os"
import {discord} from "./discord.mjs";

export const processHello = async (config) => {
    const {discordWebHook, telegramToken, telegramChatID, host} = config
    const message = `Node says hello from ${hostname()} (${host.split(":")[0]})`

    if (telegramToken) {
        await telegram(message, {token: telegramToken, recipients: telegramChatID})
    }

    if (discordWebHook) {
        await discord(discordWebHook, message)
    }
}
