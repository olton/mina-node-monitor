export const processRewards = data => {
    if (!data) return

    const {blocks_count, total_rewards, zero_blocks, super_count, super_rewards} = data[0]

    $("#blocks-in-epoch").text(blocks_count)
    $("#rewards-in-epoch").text(total_rewards / 10**9)
}