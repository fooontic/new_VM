export function heroScrollEffect(selector) { 
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    let lastScale = 1;
    let lastOpacity = 1;

    function handleScroll() {
        const scrollY = window.scrollY; 
        const maxScroll = window.innerHeight * 0.8; // Один полный экран для полного исчезновения

        // Определяем, насколько далеко прокручена страница (0 - начало, 1 - граница одного экрана)
        let scrollRatio = Math.min(1, scrollY / maxScroll);

        // Уменьшаем scale и уменьшаем прозрачность по мере прокрутки страницы
        let scaleValue = Math.max(0, 1 - scrollRatio * 0.6); 
        let opacityValue = Math.max(0, 1 - scrollRatio * 1.5);

        if (scaleValue !== lastScale || opacityValue !== lastOpacity) {
            targetElement.style.transform = `scale(${scaleValue})`;
            targetElement.style.opacity = opacityValue;

            // Вместо display: none/block — используем visibility и pointer-events
            if (opacityValue <= 0) {
                targetElement.style.visibility = "hidden";
            } else {
                targetElement.style.visibility = "visible";
            }

            lastScale = scaleValue;
            lastOpacity = opacityValue;
        }
    }

    // Используем scrollHub, если он передан
    if (typeof registerScrollHandler === "function") {
        registerScrollHandler(handleScroll);
    } else {
        // fallback: обычный scroll
        window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
    }

    // вызовем при инициализации
    requestAnimationFrame(handleScroll);
}
