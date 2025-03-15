
export function initCases() {
    const items = document.querySelectorAll(".cases__item");
    const pictures = document.querySelectorAll(".cases__picture");
    const casesContainer = document.querySelector(".cases"); // Контейнер с элементами
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
        if (!isVisible) return; // Если блок не видим, не меняем активный элемент

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
        pictures.forEach((pic) => pic.classList.remove("cases__picture_active"));
        
        items[index].classList.add("cases__item_active");
        pictures[index].classList.add("cases__picture_active");
        
        currentIndex = index;
        if (hoveredIndex === null) {
            startProgressTimer(index);
        }
    }

    function startProgressTimer(index) {
        if (!isVisible) return;
        clearInterval(progressTimers.get(index));
        let progress = progressIntervals.get(index) || 0;
        const steps = timerDuration / progressUpdateInterval;
        const progressStep = 100 / steps;
        
        let interval = setInterval(() => {
            if (hoveredIndex === index || !isVisible) {
                clearInterval(interval);
                progressTimers.set(index, null);
                return;
            }
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
        if (!isVisible) return;
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
        isVisible = rect.top >= 0 && rect.bottom <= viewportHeight * 1.2; // Проверяем, видим ли блок на 80%
        
        if (isVisible) {
            startTimer();
        } else {
            stopTimer();
        }
    }

    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);
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
                startTimer();
            }
        });
    });
}

export function casesScrollEffect(selector) {
    const targetElement = document.querySelector(selector);
    const mainPage = document.querySelector(".main");
    if (!targetElement) return;

    function handleScroll() {
        const scrollY = window.scrollY; 
        const maxScroll = window.innerHeight * 0.8; // Один полный экран
        const minScale = 0.7;
        const maxScale = 1;
        const minTranslateY = 0.3;
        const maxTranslateY = 0;
        const newColor = "#187CC4";

        // Определяем, насколько далеко прокручена страница (0 - начало, 1 - граница одного экрана)
        let scrollRatio = Math.min(1, scrollY / maxScroll);

        // Увеличиваем scale
        // let scaleValue = Math.min(scrollRatio, 1); 
        let scaleValue = minScale + (maxScale - minScale) * scrollRatio;
        let translateYValue = minTranslateY + (maxTranslateY - minTranslateY) * scrollRatio;
        let translateYPercent = translateYValue * -100;
        let newColorRatio = scrollRatio * 100;

        console.log(newColorRatio);
        console.log(mainPage);

        targetElement.style.transform = `translateY(${translateYPercent}%) scale(${scaleValue})`;
        mainPage.style.backgroundColor = `color-mix(in srgb, ${newColor} ${newColorRatio}%, var(--cc-bg))`;
    }

    // Используем requestAnimationFrame для плавности
    function onScroll() {
        requestAnimationFrame(handleScroll);
    }

    window.addEventListener("scroll", onScroll);
    handleScroll(); // Первоначальный вызов для установки начального состояния
}

// 0.8 + (1 - 0.8) * 0.9 = 0.98
// 0.8 + (1 - 0.8) * 0.8 = 0.96
// 0.8 + (1 - 0.8) * 0.7 = 0.94

// 1288/1355 = 0.95
// 1200/1355 = 0.88