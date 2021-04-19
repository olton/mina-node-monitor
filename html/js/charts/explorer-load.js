import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "../helpers/get-info";

(async () => {
    const getExplorerSummary = async () => {
        const explorerInfo = (await getInfo('explorer'))

        if (!explorerInfo || !explorerInfo.blockchainLength) {
            return
        }

        const {blockchainLength} = explorerInfo
        const blockHeightPanel = $("#block-height").closest('.panel')

        blockHeightPanel.removeClass('alert')
        if (+globalThis.blockchainLength - +blockchainLength > 3) {
            blockHeightPanel.addClass('alert')
        }
    }

    setTimeout( async () => {
        await getExplorerSummary()
    }, 30000)

    setInterval( async () => {
        await getExplorerSummary()
    }, 300000)
})()