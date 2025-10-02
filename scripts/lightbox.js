export function initLightbox() {
    const backdrop = document.createElement('div');
    backdrop.className = 'lightbox__backdrop';
    document.body.appendChild(backdrop);

    let activeImg = null;
    let originalParent = null;
    let placeholder = null;

    document.querySelectorAll('.play-card__pic_openable img, .play-card__pic_openable video').forEach((img) => {
        img.addEventListener('click', () => {
            const rect = img.getBoundingClientRect();
            const scrollY = window.scrollY;
            const scrollX = window.scrollX;

            activeImg = img;
            originalParent = img.parentNode;

            const card = img.closest('.play-card');
            const cardRotate = getComputedStyle(card).rotate;
            img.dataset.originalRotate = cardRotate !== 'none' ? cardRotate : '0deg';

            // Заглушка
            placeholder = document.createElement('div');
            placeholder.style.width = `${rect.width}px`;
            placeholder.style.height = `${rect.height}px`;
            originalParent.replaceChild(placeholder, img);

            // Начальные стили
            img.classList.add('lightbox-move-layer');
            img.style.top = `${rect.top + scrollY}px`;
            img.style.left = `${rect.left + scrollX}px`;
            img.style.width = `${rect.width}px`;
            img.style.height = `${rect.height}px`;
            img.style.rotate = img.dataset.originalRotate;
            document.body.appendChild(img);

            backdrop.classList.add('active');

            requestAnimationFrame(() => {
                img.style.top = `50%`;
                img.style.left = `50%`;
                img.style.transform = `translate(-50%, -50%)`;
                img.style.rotate = `0deg`; // выравниваем к центру
                img.style.width = `80vw`;
                img.style.height = `80vh`;
                img.style.maxHeight = `100%`;
                img.style.maxWidth = `100%`;
                img.style.objectFit = `contain`;
            });
        });
    });

    backdrop.addEventListener('click', () => {
        if (!activeImg || !placeholder) return;

        const rect = placeholder.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        activeImg.style.top = `${rect.top + scrollY}px`;
        activeImg.style.left = `${rect.left + scrollX}px`;
        activeImg.style.transform = `none`;
        activeImg.style.rotate = activeImg.dataset.originalRotate || '0deg';
        activeImg.style.width = `${rect.width}px`;
        activeImg.style.height = `${rect.height}px`;

        backdrop.classList.remove('active');

        setTimeout(() => {
            // Зафиксировать размеры перед возвратом
            const originalRect = placeholder.getBoundingClientRect();
            activeImg.style.width = `${originalRect.width}px`;
            activeImg.style.height = `${originalRect.height}px`;

            activeImg.style.removeProperty('position');
            activeImg.style.removeProperty('top');
            activeImg.style.removeProperty('left');
            activeImg.style.removeProperty('width');
            activeImg.style.removeProperty('height');
            activeImg.style.removeProperty('transform');
            activeImg.style.removeProperty('z-index');
            activeImg.style.removeProperty('transition');
            activeImg.style.removeProperty('object-fit');
            activeImg.style.removeProperty('max-height');
            activeImg.style.removeProperty('max-width');
            activeImg.style.removeProperty('rotate');

            activeImg.classList.remove('lightbox-move-layer');
            placeholder.replaceWith(activeImg);

            activeImg = null;
            placeholder = null;
            originalParent = null;
            }, 150);
    });
}
