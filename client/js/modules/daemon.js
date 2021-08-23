export const processDaemonInfo = daemon => {
    if (!daemon) return

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

    const {
        addrsAndPorts,
        syncStatus,
        blockProductionKeys,
        blockchainLength,
        consensusTimeNow,
        highestBlockLengthReceived,
        highestUnvalidatedBlockLengthReceived,
        nextBlockProduction,
        peers,
        snarkWorkFee,
        snarkWorker,
        uptimeSecs
    } = daemon
    const {
        bindIp,
        clientPort,
        externalIp,
        libp2pPort
    } = addrsAndPorts

    const secondsInEpoch = 1285200000 / 1000
    const genesisStart = "2021-03-17 02:00:00.000000+02:00"
    const height = +blockchainLength
    const maxHeight = +highestBlockLengthReceived
    const unvHeight = +highestUnvalidatedBlockLengthReceived

    // Node uptime
    const uptime = Metro.utils.secondsToTime(uptimeSecs)
    elNodeUptime.html(`${uptime.d}d, ${uptime.h}h ${uptime.m}m`)

    // Block height
    elBlockHeight.html(height ? height : `<span class="mif-infinite"></span>`)

    elMaxBlock.removeClass("fg-red ani-flash").text(maxHeight)
    if (maxHeight !== height) {
        elMaxBlock.addClass("fg-red ani-flash")
    }

    elMaxUnvalidated.removeClass("fg-red ani-flash").text(unvHeight)
    if (unvHeight !== height) {
        elMaxUnvalidated.addClass("fg-red ani-flash")
    }

    // Epoch
    const epochTimLeft = Metro.utils.secondsToTime(
        (datetime(genesisStart).addSecond(secondsInEpoch * (+consensusTimeNow.epoch + 1)).time() - datetime().time()) / 1000
    )
    const epochDays = epochTimLeft.d ? epochTimLeft.d + 'd' : ''
    const epochHours = epochTimLeft.h ? epochTimLeft.h + 'h' : ''
    const epochMinutes = epochTimLeft.m ? epochTimLeft.m + 'm' : ''
    elEndOfEpoch.html(`${epochDays} ${epochHours} ${epochMinutes}`)
    elEpochDuration.html(`${epochDays} ${epochHours} ${epochMinutes}`)

    // Addresses and ports
    elIpAddress.text(config.showIp ? externalIp : "127.0.0.1")
    elBindIp.text(config.showIp ? bindIp : "0.0.0.0")
    elP2PPort.text(libp2pPort)
    elClientPort.text(clientPort)

    // BP and SW
    const partLength = 7
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
}