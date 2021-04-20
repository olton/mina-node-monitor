import nodes from "./nodes"

const server = {
    "host": nodes.node0
}

const SERVER_ADDRESS = `${server.host}/`

export const getInfo = async (path, parse = true) => {
    try {
        const result = await fetch(`${SERVER_ADDRESS}${path}`)
        if (!result.ok) return null
        return parse ? await result.json() : await result.text()
    } catch (e) {
        return null
    }
}
