import {hostname} from "os"
import {sendAlert} from "./helpers.mjs"

export const processHello = () => {
    const {host} = globalThis.config
    const message = `Node says hello from ${hostname()} (${host.split(":")[0]})`

    sendAlert("HELLO", message)
}
