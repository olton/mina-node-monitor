import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const"

const getBlockChainInfo = async () => {
    return await getInfo('blockchain')
}

const processBlockchainInfo = async () => {
    let blockchainInfo = await getBlockChainInfo()

    if (blockchainInfo && blockchainInfo.data && Array.isArray(blockchainInfo.data.bestChain) && blockchainInfo.data.bestChain.length) {
        const {
            blockHeight,
            totalCurrency,
            epochCount,
            epoch,
            slot,
            slotSinceGenesis,
        } = blockchainInfo.data.bestChain[0].protocolState.consensusState

        $("#currency-total").text((totalCurrency / 10**9).format(2, null, ",", "."))
        $("#epoch-number").text(epoch)
        $("#slot-number").text(slot)
        $("#slot-since-genesis").text(slotSinceGenesis)
    }

    setTimeout( () => processBlockchainInfo(), 30000 )
}

setTimeout( () => processBlockchainInfo(), 0 )