export function playScrollEffect(selector) {
    const targetElement = document.querySelector(selector);
    if (!targetElement) return;

    const leftPicture = targetElement.querySelector(".play__pic:nth-child(1)");
    const rightPicture = targetElement.querySelector(".play__pic:nth-child(3)");

    function handleScroll() {
        const rect = targetElement.getBoundingClientRect();
        const elementHeight = rect.height;
        
        const visiblePart = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

        const visibleRatio = Math.max(0, Math.min(visiblePart / elementHeight, 1));

        // если видимость меньше 10%, scale остаётся 0.5
        const minRatio = 0.1;
        if (visibleRatio < minRatio) {
            targetElement.style.transform = `scale(0.6)`;
            return;
        }

        const progress = (visibleRatio - minRatio) / (1 - minRatio);

        console.log(progress);

        const scale = 0.6 + 0.4 * progress;

        targetElement.style.transform = `scale(${scale})`;
        leftPicture.style.translate = `${(0.2 + 0.1 * progress) * -100}%`;
        rightPicture.style.translate = `${(0.2 + 0.1 * progress) * 100}%`;

        // Увеличиваем scale
        // let scaleValue = Math.min(scrollRatio, 1); 
        // let scaleValue = minScale + (maxScale - minScale) * scrollRatio;
        // let translateYValue = minTranslateY + (maxTranslateY - minTranslateY) * scrollRatio;
        // let translateYPercent = translateYValue * -100;
        // let newColorRatio = scrollRatio * 100;

        // targetElement.style.transform = `translateY(${translateYPercent}%) scale(${scaleValue})`;
        // mainPage.style.backgroundColor = `color-mix(in srgb, ${newColor} ${scrollRatio * 100}%, var(--cc-bg))`;
        // casesPic.style.opacity = scrollRatio;
    }

    // Используем requestAnimationFrame для плавности
    function onScroll() {
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    handleScroll(); // Первоначальный вызов для установки начального состояния
}
