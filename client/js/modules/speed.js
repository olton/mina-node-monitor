export const processSpeed = data => {
    if (!data) return
    $("#block-speed").html(`<span class="text-bold fg-accent">${(data / 60000).toFixed(2)}</span> minutes`)
}