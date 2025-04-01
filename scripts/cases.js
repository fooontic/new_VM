export function initCases() {
    const items = document.querySelectorAll(".cases_desktop .cases__item");
    const pictures = document.querySelectorAll(".cases_desktop .cases__pic");
    const casesContainer = document.querySelector(".cases_desktop"); // Контейнер с элементами
    const root = document.querySelector(".main");
    if (!casesContainer) return; // Если блока нет, выход

    let currentIndex = 0;
    let interval;
    let progressIntervals = new Map(); // Хранит прогресс для каждого элемента
    const timerDuration = 6000; // Основное время таймера в миллисекундах
    const progressUpdateInterval = 100; // Интервал обновления прогресса
    let hoveredIndex = null; // Индекс элемента, на котором наведен ховер
    let progressTimers = new Map(); // Хранит интервалы прогресса
    let isVisible = false; // Флаг видимости контейнера

    function setActive(index) {
        clearInterval(interval);
        clearInterval(progressTimers.get(currentIndex));

        items.forEach((item, idx) => {
            item.classList.remove("cases__item_active");
            if (idx !== index) {
                clearInterval(progressTimers.get(idx));
                progressTimers.set(idx, null);
                progressIntervals.set(idx, 0); // Сброс прогресса у всех, кроме активного
                items[idx].style.removeProperty("--progress"); // Удаление CSS-свойства
            }
        });
        pictures.forEach((pic) => pic.classList.remove("cases__pic_active"));

        items[index].classList.add("cases__item_active");
        pictures[index].classList.add("cases__pic_active");

        currentIndex = index;
        if (hoveredIndex === null) {
            startProgressTimer(index);
        }

        const event = new CustomEvent("casesItemChanged", {
            detail: { index, source: "desktop" }
        });
        window.dispatchEvent(event);
    }

    function startProgressTimer(index) {
        clearInterval(progressTimers.get(index));
        let progress = progressIntervals.get(index) || 0;
        const steps = timerDuration / progressUpdateInterval;
        const progressStep = 100 / steps;

        let interval = setInterval(() => {
            progress += progressStep;
            items[index].style.setProperty("--progress", Math.min(progress, 100).toFixed(1) + "%");
            progressIntervals.set(index, progress);
            if (progress >= 100) {
                clearInterval(interval);
                progressTimers.set(index, null);
                progressIntervals.set(index, 0);
                items[index].style.removeProperty("--progress");
                currentIndex = (currentIndex + 1) % items.length;
                setActive(currentIndex);
            }
        }, progressUpdateInterval);
        progressTimers.set(index, interval);
    }

    function startTimer() {
        clearInterval(interval);
        clearInterval(progressTimers.get(currentIndex));

        interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % items.length;
            setActive(currentIndex);
        }, timerDuration - (progressIntervals.get(currentIndex) || 0) / 100 * timerDuration);
        startProgressTimer(currentIndex);
    }

    function stopTimer() {
        clearInterval(interval);
        clearInterval(progressTimers.get(currentIndex));
    }

    function checkVisibility() {
        const rect = casesContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        const visiblePart = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibleRatio = Math.max(0, Math.min(visiblePart / rect.height, 1));
        isVisible = visibleRatio >= 0.3;
    }

    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                checkVisibility();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    checkVisibility(); // Первоначальная проверка при загрузке

    items.forEach((item, index) => {
        item.addEventListener("mouseenter", function () {
            clearInterval(progressTimers.get(index)); // Останавливаем прогресс при ховере
            stopTimer();
            hoveredIndex = index;
            setActive(index);
        });
        item.addEventListener("mouseleave", function () {
            if (hoveredIndex === index) {
                hoveredIndex = null;
                checkVisibility();
                startTimer();
            }
        });
    });

    // Поддержка события смены слайда на мобилке
    window.addEventListener("mobileCasesItemChanged", (event) => {
        const index = event.detail.index;
        if (typeof index === "number") {
            root.style.setProperty("--cc-bg", `var(--cc-bg-case-${index + 1})`);
        }
    });
}


////////////////////////////////////////////////
// Мобильный слайдер ////////////////////////
export function initMobileSlider(selector) {
    const wrapper = document.querySelector(selector);
    const slider = wrapper.querySelector(".cases__slider");
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    function updateActiveSlide() {
        const items = slider.querySelectorAll(".cases__item");
        const dots = wrapper.querySelectorAll(".cases__dot");
        const sliderRect = slider.getBoundingClientRect();

        let closestItem = null;
        let closestDistance = Infinity;

        items.forEach((item) => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;
            const sliderCenter = sliderRect.left + sliderRect.width / 2;
            const distance = Math.abs(sliderCenter - itemCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = item;
            }
        });

        items.forEach((item) => item.classList.remove("cases__item_active"));
        if (closestItem) {
            closestItem.classList.add("cases__item_active");
        }

        const activeItemIndex = Array.from(items).indexOf(closestItem);

        dots.forEach((dot) => dot.classList.remove("cases__dot_active"));
        if (dots[activeItemIndex]) {
            dots[activeItemIndex].classList.add("cases__dot_active");
        }

        // ← ← ← добавили отправку события при смене активного слайда на мобилке
        const event = new CustomEvent("mobileCasesItemChanged", {
            detail: { index: activeItemIndex }
        });
        window.dispatchEvent(event);
    }

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        slider.classList.add("dragging");
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slider.classList.remove("dragging");
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slider.classList.remove("dragging");
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.2;
        slider.scrollLeft = scrollLeft - walk;
        updateActiveSlide();
    });

    // Поддержка тач-свайпа
    let startTouchX = 0;
    let startScrollLeft = 0;

    slider.addEventListener("touchstart", (e) => {
        startTouchX = e.touches[0].pageX;
        startScrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("touchmove", (e) => {
        const x = e.touches[0].pageX;
        const walk = (x - startTouchX) * 1.2;
        slider.scrollLeft = startScrollLeft - walk;
        updateActiveSlide();
    });

    slider.addEventListener("scroll", updateActiveSlide);
    updateActiveSlide();
}


////////////////////////////////////////////////
// Анимация по скроллу ////////////////////////
export function casesScrollEffect(selector) {
    const targetElement = document.querySelector(selector);
    const mainPage = document.querySelector(".main");
    const casesPic = document.querySelector(".cases_desktop .cases__pictures");
    if (!targetElement) return;

    function handleScroll() {
        const scrollY = window.scrollY; 
        const maxScroll = window.innerHeight * 0.6; 
        const minScale = 0.7;
        const maxScale = 1;
        const minTranslateY = 0.05;
        const maxTranslateY = 0;
        const newColor = "#52018C";

        // Определяем, насколько далеко прокручена страница (0 - начало, 1 - граница одного экрана)
        let scrollRatio = Math.min(1, scrollY / maxScroll);

        // Увеличиваем scale
        // let scaleValue = Math.min(scrollRatio, 1); 
        let scaleValue = minScale + (maxScale - minScale) * scrollRatio;
        let translateYValue = minTranslateY + (maxTranslateY - minTranslateY) * scrollRatio;
        let translateYPercent = translateYValue * -100;

        targetElement.style.transform = `translateY(${translateYPercent}%) scale(${scaleValue})`;
        // mainPage.style.backgroundColor = `color-mix(in srgb, ${newColor} ${scrollRatio * 100}%, var(--cc-bg))`;
        casesPic.style.opacity = scrollRatio;
    }

    // Используем requestAnimationFrame для плавности
    function onScroll() {
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);
    handleScroll(); // Первоначальный вызов для установки начального состояния
}


