const {isset} = require("./isset");
const getArguments = () => {
    const args = process.argv.slice(2)
    const obj = {}

    for (let i = 0; i < args.length; i++) {
        if (i % 2 !== 0) continue
        let key = ""+args[i]
        let val = args[i + 1]
        if (key[0] === '-') {
            key  = key.substr(1)
        }
        obj[key] = isNaN(val) ? val : +val
    }

    return obj
}

const updateConfigFromArguments = (c) => {
    const args = getArguments()
    let _c = c

    for(let o in args) {
        const v = JSON.parse(args[o])

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
    updateConfigFromArguments
}