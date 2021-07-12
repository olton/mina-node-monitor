import {getInfo} from "./helpers/get-info"
import {getFakeTriplets} from "./helpers/get-fake-data"
import {defaultChartConfig} from "./helpers/chart-config"
import {imgOk, imgStop} from "./helpers/const";
import {copy2clipboard} from "./helpers/clipboard";

const graphSize = 20
let START_NODE_MON = datetime()
let START_NODE_POINTS = 200
let peersChart

const processHealth = async () => {
    let health = await getInfo('health')
    const el = $("#status-group")
    const elHealth = $("#node-health")

    el.removeClass("border bd-red")
    if (!health || health.length) {
        el.addClass("border bd-red")
    }

    if (health && health.length) {
        elHealth.html($("<span>").addClass("fg-red").html(health.join(" ")))
    }
    if (health && health.length === 0) {
        elHealth.html($("<span>").addClass("fg-green").html("OK"))
    }
}

const processBalance = async () => {
    const {currency = 'usd'} = globalThis.config.price

    let status = await getInfo('balance')

    if (status && status.data && status.data.account && status.data.account.balance) {
        const {total, liquid} = status.data.account.balance

        globalThis.balance = +total / 10**9

        $("#balance-total").text((total/10**9).format(2, null, ",", "."))
        $("#balance-liquid").text((liquid/10**9).format(2, null, ",", "."))

        $("#balance-usd").text((globalThis.balance * globalThis.price).format(2, null, ",", ".") + " " + currency.toUpperCase())
    }
}

const processExplorerSummary = async () => {
    const elLog = $("#log-explorer")
    elLog.html(imgStop)

    let explorerSummary = await getInfo('explorer')

    if (!explorerSummary || isNaN(explorerSummary.blockchainLength)) {
        return
    }

    const {blockchainLength} = explorerSummary
    const elExplorerHeight = $("#explorer-height")

    elExplorerHeight.removeClass('fg-red ani-flash').text(blockchainLength)

    if (Math.abs(+globalThis.blockchainLength - +blockchainLength) >= 2) {
        elExplorerHeight.addClass('fg-red ani-flash')
    }
    elLog.html(imgOk)
}

