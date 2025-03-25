import { initCases, casesScrollEffect } from "./scripts/cases.js";
import { heroScrollEffect } from "./scripts/hero.js";
import { playScrollEffect } from "./scripts/play.js";

document.addEventListener("DOMContentLoaded", () => {
    initCases();
    heroScrollEffect(".hero"); // Замени на нужный селектор
    casesScrollEffect(".cases");
    playScrollEffect(".play");
});