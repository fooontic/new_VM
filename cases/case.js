import { initFloatingToc } from "/scripts/toc.js";
import { initScrollBgRepaint } from "/scripts/caseBgRepaint.js";

document.addEventListener("DOMContentLoaded", () => {
    initFloatingToc();
    initScrollBgRepaint();
});