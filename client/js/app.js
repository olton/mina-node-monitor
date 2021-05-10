import {processSystemInfo} from "./server-info";
import {processServerTime} from "./server-time";
import {processCPUData} from "./cpu";
import {processMemInfo} from "./mem";
import {processNetConnections, processNetInfo} from "./net";
import {processBlockchainInfo} from "./blockchain";
import {processNodeStatus} from "./node";
import {processConsensus} from "./consensus"

fetch("./config.json").then( (r) => r.ok ? r.json() : null ).then(config => {
    globalThis.config = config

    setTimeout(() => processSystemInfo(), 0)
    setTimeout(() => processServerTime(), 0)
    setTimeout(() => processCPUData(), 0)
    setTimeout(() => processMemInfo(), 0)
    setTimeout(() => processNetInfo(), 0)
    setTimeout(() => processNetConnections(), 0)
    setTimeout( () => processBlockchainInfo(), 0 )
    setTimeout(() => processNodeStatus(), 0)
    setTimeout(() => processConsensus(), 0)
}).catch( reason => {
    //
})
