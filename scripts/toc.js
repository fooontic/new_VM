export function initFloatingToc() {
    const tocItems = document.querySelectorAll(".toc__item a");
    const headings = Array.from(tocItems)
        .map(link => document.querySelector(decodeURIComponent(link.getAttribute("href"))))
        .filter(Boolean);

    if (!tocItems.length || !headings.length) return;

    function getVisibleHeadings() {
        const scrollY = window.scrollY || window.pageYOffset;
        const buffer = 10; // небольшой буфер сверху

        return headings
            .map((heading, index) => {
                const rect = heading.getBoundingClientRect();
                return {
                    index,
                    top: rect.top,
                    offsetTop: heading.offsetTop
                };
            })
            .filter(h => h.top + buffer >= 0);
    }

    function updateActiveToc() {
        const visible = getVisibleHeadings();
        if (!visible.length) return;

        const topHeading = visible[0];

        tocItems.forEach((item, idx) => {
            item.parentElement.classList.toggle("toc__item_active", idx === topHeading.index);
        });
    }

    window.addEventListener("scroll", () => requestAnimationFrame(updateActiveToc));
    window.addEventListener("resize", () => requestAnimationFrame(updateActiveToc));

    // также активировать правильный элемент при клике на якорную ссылку
    tocItems.forEach(link => {
        link.addEventListener("click", () => {
            requestAnimationFrame(() => {
                setTimeout(updateActiveToc, 300); // подождать пока произойдет скролл
            });
        });
    });

    // ✅ вызвать сразу при загрузке
    window.addEventListener("load", () => {
        requestAnimationFrame(updateActiveToc);
    });

    // ✅ и на всякий случай сразу после инициализации
    requestAnimationFrame(updateActiveToc);
}
