export const getFakeData = len => {
    const a = []
    let d = datetime().time() - 80000
    for (let i = 0; i < len; i++) {
        a.push([d, 0])
        d += 2000
    }
    return a
}