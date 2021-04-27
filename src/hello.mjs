import fetch from "node-fetch"

export const processHello = async (config) => {
    const TELEGRAM_URL = `https://api.telegram.org/bot${config.telegramToken}/sendMessage?chat_id=%CHAT_ID%&text=%MESSAGE%`
    const ids = config.telegramChatID.split(",").map( v => v.trim() )
    const message = `Node says hello from ${config.host.split(":")[0]}`
    let target

    for (const id of ids) {
        target = TELEGRAM_URL.replace("%CHAT_ID%", id).replace("%MESSAGE%", message)
        await fetch(target)
    }
}
