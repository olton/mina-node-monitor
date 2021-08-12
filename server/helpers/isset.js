const isset = (v, nullable = true) => {
    try {
        return nullable ? typeof v !== 'undefined' : typeof v !== 'undefined' && v !== null
    } catch (e) {
        return false
    }
}

module.exports = {
    isset
}