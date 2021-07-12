import {getInfo} from "./helpers/get-info"

export const processBlockchainInfo = async () => {
    let blockchainInfo = await getInfo('blockchain')

    if (blockchainInfo && blockchainInfo.data && Array.isArray(blockchainInfo.data.bestChain) && blockchainInfo.data.bestChain.length) {
        const {
            blockHeight,
            totalCurrency,
            epochCount,
            epoch,
            slot,
            slotSinceGenesis,
        } = blockchainInfo.data.bestChain[0].protocolState.consensusState

        globalThis.epoch = epoch

        const total = (totalCurrency / 10**9)

        $("#total-supply").text(total.format(0, null, " ", "."))
        $("#epoch-number").text(epoch)
        $("#slot-number").text(slot)
        $("#slot-since-genesis").text(slotSinceGenesis)
    }

    setTimeout(processBlockchainInfo, globalThis.config.intervals.daemon )
}

export const processBlockSpeed = async () => {
    let blockSpeed = await getInfo('block-speed')

    $("#block-speed").html(`<span class="text-bold fg-accent">${(blockSpeed / 60000).toFixed(2)}</span> minutes`)

    if (blockSpeed) {
        globalThis.blockSpeed = blockSpeed
    }

    setTimeout(processBlockSpeed, blockSpeed ? blockSpeed : 180000 )
}