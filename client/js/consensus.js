import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

export const processConsensus = async () => {
    const consensus = await getInfo('consensus')

    if (consensus) {
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
        Metro.getPlugin('#epoch-progress', 'progress').val(epochDurationProgress)
    }

    setTimeout( () => processConsensus(), config.intervals.node)
}
