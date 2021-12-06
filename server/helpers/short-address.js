const shortAddress = (v, l = 5) => `${v.substring(0, l) + '...' + v.substring(v.length - l)}`

module.exports = {
    shortAddress
}