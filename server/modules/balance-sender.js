const {parseTime} = require("../helpers/parsers")
const {sendAlert} = require("../helpers/messangers")
const {daemonStatus, addressBalance} = require("../helpers/node-data");

const processBalanceSend = async () => {
    if (!globalThis.config || !globalThis.config.publicKey) return

    const {balanceSendInterval} = globalThis.config
    const _balanceSendInterval = parseTime(balanceSendInterval)

    let reload

    let balance = addressBalance(globalThis.nodeInfo.balance)
    let status = daemonStatus(globalThis.nodeInfo.nodeStatus)

    if (balance && status && !['BOOTSTRAP', 'OFFLINE', 'CONNECTING'].includes(status.syncStatus)) {
        const {total, liquid, locked} = balance
        const message =`Current balance info: ${(total / 10**9).toFixed(4)} [T], ${(liquid / 10**9).toFixed(4)} [Q], ${(locked / 10**9).toFixed(4)} [L]`

        if (globalThis.currentBalance === total) {
            return
        }
        globalThis.currentBalance = total
        sendAlert("BALANCE", message)
        reload = _balanceSendInterval
    } else {
        reload = 5000
    }

    setTimeout(processBalanceSend, reload)
}

module.exports = {
    processBalanceSend
}
