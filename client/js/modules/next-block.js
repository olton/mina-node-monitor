export const processNextBlock = data => {
    if (isNaN(data)) return

    const elNextBlockTime = $("#next-block-time")
    const elNextBlockLeft = $("#next-block-left")

    if (data) {
        const blockDate = datetime(+data)
        const blockLeft = Metro.utils.secondsToTime((blockDate.time() - datetime().time())/1000)

        elNextBlockTime.text(blockDate.format("ddd, DD MMM, HH:mm"))
        elNextBlockLeft.text(`${blockLeft.d} day(s) ${blockLeft.h} hour(s) ${blockLeft.m} minute(s)`)
    } else {
        elNextBlockTime.text(globalThis.nodeSyncStaus === 'BOOTSTRAP' ? 'No data available' : 'None this epoch :(')
        elNextBlockLeft.text('')
        if (globalThis.nodeSyncStaus !== 'BOOTSTRAP') {
            globalThis.noSlots = true
        }
    }
}