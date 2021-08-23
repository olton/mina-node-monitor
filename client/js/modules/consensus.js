export const processConsensus = consensus => {
    if (!consensus) return

    const {consensusConfiguration, consensusTimeNow, consensusTimeBestTip} = consensus.data.daemonStatus
    const {
        acceptableNetworkDelay,
        delta,
        epochDuration,
        genesisStateTimestamp,
        k,
        slotDuration,
        slotsPerEpoch
    } = consensusConfiguration

    const epochDurationProgress = (+consensusTimeNow.slot * +slotDuration * 100) / epochDuration
    const progress = Metro.getPlugin('#epoch-progress', 'progress')
    const duration = Metro.utils.secondsToTime(epochDuration/1000)

    progress.val(epochDurationProgress)
    progress.buff(epochDurationProgress)

    $("#consensus-genesis-start").html(datetime(genesisStateTimestamp).format("DD/MM/YYYY"))
    $("#consensus-k").html(k)
    $("#consensus-network-delay").html(acceptableNetworkDelay/60000+"m")
    $("#consensus-epoch-duration").html(`${duration.d}d ${duration.h}h  ${duration.m}m`)
    $("#consensus-slot-duration").html((slotDuration / 60000)+"m")
    $("#consensus-slots-per-epoch").html((+slotsPerEpoch).format(0, null, " ", ""))
    $("#consensus-delta").html(delta)
}