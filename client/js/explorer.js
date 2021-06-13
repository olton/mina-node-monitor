import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

export const processBlocks = async () => {
    const {epoch, blockHeight, blockSpeed = 5000} = globalThis

    if (epoch && blockHeight) {
        let data = await getInfo(`blocks?epoch=${epoch}&blockHeightMin=0&blockHeightMax=${blockHeight}`)

        if (data) {
            let blocks = data.data.blocks
            let rewards = blocks.reduce((acc, val)=>acc + parseInt(val.transactions.coinbase), 0)

            $("#blocks-in-epoch").text(blocks.length)
            $("#rewards-in-epoch").text(rewards / 10**9)
        }
    }

    if (!globalThis.noSlots) setTimeout(() => processBlocks(), blockSpeed ? blockSpeed : 5000)
}