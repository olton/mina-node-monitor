import {spawn} from "child_process"
import EventEmitter from "events"
import {sendAlert} from "./helpers.mjs"
import {hostname} from "os"
import {writeFileSync} from "fs"

class JSONStream {
    constructor(cb) {
        this.cb = cb
        this.obj = 0
        this.str = false
        this.esc = false
    }

    decodeChar(c){
        if (!this.str && c === '{' && this.obj++ === 0) {
            this.data = ''
        }

        // Add character
        this.data += c

        // Hide brackets in strings
        if (c === '"' && !this.esc) this.str = !this.str

        // Track escape chars
        if (!this.esc && c === '\\') {
            this.esc = true
        } else if (this.esc) {
            this.esc = false
        }

        // Stop at closing bracket
        if (!this.str && c === '}' && --this.obj === 0) {
            this.cb(JSON.parse(this.data));
        }
    }

    decode(str){
        for (let i = 0; i < str.length; i++) this.decodeChar(str[i]);
    }
}

export class Journal extends EventEmitter {
    constructor({reverse = false, follow = true, all, user, lines, since, identifier, unit, filter} = {}) {
        super()

        // Decode opts
        const args = ["-o", "json"];

        if (all) args.push('-a');
        if (follow) args.push('-f');
        if (reverse) args.push('-r');
        if (user) args.push('--user');
        if (lines) args.push('-n', lines)
        if (since) args.push('-S', since)
        if (identifier) args.push('-t', identifier)
        if (unit) args.push('-u', unit)
        if (filter) {
            if (!(filter instanceof Array)) filter = [filter]
            filter.forEach((f) => args.push(f));
        }

        this.journal = spawn('journalctl', args);

        const decoder = new JSONStream((e) => {
            this.emit('event', e);
        });
        this.journal.stdout.on('data', (chunk) => {
            decoder.decode(chunk.toString());
        });
    }

    stop(cb){
        if (cb) this.journal.on('exit', cb)
        this.journal.kill()
    }
}

export const processJournal = () => {
    if (process.platform === 'linux' && globalThis.config.journal) {
        new Journal({
            unit: "mina",
            user: true
        }).on("event", (e) => {
            const message = e.MESSAGE
            if (message.includes("exited, code") || message.includes("crash")) {
                try {
                    writeFileSync(globalThis.logs.fails, `${message}\n`, {flag: 'a+'})
                } catch (e) {}
                sendAlert("FAIL", `Mina was stopped on ${hostname()} with message ${message}`)
            }
        })
    }
}