export function initCanvas() {
    const canvas = document.getElementById("canvas");
    const wrapper = document.getElementById("canvasWrapper");

    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let offsetX = 0, offsetY = 0;

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
        offsetX = currentX;
        offsetY = currentY;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }

    function onMouseUp() {
        isDragging = false;
        wrapper.style.cursor = 'grab';
    }

    // Touch Support
    function onTouchStart(e) {
        startX = e.touches[0].clientX - offsetX;
        startY = e.touches[0].clientY - offsetY;
        isDragging = true;
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        currentY = e.touches[0].clientY - startY;
        offsetX = currentX;
        offsetY = currentY;
        canvas.style.transform = `translate(${currentX}px, ${currentY}px)`;
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
    wrapper.addEventListener("touchstart", onTouchStart);
    wrapper.addEventListener("touchmove", onTouchMove);
    wrapper.addEventListener("touchend", onTouchEnd);
}