export function initScrollBgRepaint() {
    const body = document.body;
    const caseColor = getComputedStyle(body).getPropertyValue('--case-bg-color').trim();
    let threshold = window.innerHeight * 0.5; 

    function updateBgColor() {
        const scrolled = window.scrollY || window.pageYOffset;
        if (scrolled >= threshold) {
            body.style.setProperty("--case-bg-color", "var(--cc-bg-default)");
        } else {
            body.style.setProperty("--case-bg-color", caseColor);
        }

        // console.log("scrollY:", window.scrollY, "threshold:", threshold);
        // console.log("current color:", getComputedStyle(body).getPropertyValue('--case-bg-color'));
    }

    window.addEventListener("scroll", () => requestAnimationFrame(updateBgColor));
    window.addEventListener("resize", () => {
        threshold = window.innerHeight;
        requestAnimationFrame(updateBgColor);
    });

    
    window.addEventListener("load", () => requestAnimationFrame(updateBgColor));

    requestAnimationFrame(updateBgColor);
}
