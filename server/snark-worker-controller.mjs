import {hostname} from "os"
import {between, daemonStatus, execCommand, isNum, sendAlert} from "./helpers.mjs"

export const processSnarkWorkerController = async () => {
    const config = globalThis.config.snarkWorker
    let cmdStart, cmdStop, cmdFee, setFee, startWorker, stopWorker
    const host = hostname()

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

    let {nextBlock, nodeStatus} = globalThis.nodeInfo
    let daemon = daemonStatus(nodeStatus)

    if (daemon) {
        if (globalThis.snarkWorkerStopped === null || globalThis.snarkWorkerStopped) {
            let now = new Date().getTime()

            if (!daemon.snarkWorker || (globalThis.snarkWorkerStoppedBlockTime && now > globalThis.snarkWorkerStoppedBlockTime + startAfterBlock)) {
                console.log("Start snark worker")

                cmdFee = setWorkerFeeCommand.replace("<FEE>", fee)
                setFee = execCommand(cmdFee)
                setFee.on("exit", (code) => {
                    sendAlert("EXEC", `Command ${cmdFee} executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
                })

                cmdStart = runWorkerCommand.replace("<ADDRESS>", address)
                startWorker = execCommand(cmdStart)
                startWorker.on("exit", (code) => {
                    if (code === 0) {
                        globalThis.snarkWorkerStopped = false
                        globalThis.snarkWorkerStoppedBlockTime = null
                    }
                    sendAlert("EXEC", `Command ${cmdStart} executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
                })
            }
        }

        if (nextBlock) {
            if (stopBeforeBlock && !globalThis.snarkWorkerStopped) {
                if (isNum(nextBlock) && nextBlock > 0) {
                    let now = new Date().getTime()
                    let timeToStop = nextBlock - stopBeforeBlockTime
                    let stop = between(now, timeToStop, nextBlock)

                    if (stop) {
                        console.log("Stop snark worker")
                        cmdStop = runWorkerCommand.replace("<ADDRESS>", "").replace("-address", "")
                        stopWorker = execCommand(cmdStop)
                        stopWorker.on("exit", (code) => {
                            if (code === 0) {
                                globalThis.snarkWorkerStopped = true
                                globalThis.snarkWorkerStoppedBlockTime = nextBlock
                            }
                            sendAlert("EXEC", `Command ${cmdStop} executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
                        })
                    }
                }
            }
        }
    }

    setTimeout(processSnarkWorkerController, controlInterval)
}