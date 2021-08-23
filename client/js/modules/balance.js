export const processBalance = data => {
    if (!data) return
    const {balance, timing} = data.data.account
    const {total, liquid, locked, stateHash, unknown} = balance

    globalThis.balance = +total / 10**9

    $("#balance-total").text((total/10**9).format(2, null, ",", "."))
    $("#balance-liquid").text((liquid/10**9).format(2, null, ",", "."))
    $("#balance-cost").text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + globalThis.priceCurrency.toUpperCase())

}