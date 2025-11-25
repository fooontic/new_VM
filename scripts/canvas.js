export function initCanvas() {

    const canvas  = document.getElementById("canvas");
    const wrapper = document.getElementById("canvasWrapper");

    if (!canvas || !wrapper) {
        console.warn("[initCanvas] #canvas or #canvasWrapper not found");
        return;
    }

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let offsetX = 0, offsetY = 0;

    const anchorX = 0.50; // -50%
    const anchorY = 0.40; // -40%
    
    let minX = 0, maxX = 0, minY = 0, maxY = 0;
    let wW = 0, wH = 0, cW = 0, cH = 0;

    const overscroll = 0; 

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    function applyTransform() {
        const baseX = wW / 2 - anchorX * cW;
        const baseY = wH / 2 - anchorY * cH;

        canvas.style.transform = `translate(${baseX + offsetX}px, ${baseY + offsetY}px)`;
    }

    function measureBounds() {
        const viewportW = window.innerWidth  || document.documentElement.clientWidth;
        const viewportH = window.innerHeight || document.documentElement.clientHeight;

        const wRect = wrapper.getBoundingClientRect();
        let rawWW = wRect.width;
        let rawWH = wRect.height;

        // размеры из CSS
        const cs = getComputedStyle(canvas);
        const cssW = parseFloat(cs.width)  || 0;
        const cssH = parseFloat(cs.height) || 0;

        let rawCW = canvas.offsetWidth  || cssW;
        let rawCH = canvas.offsetHeight || cssH;

        // --- SANITY CHECK ДЛЯ SAFARI ---
        // если wrapper/канвас почему-то больше вьюпорта в разы — считаем, что Safari сошёл с ума

        if (!rawWW || rawWW > viewportW * 2) {
            rawWW = viewportW;
        }
        if (!rawWH || rawWH > viewportH * 2) {
            rawWH = viewportH;
        }

        // если высота канваса вдруг равна высоте документа / wrapper-а — берём CSS-высоту
        if (cssH > 0 && (rawCH > cssH * 2 || rawCH > viewportH * 4)) {
            rawCH = cssH;
        }
        if (cssW > 0 && (rawCW > cssW * 2 || rawCW > viewportW * 4)) {
            rawCW = cssW;
        }

        wW = rawWW;
        wH = rawWH;
        cW = rawCW;
        cH = rawCH;

        // границы
        const xMin =  anchorX * cW - wW / 2 - overscroll;
        const xMax =  wW / 2 - (1 - anchorX) * cW + overscroll;

        const yMin =  anchorY * cH - wH / 2 - overscroll;
        const yMax =  wH / 2 - (1 - anchorY) * cH + overscroll;

        minX = Math.min(xMin, xMax);
        maxX = Math.max(xMin, xMax);
        minY = Math.min(yMin, yMax);
        maxY = Math.max(yMin, yMax);

        offsetX = clamp(offsetX, minX, maxX);
        offsetY = clamp(offsetY, minY, maxY);

        applyTransform();

        // можешь оставить лог для проверки:
        console.log("wH, cH, viewportH, cssH:", wH, cH, viewportH, cssH);
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

        e.preventDefault();

        const t = e.touches[0];
        currentX = t.clientX - startX;
        currentY = t.clientY - startY;

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

    // ── NEW
    measureBounds();
    
    const ro = new ResizeObserver(measureBounds);
    ro.observe(wrapper);
    ro.observe(canvas);

    // 
    window.addEventListener('orientationchange', measureBounds);
    window.addEventListener('resize', measureBounds);

    // небольшой rAF-дубль — пусть подхватит изменения layout
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            measureBounds();
        });
    });

    window.addEventListener("load", () => {
        setTimeout(measureBounds, 50);
    });
}
