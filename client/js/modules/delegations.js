export const processDelegations = data => {
    if (!data) return

    const {delegators, delegators_next, stake, stake_next} = data[0]

    $("#delegators-total").text(delegators)
    $("#delegators-stack").text(Number(stake/10**9).format(4, null, ",", "."))

    $("#delegators-total-next").text(delegators_next)
    $("#delegators-stack-next").text(Number(stake_next/10**9).format(4, null, ",", "."))
}