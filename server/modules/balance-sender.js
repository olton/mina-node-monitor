const {parseTime} = require("../helpers/parsers")
const {sendAlert} = require("../helpers/messangers")
const {addressBalance} = require("../helpers/node-data");
const {SYNC_STATE_SYNCED, SYNC_STATE_CATCHUP} = require("../helpers/consts");

const processBalanceSend = async () => {
    if (!globalThis.config || !globalThis.config.publicKey) return

    const {balanceSendInterval} = globalThis.config
    const _balanceSendInterval = parseTime(balanceSendInterval)

    let reload

    let balance = addressBalance(globalThis.cache.balance)
    let daemon = globalThis.cache.daemon

    if (balance && daemon && [SYNC_STATE_SYNCED, SYNC_STATE_CATCHUP].includes(daemon.syncStatus)) {
        const {total, liquid, locked} = balance
        const message =`Current balance info: ${(total / 10**9).toFixed(4)} [T], ${(liquid / 10**9).toFixed(4)} [Q], ${(locked / 10**9).toFixed(4)} [L]`

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
