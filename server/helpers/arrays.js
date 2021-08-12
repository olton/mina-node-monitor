const deleteFromArray = (arr, val) => {
    const i = arr.indexOf(val)
    if (i > -1) {
        arr.splice(i, 1)
    }
    return arr
}

module.exports = {
    deleteFromArray
}
