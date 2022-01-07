const fs = require("fs")
const {spawn} = require("child_process")

const isset = (v, nullable = true) => {
    try {
        return nullable ? typeof v !== 'undefined' : typeof v !== 'undefined' && v !== null
    } catch (e) {
        return false
    }
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
    let _c = c

    for(let o in args) {
        if (o[0] === "-") continue

        let v = args[o]

        if (!isNaN(v)) {
            v = Number(v)
        }
        else if (typeof v === "string" && ['true', 'false'].includes(v.toLowerCase())) {
            v = v.toLowerCase() === 'true'
        }
        else if (typeof v === "string" && (v.includes("[") || v.includes(","))) {
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

const start = () => {
    try {
        const args = process.argv.slice(2)

        let configFile, configJSON, configFileName

        configFileName = fs.existsSync(__dirname+"/config.json") ? __dirname+"/config.json" : __dirname+"/config.example.json"
        configFile = fs.readFileSync(configFileName, 'utf-8')
        configJSON = updateConfigFromArguments(JSON.parse(configFile))

        fs.writeFileSync(__dirname+'/config.json', JSON.stringify(configJSON, null, 4), {
            encoding: "utf-8",
            flag: "w"
        })

        if (fs.existsSync(__dirname+"/config.json") && !args.includes("--no-start")) {
            const clientProc = spawn("npm", ["run", "client"], {shell: true})
            clientProc.stdout.on('data', data => {
                console.log(`${data}`);
            })
            clientProc.stderr.on('data', data => {
                console.error(`stderr:\n${data}`);
            })
        }
    } catch (e) {
        console.log(e.message)
        console.log(e.stack)
    }
}

start()
