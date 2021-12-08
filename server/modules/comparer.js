const WebSocket = require("ws")
const {logging} = require("../helpers/logs");
const {sendMessage} = require("../helpers/messangers");
const {SYNC_STATE_SYNCED} = require("../helpers/consts");

const storeNodeHeight = (node, data) => {

    if (!data) return
    if (!globalThis.cache.daemon) return

    const {blockDiff = 2} = config

    const {
        syncStatus: status,
        blockchainLength: height,
        highestBlockLengthReceived: maxHeight,
        highestUnvalidatedBlockLengthReceived: unvHeight
    } = data

    let comparison = globalThis.cache.comparison
    let compareStatus = "INITIAL"

    const {
        syncState,
        blockchainLength
    } = globalThis.cache.daemon

    let diff = +blockchainLength - +height

    if (
        syncState === SYNC_STATE_SYNCED
        && status === SYNC_STATE_SYNCED
        && Math.abs(diff) >= blockDiff
    ) {
        if (diff > 0) {
            compareStatus = "MORE"
        } else if (diff < 0) {
            compareStatus = "LESS"
        } else {
            compareStatus = "OK"
        }
    }

    comparison[node.name] = {
        name: node.name,
        status,
        height,
        maxHeight,
        unvHeight,
        compareStatus,
        diff
    }

    globalThis.cache.comparison = comparison

    if (["LESS", "MORE"].includes(compareStatus)) {
        sendMessage("COMPARE", `The height of the node is different from \`${node.name.toUpperCase()}\`. Diff: \`${Math.abs(diff)}\`, Height: \`${blockchainLength}\` instead of \`${height}\`.`)
    }
}

const openHostConnection = (node) => {
    /*
    * node = {
    *   name,
    *   address,
    *   https
    * }
    * */
    const {name, address, https = false} = node
    const proto = https ? 'wss://' : 'ws://'

    try {
        const client = new WebSocket(`${proto}${address}`)
        client.onmessage = (event) => {
            const content = JSON.parse(event.data)
            if (!content.action) return
            const {action, data} = content

            switch (action) {
                case 'daemon': storeNodeHeight(node, data); break;
            }
        }

        client.onopen = () => {
            logging(`Mina Monitor Server connected to comparable node ${node.name}`)
        }

        client.onclose = () => {
            logging(`Mina Monitor lost connection to comparable node ${node.name}. Reconnect after 30sec`)
            setTimeout(openHostConnection, 30000, node)
        }

        client.onerror = e => {
            //logging(`Error connection to comparable node ${node.name} with message ${e.message}`)
        }
    } catch (e) {
        logging(e.message)
    }
}

const processCompare = () => {
    const {comparison} = config

    if (!Array.isArray(comparison) || !comparison.length) {
        return
    }

    for (let node of comparison) {
        openHostConnection(node)
    }
}

module.exports = {
    processCompare
}