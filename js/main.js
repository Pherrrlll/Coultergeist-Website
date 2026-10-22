// Footer year
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
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
}

// Release countdowns: <span data-release="2026-12-01"></span>
document.querySelectorAll("[data-release]").forEach((el) => {
  const release = new Date(el.dataset.release + "T00:00:00");
  const days = Math.ceil((release - new Date()) / 86400000);
  if (days > 1) el.textContent = ` · ${days} days to go`;
  else if (days === 1) el.textContent = " · Tomorrow!";
  else if (days === 0) el.textContent = " · Out today!";
});
