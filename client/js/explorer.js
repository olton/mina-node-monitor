import {getInfo} from "./helpers/get-info"
import {parseTime} from "./helpers/parse-time";

export const processBlocks = async () => {
    let data = await getInfo(`winning-blocks`)

    if (data) {
        let blocks = data.data.blocks
        let rewards = blocks.reduce((acc, val)=>acc + parseInt(val.transactions.coinbase), 0)

        $("#blocks-in-epoch").text(blocks.length)
        $("#rewards-in-epoch").text(rewards / 10**9)
    }

    if (!globalThis.noSlots) setTimeout(processBlocks, parseTime(globalThis.config.intervals.daemon))
}