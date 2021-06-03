import {telegram} from "./telegram.mjs"
import {hostname} from "os"

export const processHello = async (config) => {
    const {telegramToken, telegramChatID, host} = config
    const message = `Node says hello from\nHost: ${hostname()}!\nIP ${host.split(":")[0]}`

    await telegram(message, {token: telegramToken, recipients: telegramChatID})
}
