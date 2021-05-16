export const getInfo = async (path, parse = true) => {
    const {useProxy, proxy, hosts, useHost} = globalThis.config
    const SERVER_ADDRESS = useProxy ? `${proxy}?server=${useHost}&request=${path}` : `http://${hosts[useHost]}/${path}`

    try {
        const result = await fetch(`${SERVER_ADDRESS}`)
        if (!result.ok) return null
        return parse ? await result.json() : await result.text()
    } catch (e) {
        return null
    }
}
