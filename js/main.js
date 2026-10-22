// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

// Close the menu after tapping a link
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  });
});
