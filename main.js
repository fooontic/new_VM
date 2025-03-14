import { initCases } from "./scripts/cases.js";
import { initScrollEffect } from "./scripts/hero.js";

document.addEventListener("DOMContentLoaded", () => {
    initCases();
    initScrollEffect(".hero"); // Замени на нужный селектор
});