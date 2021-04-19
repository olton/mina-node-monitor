import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "../helpers/get-info"
import {getFakeData} from "../helpers/get-fake-data"
import {loadChartConfig} from "./load-chart-config"
import {merge} from "../helpers/merge";

(async () => {
    const chartConfig = merge({}, loadChartConfig, {
        onDrawLabelX: (v) => {
            return `${datetime(+v).format("HH:mm:ss")}`
        },
        onDrawLabelY: (v) => {
            return `${v}`
        }
    })
    // memory

    const peersChart = chart.lineChart("#peers-load", [
        {
            name: "Peers",
            data: getFakeData(40)
        },
    ], chartConfig)

    const getNodeInfo = async () => {
        const nodeInfo = (await getInfo('node-status'))

        if (!nodeInfo || !nodeInfo.data) {
            const unknown = "UNKNOWN"

            const elements = [
                "peers-count",
                "block-height",
                "max-block",
                "max-unvalidated",
                "node-status",
                "network-status",
                "node-uptime",
                "block-producer",
                "block-producer-full",
                "snark-worker",
                "snark-worker-full",
                "snark-worker-fee"
            ]

            elements.forEach( id => $("#"+id).text(unknown))

            return
        }

        const info = nodeInfo.data
        const {
            peers,
            syncStatus,
            blockchainLength,
            addrsAndPorts,
            highestBlockLengthReceived,
            highestUnvalidatedBlockLengthReceived,
            uptimeSecs,
            nextBlockProduction,
            blockProductionKeys,
            snarkWorker,
            snarkWorkFee,
        } = info.daemonStatus

        globalThis.blockchainLength = blockchainLength

        const elNodeStatus = $("#node-status")
        const blockDate = nextBlockProduction.times.length ? datetime(+nextBlockProduction.times[0].startTime) : 'None this epoch';
        const blockLeft = typeof blockDate === "string" ? '' : Metro.utils.secondsToTime((blockDate.time() - datetime().time())/1000)

        $("#next-block-time").text(typeof blockDate === "string" ? blockDate : blockDate.format("ddd, DD MMM, HH:mm"))
        $("#next-block-left").text(blockLeft ? `${blockLeft.d} day(s) ${blockLeft.h} hour(s) ${blockLeft.m} minute(s)` : '')

        peersChart.addPoint(0, [datetime().time(), peers.length])
        $("#peers-count").text(peers.length)
        $("#block-height").text(blockchainLength)
        $("#max-block").text(highestBlockLengthReceived)
        $("#max-unvalidated").text(highestUnvalidatedBlockLengthReceived)

        elNodeStatus.closest(".panel").removeClass("alert warning")
        elNodeStatus.text(syncStatus)
        if (syncStatus === 'CATCHUP') {
            elNodeStatus.closest(".panel").addClass("warning")
        } else if (syncStatus !== 'SYNCED') {
            elNodeStatus.closest(".panel").addClass("alert")
        }
        $("#network-status").text(info.syncStatus)

        $("#ip-address").text(addrsAndPorts.externalIp)

        const elNodeUptime = $("#node-uptime")
        const uptime = Metro.utils.secondsToTime(uptimeSecs)
        elNodeUptime.html(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)

        const blockProducerName = !blockProductionKeys.length ? 'No running block producer' : blockProductionKeys[0].substring(0, 5) + ' ... ' + blockProductionKeys[0].substring(blockProductionKeys[0].length - 5)
        $("#block-producer").text(blockProducerName)
        $("#block-producer-full").text(blockProductionKeys.length ? blockProductionKeys[0] : 'No running block producer')

        const snarkWorkerName = !snarkWorker ? 'No running snark worker' : snarkWorker.substring(0, 5) + '...' + snarkWorker.substring(snarkWorker.length - 5)
        $("#snark-worker").text(snarkWorkerName)
        $("#snark-worker-full").text(snarkWorker ? snarkWorker : 'No running snark worker')

        const snarkWorkerFeeValue = !snarkWorkFee ? '' : ` [ <span class="fg-gray">fee</span> ${(snarkWorkFee / 10**9).toFixed(4)} ]`
        $("#snark-worker-fee").html(snarkWorkerFeeValue)
    }

    await getNodeInfo()

    setInterval( async () => {
        await getNodeInfo()
    }, 30000)
})()