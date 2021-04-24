export const getInfo = async (path, parse = true) => {
    const SERVER_ADDRESS = `http://${globalThis.config.hosts[globalThis.config.useHost]}/`

    try {
        const result = await fetch(`${SERVER_ADDRESS}${path}`)
        if (!result.ok) return null
        return parse ? await result.json() : await result.text()
    } catch (e) {
        return null
    }
}
