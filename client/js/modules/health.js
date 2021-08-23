export const processHealth = data => {
    const elNodeHealth = $("#node-health")
    const elBlockHeightPanel = $("#block-height").closest(".panel")

    elNodeHealth.removeClassBy("label-")
    elNodeHealth.removeClassBy("ani-")
    elBlockHeightPanel.removeClass("alert")

    if (!data.length) {
        elNodeHealth.html('OK').addClass("label-success")
    } else {
        elNodeHealth.html(data.join(", ")).addClass("label-alert ani-flash")
        if (data.includes('FORK')) elBlockHeightPanel.addClass("alert")
    }
}