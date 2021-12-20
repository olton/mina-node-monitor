const fs = require("child_process")

const processGetMinaVersion = () => {
    try {
        return fs.execSync('mina version')
    } catch (e) {
        return "unknown"
    }
}

module.exports = {
    processGetMinaVersion
}