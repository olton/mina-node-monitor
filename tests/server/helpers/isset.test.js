const {isset} = require("../../../server/helpers/isset")

const a = {}
const b = {a: 1}

console.log("undefined, must be a false", isset(undefined))
console.log("null, Must be a true", isset(null))
console.log("null (not nullable), Must be a false", isset(null, false))
console.log("1, must be a true", isset(1))
console.log("'str', must be a true", isset('str'))
console.log("[], must be a true", isset([]))
console.log("{}, must be a true", isset({}))
console.log("a.b, must be a false", isset(a.b))
console.log("b.a, must be a true", isset(b.a))