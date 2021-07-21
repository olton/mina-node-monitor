import {sendAlert} from "./helpers.mjs";

export const processBalanceSend = async () => {
    if (!globalThis.config || !globalThis.config.publicKey) return

    const {balanceSendInterval} = globalThis.config
    let reload

    let status = globalThis.nodeInfo.balance

    if (status && status.data && status.data.account && status.data.account.balance) {
        const {total, liquid, locked} = status.data.account.balance
        const message =`Current balance info: ${(total / 10**9).toFixed(4)} [T], ${(liquid / 10**9).toFixed(4)} [Q], ${(locked / 10**9).toFixed(4)} [L]`

        if (globalThis.currentBalance === total) {
            return
        }
        globalThis.currentBalance = total
        sendAlert("BALANCE", message)
        reload = balanceSendInterval
    } else {
        reload = 5000
    }

    setTimeout(processBalanceSend, reload)
}

