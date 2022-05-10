const processDelegations = (data) => {
    if (data) {
        globalThis.cache.delegations = data
    }
}

module.exports = {
    processDelegations
}