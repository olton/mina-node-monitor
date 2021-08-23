export const processExplorer = data => {
    if (!data) return

    const {blockchainLength} = data

    $("#explorer-height").html(blockchainLength)
}