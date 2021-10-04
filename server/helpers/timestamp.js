const timestamp = (divider = "-") => {
    let today = new Date();
    let d = String(today.getDate()).padStart(2, '0');
    let m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let y = today.getFullYear();
    let H = String(today.getHours()).padStart(2, '0');
    let M = String(today.getMinutes()).padStart(2, '0');

    return `${d}${divider}${m}${divider}${y} ${H}:${M}`;
}

module.exports = {
    timestamp
}