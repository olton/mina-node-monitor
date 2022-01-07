const {isset} = require("./isset");
const {isNum} = require("./numbers");
const fs = require("fs")
const {logging} = require("./logs");
const {getDefaultConfig} = require("./config");

const createConfig = (path) => {
    const args = process.argv.slice(2)
    if (!args.includes("--init")) {
        return
    }

    let existsConfig = {}

    if (fs.existsSync(path)) {
        existsConfig = JSON.parse(fs.readFileSync(path, 'utf-8'))
    }

    fs.writeFileSync(path, JSON.stringify(getDefaultConfig(existsConfig), null, 4), {flag: 'w+', encoding: 'utf-8'})

    logging("Config file created successfully!")

    process.exit(0)
}

const getArguments = () => {
    const args = process.argv.slice(2)
    const obj = {}
    let startArgIndex = 0

    obj.__rest = []

    while (startArgIndex < args.length) {
        let _value = args[startArgIndex], _next = args[startArgIndex + 1]
        let key, val

        if (_value.slice(0, 2) === '--') {
            key = _value.slice(2)
            val = _next

            startArgIndex++
        } else if (_value.slice(0, 1) === '-') {
            key = _value.slice(1)
            val = true
        } else {
            val = obj.__rest.push(_value)
        }

        obj[key] = isNaN(val) ? val : +val

        startArgIndex++
    }

    return obj
}

const updateConfigFromArguments = (c) => {
    const args = getArguments()
    let _c = Object.assign({}, c)

    for(let o in args) {
        let v = args[o]

        if (isNum(v)) {
            v = Number(v)
        } else if (['true', 'false'].includes(v.toLowerCase())) {
            v = v.toLowerCase() === 'true'
        } else if (v.includes("[") || v.includes(",")) {
            v = v.replace(/[\[\]"'`]/gi, "").split(",")
        }

        if (o.includes(":")) {
            const [p1, p2] = o.split(":")

            if (!isset(_c[p1]) || !isset(_c[p1][p2])) continue
            _c[p1][p2] = v
        } else {
            if (!isset(c[o])) continue
            _c[o] = v
        }
    }

    return {
        ..._c
    }
}

module.exports = {
    getArguments,
    updateConfigFromArguments,
    createConfig
}