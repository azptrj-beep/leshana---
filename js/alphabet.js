"use strict";

/* ============================================
   ALPHABET.JS — Génération dynamique + Audio
============================================ */

// Génération automatique des cartes depuis alphabet.json
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".alphabet-grid");

    if (!grid) return; // sécurité si la page n'a pas de grille

    fetch("alphabet.json")
        .then(response => response.json())
        .then(data => {
            data.alphabet.forEach(item => {
                const card = document.createElement("div");
                card.className = "letter-card";

                card.innerHTML = `
                    <div class="letter soureth-title">${item.letter}</div>
                    <div class="latin">${item.latin}</div>
                    <button class="audio-btn" data-audio="${item.audio}">
                        🔊 Écouter
                    </button>
                `;

                grid.appendChild(card);
            });

            // Active les sons sur les boutons générés
            initAudioButtons();
        })
        .catch(err => console.error("Erreur chargement alphabet.json :", err));
});

/* ============================================
   AUDIO — Lecture des sons
============================================ */

function initAudioButtons() {
    document.querySelectorAll(".audio-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const audio = btn.dataset.audio;
            if (audio) new Audio(audio).play();
        });
    });
}