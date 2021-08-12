const daemonStatus = (status) => status && status.data && status.data.daemonStatus
const addressBalance = (status) => status && status.data && status.data.account && status.data.account.balance

module.exports = {
    daemonStatus,
    addressBalance
}