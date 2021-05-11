import 'regenerator-runtime/runtime' // this required for Parcel
import {getInfo} from "./helpers/get-info"
import {getFakeTriplets} from "./helpers/get-fake-data"
import {defaultChartConfig} from "./helpers/chart-config"
import {imgOk, imgStop} from "./helpers/const";

const graphSize = 20
let START_NODE_MON = datetime()
let START_NODE_POINTS = 200
let peersChart = chart.histogramChart('#peers-load', [
    {
        name: "Peers",
        data: getFakeTriplets(20, 40, 60, 0)
    },
], {
    ...defaultChartConfig,
    bars: {
        stroke: '#22272e'
    },
    boundaries: {
        maxY: 200,
        minY: 0
    },
    graphSize,
    onDrawLabelX: (v) => {
        return ""
    },
    onDrawLabelY: (v) => {
        return `${v}`
    }
})

const getNodeStatus = async () => await getInfo('node-status')
const getExplorerSummary = async () => await getInfo('explorer')
const getBalance = async () => await getInfo('balance')

const processBalance = async () => {
    let status = await getBalance()

    if (status && status.data && status.data.account && status.data.account.balance) {
        const {total, liquid} = status.data.account.balance
        $("#balance-total").text((total/10**9).format(2, null, ",", "."))
        $("#balance-liquid").text((liquid/10**9).format(2, null, ",", "."))
    }
}

const processExplorerSummary = async () => {
    let explorerSummary = await getExplorerSummary()
    const elLog = $("#log-explorer")

    elLog.html(imgStop)

    if (!explorerSummary || isNaN(explorerSummary.blockchainLength)) {
        return
    }

    const {blockchainLength} = explorerSummary
    const elBlockHeightPanel = $("#block-height").closest('.panel')
    const elExplorerHeight = $("#explorer-height")

    elExplorerHeight.text(blockchainLength)

    elBlockHeightPanel.removeClass('alert')
    if (Math.abs(+globalThis.blockchainLength - +blockchainLength) >= 2) {
        elBlockHeightPanel.addClass('alert')
    }
    elLog.html(imgOk)
    // console.log("Block height from explorer (re)loaded!")
}

