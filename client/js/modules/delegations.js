export const processDelegations = data => {
    if (!data) return

    const {current, next} = data

    $("#delegators-total").text(current.count)
    $("#delegators-stack").text((current.stake).format(2, null, ",", "."))

    $("#delegators-total-next").text(next.count)
    $("#delegators-stack-next").text((next.stake).format(2, null, ",", "."))
}