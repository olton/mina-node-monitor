export const rand = (min, max) => Math.floor(min + Math.random() * (max + 1 - min))

export const getFakeData = (len, inc = 2000, init = 0) => {
    const a = []
    let d = datetime().time() - inc * len
    for (let i = 0; i < len; i++) {
        a.push([d, init])
        d += inc
    }
    return a
}

export const getFakeTriplets = (count, min, max, zero) => {
    let y = 0, x = 0, a = [], d = 10

    for(let i = 0; i < count; i++) {
        y = typeof zero !== 'undefined' ? +zero : rand(min, max)
        x += d
        a.push([x - d, x, y])
    }

    return a
}
