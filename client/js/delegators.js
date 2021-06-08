import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {imgOk, imgStop} from "./helpers/const";

export const processDelegators = async () => {
    const elLog = $("#log-delegators")
    elLog.html(imgStop)
    const {delegators: interval = 60000} = globalThis.config.intervals

    const delegatorsInfo = await getInfo('delegators')

    if (delegatorsInfo) {
        const account = delegatorsInfo.data.account
        const delegators = account.delegators
        const stake = delegators.reduce((acc, delegator) => acc + +delegator.balance.total, 0)

        $("#delegators-total").text(delegators.length)
        $("#delegators-stack").text((stake / 10**9).format(2, null, ",", "."))

        elLog.html(imgOk)
    }

    setTimeout(()=> processDelegators(), interval)
}