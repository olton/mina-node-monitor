export const processState = data => {
    const elSyncStatus = $("#node-status")
    const elSyncStatusPanel = elSyncStatus.closest(".panel")

    globalThis.nodeSyncStaus = data
    elSyncStatus.html(data)

    elSyncStatusPanel.removeClass("alert warning info stop catchup")
    if (data === 'BOOTSTRAP') {
        elSyncStatusPanel.addClass("alert")
    } else if (data === 'CATCHUP') {
        elSyncStatusPanel.addClass("catchup")
    } else if (data === 'SYNCED') {

    } else {
        // offline, connected, ...
        elSyncStatusPanel.addClass("stop")
    }
}