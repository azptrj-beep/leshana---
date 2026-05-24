export function initUI() {
  document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", (e) => {
      const ripple = document.createElement("span");

      ripple.className = "ripple";

      ripple.style.left = e.offsetX + "px";
      ripple.style.top = e.offsetY + "px";

      card.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });
}