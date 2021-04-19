import nodes from "./nodes"

const server = {
    "host": nodes.node1
}

const SERVER_ADDRESS = `${server.host}/`

export const getInfo = async (path, parse = true) => {
    const result = await $.get(`${SERVER_ADDRESS}${path}`)
    return parse ? JSON.parse(result) : result
}
