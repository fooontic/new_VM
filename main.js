import { initCases, casesScrollEffect } from "./scripts/cases.js";
import { heroScrollEffect } from "./scripts/hero.js";
import { playScrollEffect } from "./scripts/play.js";
import { initPlane } from "./scripts/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    initCases();
    heroScrollEffect(".hero"); // Замени на нужный селектор
    casesScrollEffect(".cases");
    playScrollEffect(".play");
    initPlane(".footer__chat", ".footer__plane");
});