const scrollHandlers = new Set();

export function registerScrollHandler(fn) {
    if (typeof fn === "function") {
        scrollHandlers.add(fn);
    }
}

export function startScrollLoop() {
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                scrollHandlers.forEach((fn) => fn());
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    // Инициализируем все обработчики один раз
    requestAnimationFrame(() => {
        scrollHandlers.forEach((fn) => fn());
    });
}