import { initFloatingToc } from "/scripts/toc.js";
import { initScrollBgRepaint } from "/scripts/caseBgRepaint.js";
import { initPlane } from "/scripts/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    initFloatingToc();
    initScrollBgRepaint();
    initPlane(".footer__chat", ".footer__plane");
});