import { initCases, casesScrollEffect } from "./scripts/cases.js";
import { heroScrollEffect } from "./scripts/hero.js";

document.addEventListener("DOMContentLoaded", () => {
    initCases();
    heroScrollEffect(".hero"); // Замени на нужный селектор
    casesScrollEffect(".cases");
});