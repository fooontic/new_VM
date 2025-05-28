export function initScrollBgRepaint() {
    const body = document.body;
    let threshold = window.innerHeight * 0.5; // одна видимая часть экрана

    function updateBgColor() {
        const scrolled = window.scrollY || window.pageYOffset;
        if (scrolled >= threshold) {
            body.style.setProperty("--case-bg-color", "var(--cc-bg-default)");
        } else {
            body.style.setProperty("--case-bg-color", "var(--cc-bg-case-1)");
        }
    }

    window.addEventListener("scroll", () => requestAnimationFrame(updateBgColor));
    window.addEventListener("resize", () => {
        // на случай если высота экрана изменилась
        threshold = window.innerHeight;
        requestAnimationFrame(updateBgColor);
    });

    // вызвать при загрузке, если сразу загружена проскролленная страница
    window.addEventListener("load", () => requestAnimationFrame(updateBgColor));

    // и сразу после инициализации
    requestAnimationFrame(updateBgColor);
}
