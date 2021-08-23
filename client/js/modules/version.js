export const processVersion = version => {
    const shortVersion = version.substring(0, 7) + ' ... ' + version.substring(version.length - 7)
    $("#node-version").text(shortVersion).attr("data-full-name", version)
}