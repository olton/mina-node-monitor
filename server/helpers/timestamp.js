const timestamp = (date, divider = "-:") => {
    let today = date ? new Date(date) : new Date();
    let d = String(today.getDate()).padStart(2, '0');
    let m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let y = today.getFullYear();
    let H = String(today.getHours()).padStart(2, '0');
    let M = String(today.getMinutes()).padStart(2, '0');
    let [sd = '-', st = ':'] = divider.split("")

    return `${d}${sd}${m}${sd}${y} ${H}${st}${M}`;
}

const secondsToTime = (s) => {
    let days = Math.floor((s % 31536000) / 86400);
    let hours = Math.floor(((s % 31536000) % 86400) / 3600);
    let minutes = Math.floor((((s % 31536000) % 86400) % 3600) / 60);
    let seconds = Math.round((((s % 31536000) % 86400) % 3600) % 60);

    return {
        d: days,
        h: hours,
        m: minutes,
        s: seconds
    }
}

module.exports = {
    timestamp,
    secondsToTime
}