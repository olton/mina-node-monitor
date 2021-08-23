export const processBlockchain = data => {
    if (!data) return

    const {blockHeight, epoch, epochCount, slot, slotSinceGenesis, totalCurrency} = data.data.bestChain[0].protocolState.consensusState

    globalThis.epoch = epoch

    const total = (totalCurrency / 10**9)

    $("#total-supply").text(total.format(0, null, " ", "."))
    $("#epoch-number").text(epoch)
    $("#slot-number").text(slot)
    $("#slot-since-genesis").text(slotSinceGenesis)
}