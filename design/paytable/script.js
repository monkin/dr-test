const paytable = document.getElementById("paytable"),
    bounds = paytable.getBoundingClientRect(),
    s = 2048 / bounds.width,
    layout = document.getElementById("layout"),
    items = Array.from(document.querySelectorAll("li"));

layout.innerText = JSON.stringify(items.reduce((r, v) => {
    const { left, top, width, height } = v.getBoundingClientRect();
    r[v.getAttribute("data-combination")] = [
        Math.round((left - bounds.left) * s),
        Math.round((top - bounds.top) * s),
        Math.round(width * s),
        Math.round(height * s)
    ];
    return r;
}, {}));