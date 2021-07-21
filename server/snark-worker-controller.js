import {between, execCommand, isNum, sendAlert} from "./helpers.mjs";

export const processSnarkWorkerController = async () => {
    const config = globalThis.config.snarkWorker
    let cmd, setFee, startWorker, stopWorker

    if (!config) return

    const {
        address,
        fee = 0.001,
        stopBeforeBlock = 0,
        startAfterBlock = 60000,
        stopBeforeBlockTime = 300000,
        runWorkerCommand,
        setWorkerFeeCommand,
        controlInterval = 10000
    } = config

    if (!address) return

    let {nextBlock} = globalThis.nodeInfo

    if (nextBlock === null) return

    if (stopBeforeBlock && !globalThis.snarkWorkerStopped) {
        if (isNum(nextBlock) && nextBlock > 0) {
            let now = new Date().getTime()
            let timeToStop = nextBlock - stopBeforeBlockTime
            let stop = between(now, timeToStop, nextBlock)

            if (stop) {
                cmd = runWorkerCommand.replace("<ADDRESS>", "")
                stopWorker = execCommand(cmd)
                stopWorker.on("exit", (code) => {
                    if (code === 0) {
                        globalThis.snarkWorkerStopped = true
                        globalThis.snarkWorkerStoppedBlockTime = nextBlock
                    }
                    sendAlert("EXEC", `Command ${cmd} executed ${code === 0 ? "successfully" : "with error code " + code}`)
                })
            }
        }
    }

    if (globalThis.snarkWorkerStopped) {
        let now = new Date().getTime()

        if (now > globalThis.snarkWorkerStoppedBlockTime + startAfterBlock) {
            globalThis.snarkWorkerStopped = false
            globalThis.snarkWorkerStoppedBlockTime = null

            cmd = setWorkerFeeCommand.replace("<FEE>", fee)
            setFee = execCommand(cmd)
            setFee.on("exit", (code) => {
                sendAlert("EXEC", `Command ${cmd} executed ${code === 0 ? "successfully" : "with error code " + code}`)
            })

            cmd = runWorkerCommand.replace("<ADDRESS>", address)
            startWorker = execCommand(cmd)
            startWorker.on("exit", (code) => {
                if (code === 0) {
                    globalThis.snarkWorkerStopped = true
                    globalThis.snarkWorkerStoppedBlockTime = nextBlock
                }
                sendAlert("EXEC", `Command ${cmd} executed ${code === 0 ? "successfully" : "with error code " + code}`)
            })
        }
    }

    setTimeout(processSnarkWorkerController, controlInterval)
}