export const processNodeStatus = async () => {
    const elLog = $("#log-mina")
    elLog.html(imgStop)

    if (!peersChart) {
        peersChart = chart.histogramChart('#peers-load', [
                getFakeTriplets(20, 40, 60, 0)
        ], {
            ...defaultChartConfig,
            bars: [{
                name: "Peers",
                stroke: globalThis.darkMode ? '#22272e' : '#fff',
                color: Metro.colors.toRGBA('#00AFF0', .5)
            }],
            boundaries: {
                maxY: 100,
                minY: 0
            },
            graphSize,
            legend: false,
            axis: {
                x: {
                    line: {
                        color: globalThis.chartLineColor,
                        shortLineSize: 0
                    },
                    label: {
                        count: 10,
                        color: globalThis.chartLabelColor,
                    },
                    arrow: false
                },
                y: {
                    line: {
                        color: globalThis.chartLineColor
                    },
                    label: {
                        count: 10,
                        font: {
                            size: 10
                        },
                        color: globalThis.chartLabelColor,
                        skip: 2,
                        fixed: 0
                    },
                    arrow: false,
                }
            },
            padding: {
                left: 30,
                top: 5,
                right: 1,
                bottom: 10
            },
            height: 160,
            onDrawLabelX: () => {
                return ""
            },
            onDrawLabelY: (v) => {
                return `${v}`
            }
        })
    }

    let status = await getInfo('node-status')
    let reload = globalThis.config.intervals.daemon
    const secondsInEpoch = 1285200000 / 1000
    const genesisStart = "2021-03-17 02:00:00.000000+02:00"
    const partLength = 7


    ;["peers-count", "block-height", "max-block", "max-unvalidated", "snark-worker-fee"].forEach( id => $("#"+id).text(`0`))
    ;["node-status", "network-status", "node-uptime", "block-producer", "snark-worker"].forEach( id => $("#"+id).text(`NONE`))

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
        const elIpAddress = $(".ip-address")
        const elBindIp = $("#bind-ip")
        const elP2PPort = $("#p2p-port")
        const elClientPort = $("#client-port")
        const elBlockProducerName = $("#block-producer")
        const elSnarkWorkerName = $("#snark-worker")
        const elSnarkWorkerFee = $("#snark-worker-fee")
        const elEndOfEpoch = $("#end-of-epoch")
        const elEpochDuration = $("#epoch-duration")
        const elNodeVersion = $("#node-version")

        const shortVersion = version.substring(0, partLength) + ' ... ' + version.substring(version.length - partLength)
        elNodeVersion.text(shortVersion).attr("data-full-name", version)

        // node status
        elNetStatus.text(netStatus)
        elNodeStatus.closest(".panel").removeClass("alert warning catchup")
        elNodeStatus.text(syncStatus)
        if (syncStatus === 'CATCHUP') {
            elNodeStatus.closest(".panel").addClass("catchup")
        } else if (syncStatus !== 'SYNCED') {
            elNodeStatus.closest(".panel").addClass("alert")
        }

        START_NODE_POINTS += 10
        peersChart.add(0, [START_NODE_POINTS - 10, START_NODE_POINTS, peers.length], true)

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
            elNextBlockTime.text(syncStatus === 'BOOTSTRAP' ? 'No data available' : 'None this epoch :(')
            elNextBlockLeft.text('')
            if (syncStatus !== 'BOOTSTRAP') {
                globalThis.noSlots = true
            }
        }

        // Epoch end
        const blockLeft = Metro.utils.secondsToTime(
            (datetime(genesisStart).addSecond(secondsInEpoch * (+consensusTimeNow.epoch + 1)).time() - datetime().time()) / 1000
        )
        const epochDays = blockLeft.d ? blockLeft.d + 'd' : ''
        const epochHours = blockLeft.h ? blockLeft.h + 'h' : ''
        const epochMinutes = blockLeft.m ? blockLeft.m + 'm' : ''
        elEndOfEpoch.html(`${epochDays} ${epochHours} ${epochMinutes}`)
        elEpochDuration.html(`${epochDays} ${epochHours} ${epochMinutes}`)

        // block height
        globalThis.blockchainLength = blockchainLength
        elBlockHeight.html(blockchainLength ? blockchainLength : `<span class="mif-infinite"></span>`)

        elMaxBlock.removeClass("fg-red ani-flash").text(highestBlockLengthReceived)
        if (+highestBlockLengthReceived !== +blockchainLength) {
            elMaxBlock.addClass("fg-red ani-flash")
        }

        elMaxUnvalidated.removeClass("fg-red ani-flash").text(highestUnvalidatedBlockLengthReceived)
        if (+highestUnvalidatedBlockLengthReceived !== +blockchainLength) {
            elMaxUnvalidated.addClass("fg-red ani-flash")
        }

        globalThis.blockHeight = blockchainLength

        const blockDiff = Math.abs(+blockchainLength - +highestUnvalidatedBlockLengthReceived)
        elBlockHeight.closest(".panel").removeClass('alert warning')
        if (syncStatus === 'SYNCED') {
            if (+highestUnvalidatedBlockLengthReceived === 0 || blockDiff === 2) {
                elBlockHeight.closest(".panel").addClass('warning')
            } else if (blockDiff > 2) {
                elBlockHeight.closest(".panel").addClass('alert')
            }
        } else {
            if (syncStatus === 'CATCHUP') {
                elBlockHeight.closest(".panel").addClass('warning')
            } else {
                elBlockHeight.closest(".panel").addClass('alert')
            }
        }


        // uptime
        const uptime = Metro.utils.secondsToTime(uptimeSecs)
        elNodeUptime.html(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)

        // ip address
        elIpAddress.text(config.showIp ? addrsAndPorts.externalIp : "127.0.0.1")
        elBindIp.text(config.showIp ? addrsAndPorts.bindIp : "0.0.0.0")
        elP2PPort.text(addrsAndPorts.libp2pPort)
        elClientPort.text(addrsAndPorts.clientPort)

        // producer and snark worker
        const noBlockProducer = 'No running block producer'
        const noSnarkWorker = 'No running snark worker'
        const blockProducerName = blockProductionKeys.length ? blockProductionKeys[0] : ""
        const snarkWorkerName = snarkWorker ? snarkWorker : ""
        const shortBlockProducerName = blockProducerName.substring(0, partLength) + ' ... ' + blockProducerName.substring(blockProducerName.length - partLength)
        const shortSnarkWorkerName = snarkWorkerName.substring(0, partLength) + ' ... ' + snarkWorkerName.substring(snarkWorkerName.length - partLength)
        const snarkWorkerFeeValue = !snarkWorkFee ? '' : ` [ <span class="fg-gray">fee</span> ${(snarkWorkFee / 10**9).toFixed(4)} ]`

        elBlockProducerName.text(blockProducerName ? shortBlockProducerName : noBlockProducer).attr("data-full-name", blockProducerName)
        elSnarkWorkerName.text(snarkWorkerName ? shortSnarkWorkerName : noSnarkWorker).attr("data-full-name", snarkWorkerName)
        elSnarkWorkerFee.html(snarkWorkerFeeValue)

        elLog.html(imgOk)
        // console.log("Node (re)loaded!")

        setTimeout(() => processExplorerSummary(), 0)
        setTimeout(() => processBalance(), 0)
        setTimeout(() => processHealth(), 0)
    } else {
        reload = 5000
    }

    setTimeout(processNodeStatus, reload)
}

$("#node-version, #block-producer, #snark-worker").on("click", function(){
    let val = $(this).attr("data-full-name")
    copy2clipboard(val)
})