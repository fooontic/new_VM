export function playScrollEffect(selector) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    const leftPicture = targetElement.querySelector(".play__pic:nth-child(1)");
    const rightPicture = targetElement.querySelector(".play__pic:nth-child(3)");

    function handleScroll() {
        const rect = targetElement.getBoundingClientRect();
        const elementHeight = rect.height;

        const minTranslateY = 0.12;
        const maxTranslateY = 0;
        
        const visiblePart = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

        const visibleRatio = Math.max(0, Math.min(visiblePart / elementHeight, 1));

        // если видимость меньше 10%, scale остаётся 0.5
        const minRatio = 0.1;
        if (visibleRatio < minRatio) {
            targetElement.style.transform = `scale(0.7) translateY(-12dvh)`;
            return;
        }

        let progress = (visibleRatio - minRatio) / (1 - minRatio);

        let scale = 0.7 + 0.3 * progress;
        let translateY = minTranslateY + (maxTranslateY - minTranslateY) * progress;

        // targetElement.style.transform = scale;
        targetElement.style.transform = `scale(${scale}) translateY(${translateY * -100}dvh)`;
        leftPicture.style.translate = `${(0.2 + 0.1 * progress) * -100}%`;
        rightPicture.style.translate = `${(0.2 + 0.1 * progress) * 100}%`;
    }

    // Используем requestAnimationFrame для плавности
    function onScroll() {
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    handleScroll(); // Первоначальный вызов для установки начального состояния
}
