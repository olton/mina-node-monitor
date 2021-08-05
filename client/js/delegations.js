import {getInfo} from "./helpers/get-info"
import {parseTime} from "./helpers/parse-time";

export const processDelegations = async () => {
    const data = await getInfo('delegations')

    if (data) {
        const {current, next} = data

        $("#delegators-total").text(current.count)
        $("#delegators-stack").text((current.stake).format(2, null, ",", "."))

        $("#delegators-total-next").text(next.count)
        $("#delegators-stack-next").text((next.stake).format(2, null, ",", "."))
    }

    setTimeout(processDelegations, parseTime("1m"))
}