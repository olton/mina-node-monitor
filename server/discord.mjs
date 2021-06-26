import fetch from "node-fetch";

export const discord = async (url, message, {username = "Mina Monitor", avatar_url = ""} = {}) => {
    const params = {
        username,
        avatar_url,
        content: message
    }

    return fetch(url, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    })
}