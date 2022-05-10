const processRewards = data => {
    if (data) {
        globalThis.cache.rewards = data
    }
}

module.exports = {
    processRewards
}