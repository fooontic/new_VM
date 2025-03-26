export function initPlane(linkEl, iconEl) {
    const link = document.querySelector(linkEl);
    const icon = document.querySelector(iconEl);
    if (!link || !icon) return;

    link.addEventListener("mouseenter", () => {
        icon.style.transition = 'transform 0.05s ease';
    });

    link.addEventListener("mousemove", (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Обновляем позицию иконки внутри блока
        icon.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });

    link.addEventListener("mouseleave", () => {
        // Прячем иконку вниз при выходе
        icon.style.transition = 'transform 200ms ease-in';
        icon.style.transform = 'translate(100%, 200%)';
    });
}