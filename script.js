import { changeBgColor } from "./scripts/main.js";
import { initCases, casesScrollEffect, initMobileSlider } from "./scripts/cases.js";
import { heroScrollEffect } from "./scripts/hero.js";
import { playScrollEffect } from "./scripts/play.js";
import { initPlane } from "./scripts/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    changeBgColor();
    initCases();
    heroScrollEffect(".hero"); // Замени на нужный селектор
    casesScrollEffect(".cases_desktop");
    playScrollEffect(".play");
    initPlane(".footer__chat", ".footer__plane");
    initMobileSlider(".cases_mobile .cases__wrapper");
});