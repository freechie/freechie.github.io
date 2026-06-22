import { prefersReducedMotion } from "./theme.js";

export function initFooterEffect() {
  const footerMade = document.querySelector(".footer-made");
  const heart = document.querySelector(".heart");
  const garden = document.querySelector(".garden");
  const city = document.querySelector(".city");
  let active = false;
  let timeouts = [];
  const heartColors = [
    "#f04040",
    "#ff2060",
    "#ff6080",
    "#e00040",
    "#ff4070",
    "#ff8090",
    "#d02050",
  ];

  if (!footerMade || !heart || prefersReducedMotion()) return;

  function shake(element, tintHeart) {
    if (!active || !element) return;
    const dx = (Math.random() - 0.5) * 5;
    const dy = (Math.random() - 0.5) * 4;
    const scale = 0.9 + Math.random() * 0.5;
    const rotation = (Math.random() - 0.5) * 20;

    element.style.display = "inline-block";
    element.style.transform =
      `translate(${dx}px,${dy}px) scale(${scale}) rotate(${rotation}deg)`;

    if (tintHeart) {
      element.style.color =
        heartColors[Math.floor(Math.random() * heartColors.length)];
    }

    timeouts.push(
      window.setTimeout(() => shake(element, tintHeart), 40 + Math.random() * 50),
    );
  }

  function restore() {
    active = false;
    timeouts.forEach(window.clearTimeout);
    timeouts = [];
    heart.style.color = "";
    heart.style.transform = "";
    if (garden) garden.style.transform = "";
    if (city) city.style.transform = "";
  }

  footerMade.addEventListener("mouseenter", () => {
    if (active) return;
    active = true;
    shake(heart, true);
    shake(garden, false);
    shake(city, false);
  });
  footerMade.addEventListener("mouseleave", restore);
}

export function initLogoEffect() {
  const logo = document.querySelector(".nav-logo");
  const original = "jrm";
  const characters = "!@#$%^&*?~/\\|<>{}[]0123456789abcdefghijklmnopqrstuvwxyz";
  let hovering = false;
  let interval;

  if (!logo || prefersReducedMotion()) return;

  function runScramble() {
    let iterations = 0;
    interval = window.setInterval(() => {
      logo.textContent = original
        .split("")
        .map((_character, index) => {
          if (index < iterations) return original[index];
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join("");
      iterations += 1 / 3;
      if (iterations >= original.length) {
        window.clearInterval(interval);
        if (hovering) runScramble();
      }
    }, 40);
  }

  logo.addEventListener("mouseenter", () => {
    hovering = true;
    runScramble();
  });

  logo.addEventListener("mouseleave", () => {
    hovering = false;
    window.clearInterval(interval);
    logo.textContent = original;
  });
}
