export const getFakeData = (len, inc = 2000, init = 0) => {
    const a = []
    let d = datetime().time() - inc * len
    for (let i = 0; i < len; i++) {
        a.push([d, init])
        d += inc
    }
    return a
}

export const getFakeHistogramData = (len, inc, init = 0) => {
    const a = []
    let d = datetime().time() - inc * len
    for (let i = 0; i < len; i++) {
        a.push([d, d - inc, init])
        d += inc
    }
    return a
}

export const getFakeHistogramData2 = (len, inc, init = 0) => {
    const a = []
    let d = inc * len
    for (let i = 0; i < len; i++) {
        a.push([d, d - inc, init])
        d += inc
    }
    return a
}
