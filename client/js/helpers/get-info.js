export const getInfo = async (path, parse = true) => {
    const {useProxy, proxy, hosts, useHost} = globalThis.config

    if (useProxy) {
        const SERVER_ADDRESS = `${proxy}?server=${useHost}&request=${path}`

        try {
            const result = await fetch(`${SERVER_ADDRESS}`)
            if (!result.ok) return null
            return parse ? await result.json() : await result.text()
        } catch (e) {
            return null
        }

    } else {
        const SERVER_ADDRESS = `http://${hosts[useHost]}`

        try {
            const result = await fetch(`${SERVER_ADDRESS}/${path}`)
            if (!result.ok) return null
            return parse ? await result.json() : await result.text()
        } catch (e) {
            return null
        }
    }
}
