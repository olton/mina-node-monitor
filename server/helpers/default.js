const {isset} = require("./isset");

const defaultValue = (val, def) => {
    return isset(val, false) ? val : def
}

module.exports = {
    defaultValue
}