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

    for (let i = 0; i < args.length; i++) {
        if (i % 2 !== 0) continue
        let key = ""+args[i]
        let _val, val = args[i + 1]

        if (key[0] === '-') {
            key  = key.substr(1)
        }

        _val = isNaN(val) ? val : +val

        if (isset(obj[key])) {
            if (!Array.isArray(obj[key])) {
                obj[key] = [obj[key]]
            }
            obj[key].push(_val)
        } else {
            obj[key] = _val
        }
    }

    return obj
}

const updateConfigFromArguments = (c) => {
    const args = getArguments()
    let _c = c

    for(let o in args) {
        if (o[0] === "-") continue

        let v = args[o]

        if (o === "nodes") {
            let nodes = []
            for(let n of v) {
                n = n.split(":")
                nodes.push({
                    "name": n[0],
                    "host": `${n[1]}:${n[2]}`,
                    "https": !isset(n[3]) ? false : ""+n[3] === "true"
                })
            }
            v = nodes
        }
        else if (!isNaN(v)) {
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
