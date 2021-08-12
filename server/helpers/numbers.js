const between = (val, bottom, top, equals) => equals === true ? val >= bottom && val <= top : val > bottom && val < top
const isNum = (v) => !isNaN(v)

module.exports = {
    between,
    isNum
}
