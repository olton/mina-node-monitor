import nodes from "./nodes"

const server = {
    "https": false,
    "port": 3085,
    "host": nodes.node1
}

const SERVER_ADDRESS = `${server.https ? 'https' : 'http'}://${server.host}:${server.port}/`

export const getInfo = async (path, parse = true) => {
    const result = await $.get(`${SERVER_ADDRESS}${path}`)
    return parse ? JSON.parse(result) : result
}
