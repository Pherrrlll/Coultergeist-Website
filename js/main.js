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

// Support form: validates, then sends through Web3Forms without leaving the page
const form = document.getElementById("support-form");

if (form) {
  const status = document.getElementById("form-status");
  const message = form.elements.message;
  const count = document.getElementById("message-count");
  const submit = form.querySelector('button[type="submit"]');

  const setStatus = (text, type) => {
    status.textContent = text;
    status.className = `form-status ${type || ""}`;
  };

  message.addEventListener("input", () => {
    count.textContent = message.value.length;
  });

  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("input", () => el.closest(".field")?.classList.remove("has-error"));
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const invalid = [...form.querySelectorAll(".field input, .field select, .field textarea")]
      .filter((el) => !el.checkValidity());
    form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
    if (invalid.length) {
      invalid.forEach((el) => el.closest(".field").classList.add("has-error"));
      invalid[0].focus();
      setStatus("Please fill in the highlighted fields.", "error");
      return;
    }

    if (form.elements.access_key.value.startsWith("YOUR_")) {
      setStatus("The support form isn't set up yet. Please try again later.", "error");
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    data.subject = `[${data.category}] ${data.game} – ${data.platform}`;

    submit.disabled = true;
    setStatus("Sending…");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message);
      form.reset();
      count.textContent = "0";
      setStatus("Thanks — your message has been sent. We'll reply by email.", "success");
    } catch {
      setStatus("Sorry, your message couldn't be sent. Please try again in a few minutes.", "error");
    } finally {
      submit.disabled = false;
    }
  });
}

// Hero launch countdown: <div class="countdown" data-launch="ISO date"> ticks every second
const countdown = document.querySelector(".countdown[data-launch]");

if (countdown) {
  const launch = new Date(countdown.dataset.launch);
  const label = countdown.querySelector(".countdown-label");
  const units = countdown.querySelector(".countdown-units");
  const field = (name) => countdown.querySelector(`[data-unit="${name}"]`);
  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const left = Math.max(0, Math.floor((launch - Date.now()) / 1000));
    if (left === 0) {
      label.textContent = "Relicbearer TD is out now!";
      units.hidden = true;
      clearInterval(timer);
      return;
    }
    field("days").textContent = Math.floor(left / 86400);
    field("hours").textContent = pad(Math.floor((left % 86400) / 3600));
    field("minutes").textContent = pad(Math.floor((left % 3600) / 60));
    field("seconds").textContent = pad(left % 60);
  };

  const timer = setInterval(tick, 1000);
  tick();
  countdown.hidden = false;
}

// Release countdowns: <span data-release="2026-12-01"></span>
document.querySelectorAll("[data-release]").forEach((el) => {
  const release = new Date(el.dataset.release + "T00:00:00");
  const days = Math.ceil((release - new Date()) / 86400000);
  if (days > 1) el.textContent = ` · ${days} days to go`;
  else if (days === 1) el.textContent = " · Tomorrow!";
  else if (days === 0) el.textContent = " · Out today!";
});
