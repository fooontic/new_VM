
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
};
