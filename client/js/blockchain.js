import 'regenerator-runtime/runtime' // this required for Parcel
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

        const total = (totalCurrency / 10**9)

        $("#currency-total").text(total.format(0, null, " ", "."))
        $("#epoch-number").text(epoch)
        $("#slot-number").text(slot)
        $("#slot-since-genesis").text(slotSinceGenesis)
    }

    setTimeout( () => processBlockchainInfo(), globalThis.config.intervals.blockchain )
}

export const processBlockSpeed = async () => {
    let blockSpeed = await getInfo('block-speed')

    $("#block-speed").html(`<span class="text-bold fg-accent">${(blockSpeed / 60000).toFixed(2)}</span> minutes`)

    setTimeout( () => processBlockSpeed(), blockSpeed ? blockSpeed : 300000 )
}