const {parseTime} = require("../helpers/parsers")
const {isset} = require("../helpers/isset")

const processCompare = () => {
    const compare = config.compare
    // if (!isset(compare.hosts)) return

    setTimeout(processCompare, parseTime("3m"))
}

module.exports = {
    processCompare
}