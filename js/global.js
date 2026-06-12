/* ============================================
   GLOBAL.JS — Menu hamburger + Thème
============================================ */

// MENU HAMBURGER
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("nav");

if (menuToggle) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("active");
    });
}

// FERMETURE DU MENU EN CLIQUANT SUR UN LIEN
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
    });
});

// MODE SOMBRE / CLAIR
const themeBtn = document.getElementById("themeToggle");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });
}

// CHARGEMENT DU THÈME
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
}