export const processRewards = data => {
    if (!data) return

    let blocks = data.data.blocks
    let rewards = blocks.length ? blocks.reduce((acc, val)=>acc + parseInt(val.transactions.coinbase), 0) : 0

    $("#blocks-in-epoch").text(blocks.length)
    $("#rewards-in-epoch").text(rewards / 10**9)
}