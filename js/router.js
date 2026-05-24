export function initRouter() {
  const links = document.querySelectorAll("a[data-page]");
  const pages = document.querySelectorAll(".page");

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const target = link.dataset.page;

      pages.forEach(p => p.classList.remove("active"));

      const page = document.getElementById(target);
      if (page) page.classList.add("active");
    });
  });
}