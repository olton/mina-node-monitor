import fetch from "node-fetch";

export const discord = (url, message, {username = "Mina Monitor", avatar_url = ""} = {}) => {
    const params = {
        username,
        avatar_url,
        content: `${message}\n------------------\n`
    }

    fetch(url, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' }
    }).catch((e) => {
        console.log("Error! Can't send message to discord")
        console.log(e.message)
    })
}