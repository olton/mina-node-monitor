import {hostname} from "os"
import {between, daemonStatus, execCommand, isNum, parseTime, sendAlert} from "./helpers.mjs"

export const processSnarkWorkerController = async () => {
    const config = globalThis.config.snarkWorker
    let cmdStart, cmdStop, cmdFee, setFee, startWorker, stopWorker
    const host = hostname()

    if (!config) return

    const {
        address,
        fee = 0.001,
        stopBeforeBlock = "5m",
        startAfterBlock = "1m",
        runWorkerCommand,
        setWorkerFeeCommand,
        controlInterval = "10s"
    } = config

    const _startAfterBlock = parseTime(startAfterBlock)
    const _stopBeforeBlock = parseTime(stopBeforeBlock)
    const _controlInterval = parseTime(controlInterval)

    console.log("SW stop", _stopBeforeBlock)
    console.log("SW start", _startAfterBlock)
    console.log("SW control", _controlInterval)

    if (!address) return

    let {nextBlock, nodeStatus} = globalThis.nodeInfo
    let daemon = daemonStatus(nodeStatus)

    if (daemon) {
        if (globalThis.snarkWorkerStopped === null || globalThis.snarkWorkerStopped) {
            let now = new Date().getTime()

            if (!daemon.snarkWorker || (globalThis.snarkWorkerStoppedBlockTime && now > globalThis.snarkWorkerStoppedBlockTime + _startAfterBlock)) {
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
            if (_stopBeforeBlock && !globalThis.snarkWorkerStopped) {
                if (isNum(nextBlock) && nextBlock > 0) {
                    let now = new Date().getTime()
                    let timeToStop = nextBlock - _stopBeforeBlock
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

    setTimeout(processSnarkWorkerController, _controlInterval)
}