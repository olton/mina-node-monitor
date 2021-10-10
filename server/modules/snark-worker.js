const {hostname} = require("os")
const {parseTime} = require("../helpers/parsers")
const {execCommand} = require("../helpers/process")
const {sendAlert} = require("../helpers/messangers")
const {between} = require("../helpers/numbers")
const {SYNC_STATE_SYNCED, SYNC_STATE_CATCHUP} = require("../helpers/consts");
const {logging} = require("../helpers/logs");

const processSnarkWorkerController = async () => {
    const swConfig = config["snarkWorker"]
    let cmdStart, cmdStop, cmdFee, setFee, startWorker, stopWorker
    const host = hostname()

    if (!swConfig) return
    if (globalThis.snarkWorkerRunError) return

    const {
        address,
        fee = 0.001,
        stopBeforeBlock = "5m",
        startAfterBlock = "1m",
        runWorkerCommand,
        setWorkerFeeCommand,
        controlInterval = "10s"
    } = swConfig

    const _startAfterBlock = parseTime(startAfterBlock)
    const _stopBeforeBlock = parseTime(stopBeforeBlock)
    const _controlInterval = parseTime(controlInterval)

    if (!address) return

    let nextBlock = cache.nextBlock
    let state = cache.state

    const startSW = () => {
        logging("Start snark worker")
        cmdFee = setWorkerFeeCommand.replace("<FEE>", fee)
        setFee = execCommand(cmdFee)
        setFee.on("exit", (code) => {
            if (code === 0) {
                logging(`Snark Worker Fee ${fee} successfully installed!`)
            }
            sendAlert("EXEC", `Command \`${cmdFee}\` executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
        })

        cmdStart = runWorkerCommand.replace("<ADDRESS>", address)
        startWorker = execCommand(cmdStart)
        startWorker.on("exit", (code) => {
            if (code === 0) {
                globalThis.snarkWorkerStopped = false
                globalThis.snarkWorkerStoppedBlockTime = null
                logging("Snark Worker successfully started!")
            } else {
                globalThis.snarkWorkerRunError = true
                sendAlert("EXEC", "Snark Work run error! Snark Worker Controller was stopped!")
            }
            sendAlert("EXEC", `Command \`${cmdStart}\` executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
        })
    }

    const stopSW = () => {
        logging("Stop snark worker")
        cmdStop = runWorkerCommand.replace("<ADDRESS>", "").replace("-address", "")
        stopWorker = execCommand(cmdStop)
        stopWorker.on("exit", (code) => {
            if (code === 0) {
                globalThis.snarkWorkerStopped = true
                globalThis.snarkWorkerStoppedBlockTime = nextBlock
                logging("Snark Worker successfully stopped!")
            }
            sendAlert("EXEC", `Command ${cmdStop} executed ${code === 0 ? "successfully" : "with error code " + code} for the host ${host}`)
        })
    }

    let now = new Date().getTime()
    let timeToStop = nextBlock ? nextBlock - _stopBeforeBlock : 0
    let needStop = nextBlock && timeToStop ? between(now, timeToStop, nextBlock) : false
    let needStart = snarkWorkerStoppedBlockTime && now > snarkWorkerStoppedBlockTime + _startAfterBlock || false

    if ((state === SYNC_STATE_SYNCED || state === SYNC_STATE_CATCHUP) && address) {
        // If SW not started, but defined - start it
        // Если SW определен, но по какой то причине не запущен

        if (snarkWorkerStopped === null) {

            if (!nextBlock || (!needStop || needStart)) {
                startSW()
            }

        } else {

            // If SW was stopped
            // Если SW был остановлен контроллером
            if (snarkWorkerStopped) {

                if (needStart) {
                    startSW()
                }

            } else {

                // SW is working now
                // SW сейчас работает
                if (nextBlock && needStop) {
                    stopSW()
                }

            }

        }
    }

    setTimeout(processSnarkWorkerController, _controlInterval)
}

module.exports = {
    processSnarkWorkerController
}