export const parseTelegramChatIDs = s => s ? s.split(",").map( v => v.trim() ) : ""

export const timestamp = () => {
    let today = new Date();
    let d = String(today.getDate()).padStart(2, '0');
    let m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let y = today.getFullYear();
    let H = String(today.getHours()).padStart(2, '0');
    let M = String(today.getMinutes()).padStart(2, '0');

    return `${d}/${m}/${y} ${H}:${M}`;
}