const {watch, existsSync, readFileSync} = require("fs")
const crypto = require('crypto')
const {logging} = require("./logs")
const {hostname} = require("os");

const processConfigWatcher = (configFile) => {
    if (!configFile || !existsSync(configFile)) return

    logging(`The observation for the config file enabled!`)
    let fsWait = false, md5Prev = null
    watch(configFile, (event, file) => {
        if (file) {
            if (fsWait) return
            fsWait = setTimeout(() => {
                fsWait = false
            }, 100)
            const newConfig = readFileSync(configFile, {encoding: 'utf-8'})
            const md5Curr = crypto.createHash('md5').update(newConfig).digest("hex")
            if (md5Curr === md5Prev) return
            md5Prev = md5Curr
            try {
                globalThis.config = JSON.parse(newConfig)
                globalThis.host = globalThis.config.name || hostname().split(".")[0]
                logging(`Config parameters were updated!`)
            } catch (e) {
                logging(`New config is wrong! Please check it`, true)
            }
        }
    })
}

module.exports = {
    processConfigWatcher
}