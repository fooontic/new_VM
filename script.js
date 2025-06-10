import { registerScrollHandler, startScrollLoop } from "/scripts/scrollHub.js";
import { changeBgColor } from "/scripts/main.js";
import { initCases, casesScrollEffect, initMobileSlider } from "/scripts/cases.js";
import { heroScrollEffect } from "/scripts/hero.js";
import { playScrollEffect } from "/scripts/play.js";
import { initPlane } from "/scripts/footer.js";

document.addEventListener("DOMContentLoaded", () => {
    changeBgColor(registerScrollHandler);
    initCases();
    heroScrollEffect(".hero", registerScrollHandler);
    casesScrollEffect(".cases_desktop", registerScrollHandler);
    playScrollEffect(".play", registerScrollHandler);
    initPlane(".footer__chat", ".footer__plane");
    initMobileSlider(".cases_mobile .cases__wrapper");
    startScrollLoop();
});