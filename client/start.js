const fs = require("fs")
const {exec} = require("child_process")

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
        if (o[0] === "-") continue

        let v = args[o]

        if (!isNaN(v)) {
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

const start = () => {
    try {
        const args = process.argv.slice(2)

        let configFile, configJSON, configFileName

        configFileName = fs.existsSync("./config.json") ? "./config.json" : "./config.example.json"
        configFile = fs.readFileSync(configFileName, 'utf-8')
        configJSON = updateConfigFromArguments(JSON.parse(configFile))

        fs.writeFileSync('./config.json', JSON.stringify(configJSON, null, 4), {
            encoding: "utf-8",
            flag: "w"
        })

        if (fs.existsSync("./config.json") && !args.includes("--no-start")) {
            exec("npm run client", (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            })
        }
    } catch (e) {
        console.log(e.message)
    }
}

start()
