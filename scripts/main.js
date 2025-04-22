export function changeBgColor() {
    const root = document.querySelector(".main");
    const hero = document.querySelector(".main__hero");
    const desktopCases = document.querySelector(".cases_desktop");
    const mobileCases = document.querySelector(".cases_mobile");
    const play = document.querySelector(".play");

    if (!hero || !desktopCases || !mobileCases || !play) return;

    function getVisibleRatio(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const visible = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        return Math.max(0, Math.min(visible / rect.height, 1));
    }

    function updateCasesColor(source) {
        const selector = source === "mobile" ? ".cases_mobile .cases__item" : ".cases_desktop .cases__item";
        const items = document.querySelectorAll(selector);
        const activeIndex = Array.from(items).findIndex(item => item.classList.contains("cases__item_active"));
        if (activeIndex === -1) return;

        root.style.setProperty("--cc-bg", `var(--cc-bg-case-${activeIndex + 1})`);
    }

    function handleBgColor() {
        const heroRatio = getVisibleRatio(hero);
        const desktopCasesRatio = getVisibleRatio(desktopCases);
        const mobileCasesRatio = getVisibleRatio(mobileCases);
        const playRatio = getVisibleRatio(play);

        if (heroRatio >= 0.7) {
            root.style.setProperty("--cc-bg", "var(--cc-bg-hero)");
        } else if (desktopCasesRatio >= 0.7) {
            updateCasesColor("desktop");
        } else if (mobileCasesRatio >= 0.7) {
            updateCasesColor("mobile");
        } else if (playRatio >= 0.7) {
            root.style.setProperty("--cc-bg", "var(--cc-bg-default)");
        } else {
            root.style.setProperty("--cc-bg", "var(--cc-bg-default)");
        }
    }

    window.addEventListener("casesItemChanged", (event) => {
        let { index, source } = event.detail;
        if (typeof index !== "number") return;

        // fallback — определяем source, если он не передан
        if (!source) {
            const mobileItem = document.querySelector(`.cases_mobile .cases__item:nth-child(${index + 1})`);
            const desktopItem = document.querySelector(`.cases_desktop .cases__item:nth-child(${index + 1})`);
            source = mobileItem?.classList.contains("cases__item_active") ? "mobile" : "desktop";
        }

        const container = source === "mobile"
            ? document.querySelector(".cases_mobile")
            : document.querySelector(".cases_desktop");
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const visibleRatio = Math.max(0, Math.min(
            (Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)) / rect.height,
            1
        ));

        if (visibleRatio >= 0.7) {
            root.style.setProperty("--cc-bg", `var(--cc-bg-case-${index + 1})`);
        }
    });

    window.addEventListener("scroll", () => requestAnimationFrame(handleBgColor));
    window.addEventListener("resize", () => requestAnimationFrame(handleBgColor));
    handleBgColor();

    // корректное определение цвета при первой загрузке
    window.addEventListener("load", () => {
        requestAnimationFrame(() => {
            handleBgColor();
        });
    });

    // на всякий случай — fallback при инициализации
    requestAnimationFrame(() => {
        setTimeout(handleBgColor, 0);
    });
} 