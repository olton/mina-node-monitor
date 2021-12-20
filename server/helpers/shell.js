const fs = require("child_process")

const processGetMinaVersion = () => {
    try {
        let version = fs.execSync('mina version')
        return version.split(" ")[1]
    } catch (e) {
        return "unknown"
    }
}

module.exports = {
    processGetMinaVersion
}