import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"

export const processDelegators = async () => {
    const delegatorsInfo = await getInfo('delegators')

    if (delegatorsInfo) {
        const {count, stake} = delegatorsInfo

        $("#delegators-total").text(count)
        $("#delegators-stack").text((stake).format(2, null, ",", "."))
    }
}