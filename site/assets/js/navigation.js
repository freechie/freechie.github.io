import { scrollBehavior } from "./theme.js";

export function initCurrentYear() {
  const year = document.getElementById("year");
  if (!year) return;

  const currentYear = String(new Date().getFullYear());
  year.textContent = currentYear;
  year.setAttribute("datetime", currentYear);
}

export function initActiveNavigation() {
  const links = Array.from(document.querySelectorAll("nav a[href^='#']"));
  const sections = links
    .map((link) => ({
      link,
      section: document.querySelector(link.getAttribute("href")),
    }))
    .filter(({ section }) => Boolean(section));

  if (!sections.length) return;

  function setActive(activeLink) {
    links.forEach((link) => {
      const isActive = link === activeLink;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateActive() {
    const marker = window.scrollY + Math.max(96, window.innerHeight * 0.35);
    let current = sections[0];
    sections.forEach((item) => {
      if (item.section.offsetTop <= marker) current = item;
    });
    setActive(current.link);
  }

  window.addEventListener("scroll", updateActive, { passive: true });
  window.addEventListener("resize", updateActive);
  updateActive();
}

export function initBackToTop() {
  const button = document.getElementById("to-top");
  if (!button) return;

  function toggle() {
    button.hidden = window.scrollY < 400;
  }

  window.addEventListener("scroll", toggle, { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  });
  toggle();
}
