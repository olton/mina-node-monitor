const {parseTime} = require("../../../server/helpers/parsers")

console.log(parseTime("5m", "5m"))
console.log(parseTime("1d23m13s", "1d23m13s"))
console.log(parseTime("1d23m13s", "1d 23m 13s"))