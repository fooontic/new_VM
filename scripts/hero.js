export function initScrollEffect(selector) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    function handleScroll() {
        const scrollY = window.scrollY; // Используем window.scrollY вместо устаревшего pageYOffset
        const maxScroll = window.innerHeight * 0.8; // Один полный экран для полного исчезновения

        // Определяем, насколько далеко прокручена страница (0 - начало, 1 - граница одного экрана)
        let scrollRatio = Math.min(1, scrollY / maxScroll);

        // Уменьшаем scale и уменьшаем прозрачность по мере прокрутки страницы
        let scaleValue = Math.max(0, 1 - scrollRatio * 0.6); 
        let opacityValue = Math.max(0, 1 - scrollRatio * 1.7);

        targetElement.style.transform = `scale(${scaleValue})`;
        targetElement.style.opacity = opacityValue;
    }

    // Используем requestAnimationFrame для плавности
    function onScroll() {
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener("scroll", onScroll);
    handleScroll(); // Первоначальный вызов для установки начального состояния
}
