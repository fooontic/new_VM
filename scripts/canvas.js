export function initCanvas() {

    const canvas  = document.getElementById("canvas");
    const wrapper = document.getElementById("canvasWrapper");

    if (!canvas || !wrapper) {
        console.warn("[initCanvas] #canvas или #canvasWrapper не найдены");
        return;
    }

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let offsetX = 0, offsetY = 0;

    // ── NEW: пределы
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    const overscroll = 500; // поставь, например, 80 для небольшого «люфта» за границы

    // ── NEW: утилиты
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    function applyTransform() {
        canvas.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    // ── NEW: пересчитка границ на основе реальных размеров
    function measureBounds() {
        const wRect = wrapper.getBoundingClientRect();
        const wW = wRect.width;
        const wH = wRect.height;

        // Важно: берем размеры canvas из computedStyle, чтобы transform не влиял
        const cs = getComputedStyle(canvas);
        const cW = parseFloat(cs.width);
        const cH = parseFloat(cs.height);

        maxX = overscroll;
        maxY = overscroll;
        minX = Math.min(0, wW - cW) - overscroll;
        minY = Math.min(0, wH - cH) - overscroll;

        // На случай если текущая позиция уже «вылетела» — вернуть в допустимые рамки
        // ---- ДОБАВИЛОСЬ ----
        if (offsetX === 0 && offsetY === 0) {
            // центрируем по X, а по Y оставляем сверху
            offsetX = clamp((wW - cW) / 2, minX, maxX);
            offsetY = clamp(offsetY, minY, maxY);
        } else {
            // если уже таскали, просто клампим в пределах
            offsetX = clamp(offsetX, minX, maxX);
            offsetY = clamp(offsetY, minY, maxY);
        }

        applyTransform();
    }

    function onMouseDown(e) {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        wrapper.style.cursor = 'grabbing';
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;

        // ── CHANGED: клампим
        offsetX = clamp(currentX, minX, maxX);
        offsetY = clamp(currentY, minY, maxY);

        applyTransform();
    }

    function onMouseUp() {
        isDragging = false;
        wrapper.style.cursor = 'grab';
    }

    // Touch Support
    function onTouchStart(e) {
        const t = e.touches[0];
        startX = t.clientX - offsetX;
        startY = t.clientY - offsetY;
        isDragging = true;
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        const t = e.touches[0];
        currentX = t.clientX - startX;
        currentY = t.clientY - startY;

        // ── CHANGED: клампим
        offsetX = clamp(currentX, minX, maxX);
        offsetY = clamp(currentY, minY, maxY);

        applyTransform();
    }

    function onTouchEnd() {
        isDragging = false;
    }

    // Mouse events
    wrapper.addEventListener("mousedown", onMouseDown);
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseup", onMouseUp);
    wrapper.addEventListener("mouseleave", onMouseUp);

    // Touch events
    wrapper.addEventListener("touchstart", onTouchStart, { passive: true });
    wrapper.addEventListener("touchmove", onTouchMove, { passive: false });
    wrapper.addEventListener("touchend", onTouchEnd);
    wrapper.addEventListener("touchcancel", onTouchEnd);

    // ── NEW: первая расчётка и пересчёт на ресайз
    measureBounds();
    const ro = new ResizeObserver(measureBounds);
    ro.observe(wrapper);
    ro.observe(canvas);

    // (опционально) Чуть более отзывчиво на поворот/зум в мобильном браузере:
    window.addEventListener('orientationchange', measureBounds);
    window.addEventListener('resize', measureBounds);
}