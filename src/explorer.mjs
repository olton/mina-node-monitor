import fetch from "node-fetch"

export const getExplorerSummary = async () => {
    const response = await fetch("https://api.minaexplorer.com/summary")
    return response.ok ? await response.json() : {}
}