export const processNodeStatus = async () => {
    let status = await getNodeStatus()
    let reload = globalThis.config.intervals.node
    const UNKNOWN = "UNKNOWN"
    const elLog = $("#log-mina")
    const secondsInEpoch = 1285200000 / 1000
    const genesisStart = "2021-03-17 02:00:00.000000+02:00"

    elLog.html(imgStop)

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

    elements.forEach( id => $("#"+id).text(UNKNOWN))

    if (status && status.data && status.data.daemonStatus) {
        globalThis.blockchainLength = 0

        const node = status.data
        const version = node.version
        const netStatus = node.syncStatus
        const daemon = node.daemonStatus

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
            consensusTimeNow
        } = daemon

        const elNodeStatus = $("#node-status")
        const elNetStatus = $("#network-status")
        const elNextBlockTime = $("#next-block-time")
        const elNextBlockLeft = $("#next-block-left")
        const elPeersCount = $("#peers-count")
        const elBlockHeight = $("#block-height")
        const elMaxBlock = $("#max-block")
        const elMaxUnvalidated = $("#max-unvalidated")
        const elNodeUptime = $("#node-uptime")
        const elIpAddress = $("#ip-address")
        const elBindIp = $("#bind-ip")
        const elP2PPort = $("#p2p-port")
        const elClientPort = $("#client-port")
        const elBlockProducerName = $("#block-producer")
        const elBlockProducerNameFull = $("#block-producer-full")
        const elSnarkWorkerName = $("#snark-worker")
        const elSnarkWorkerNameFull = $("#snark-worker-full")
        const elSnarkWorkerFee = $("#snark-worker-fee")
        const elEndOfEpoch = $("#end-of-epoch")
        const elNodeVersion = $("#node-version")

        elNodeVersion.text(version)

        // node status
        elNetStatus.text(netStatus)
        elNodeStatus.closest(".panel").removeClass("alert warning")
        elNodeStatus.text(syncStatus)
        if (syncStatus === 'CATCHUP') {
            elNodeStatus.closest(".panel").addClass("warning")
        } else if (syncStatus !== 'SYNCED') {
            elNodeStatus.closest(".panel").addClass("alert")
        }

        START_NODE_POINTS += 10
        peersChart.addTriplet(0, [START_NODE_POINTS - 10, START_NODE_POINTS, peers.length])

        // peers
        // peersChart.addPoint(0, [datetime().time(), peers.length])
        elPeersCount.text(peers.length)

        // next block produce
        if (nextBlockProduction && nextBlockProduction.times.length) {
            const blockDate = datetime(+nextBlockProduction.times[0].startTime)
            const blockLeft = Metro.utils.secondsToTime((blockDate.time() - datetime().time())/1000)

            elNextBlockTime.text(blockDate.format("ddd, DD MMM, HH:mm"))
            elNextBlockLeft.text(`${blockLeft.d} day(s) ${blockLeft.h} hour(s) ${blockLeft.m} minute(s)`)
        } else {
            elNextBlockTime.text(syncStatus === 'BOOTSTRAP' ? 'No data available' : 'None this epoch')
            elNextBlockLeft.text('')
        }

        // Epoch end
        const blockLeft = Metro.utils.secondsToTime(
            (datetime(genesisStart).addSecond(secondsInEpoch * (+consensusTimeNow.epoch + 1)).time() - datetime().time()) / 1000
        )
        elEndOfEpoch.text(`will end in ${blockLeft.d}d ${blockLeft.h}h ${blockLeft.m}m`)


        // block height
        globalThis.blockchainLength = blockchainLength
        elBlockHeight.text(blockchainLength)
        elMaxBlock.text(highestBlockLengthReceived)
        elMaxUnvalidated.text(highestUnvalidatedBlockLengthReceived)

        // uptime
        const uptime = Metro.utils.secondsToTime(uptimeSecs)
        elNodeUptime.html(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)

        // ip address
        elIpAddress.text(addrsAndPorts.externalIp)
        elBindIp.text(addrsAndPorts.bindIp)
        elP2PPort.text(addrsAndPorts.libp2pPort)
        elClientPort.text(addrsAndPorts.clientPort)
        if (!config.showIp) {
            elIpAddress.hide()
        } else {
            elIpAddress.show()
        }

        // producer and snark worker
        const noBlockProducer = 'No running block producer'
        const noSnarkWorker = 'No running snark worker'
        const blockProducerName = !blockProductionKeys.length ? noBlockProducer : blockProductionKeys[0].substring(0, 5) + ' ... ' + blockProductionKeys[0].substring(blockProductionKeys[0].length - 5)
        const snarkWorkerName = !snarkWorker ? noSnarkWorker : snarkWorker.substring(0, 5) + '...' + snarkWorker.substring(snarkWorker.length - 5)
        const snarkWorkerFeeValue = !snarkWorkFee ? '' : ` [ <span class="fg-gray">fee</span> ${(snarkWorkFee / 10**9).toFixed(4)} ]`

        elBlockProducerName.text(blockProducerName)
        elBlockProducerNameFull.text(blockProductionKeys.length ? blockProductionKeys[0] : noBlockProducer)
        elSnarkWorkerName.text(snarkWorkerName)
        elSnarkWorkerNameFull.text(snarkWorker ? snarkWorker : noSnarkWorker)
        elSnarkWorkerFee.html(snarkWorkerFeeValue)

        elLog.html(imgOk)
        // console.log("Node (re)loaded!")

        setTimeout(() => processExplorerSummary(), 0)
        setTimeout(() => processBalance(), 0)
    } else {
        reload = 5000
    }

    setTimeout(() => processNodeStatus(), reload)
}

