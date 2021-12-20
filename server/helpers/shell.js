const fs = require("fs")

const processGetMinaVersion = () => {
    try {
        let version = fs.execSync('mina version')
        return version
    } catch (e) {
        return "unknown"
    }
}

module.exports = {
    processGetMinaVersion
}