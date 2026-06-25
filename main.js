const root = document.documentElement;
const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const menuButton = document.getElementById("menu-button");
const mobileNav = document.getElementById("mobile-nav");
const backToTop = document.getElementById("back-to-top");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const heroVisual = document.querySelector(".hero-visual");
const heroCard = document.querySelector(".main-card");
const stickyOne = document.querySelector(".sticky-one");
const stickyTwo = document.querySelector(".sticky-two");
const floatingChip = document.querySelector(".floating-chip-card");

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme") || "light";
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

menuButton?.addEventListener("click", () => {
  const isOpen = body.classList.toggle("menu-open");
  mobileNav?.classList.toggle("is-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    mobileNav.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

function updateBackToTopButton() {
  if (!backToTop) return;
  backToTop.classList.toggle("is-visible", window.scrollY > 620);
}

window.addEventListener("scroll", updateBackToTopButton, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const canUseCursor = window.matchMedia("(pointer: fine)").matches;

if (canUseCursor && cursorDot && cursorRing) {
  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
    cursorRing.animate(
      { transform: `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)` },
      { duration: 420, fill: "forwards", easing: "ease-out" }
    );
  });

  document.querySelectorAll("a, button, .expertise-card, .project-card, .work-case-card").forEach((element) => {
    element.addEventListener("mouseenter", () => cursorRing.classList.add("is-hovering"));
    element.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hovering"));
  });
} else {
  cursorDot?.remove();
  cursorRing?.remove();
}

if (canUseCursor && heroVisual && heroCard) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    heroCard.style.transform = `rotate(${2 + x * 3}deg) translate(${x * 14}px, ${y * 14}px)`;
    if (stickyOne) stickyOne.style.transform = `rotate(${-7 + x * 4}deg) translate(${x * -16}px, ${y * -10}px)`;
    if (stickyTwo) stickyTwo.style.transform = `rotate(${4 + x * 4}deg) translate(${x * 18}px, ${y * 12}px)`;
    if (floatingChip) floatingChip.style.transform = `translate(${x * 18}px, ${y * 16}px)`;
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroCard.style.transform = "";
    if (stickyOne) stickyOne.style.transform = "";
    if (stickyTwo) stickyTwo.style.transform = "";
    if (floatingChip) floatingChip.style.transform = "";
  });
}

updateBackToTopButton();

// Hero CLI typing animation
const cliType = document.querySelector(".cli-type");
const cliOutputs = document.querySelectorAll(".cli-output");

function runCliAnimation() {
  if (!cliType) return;
  const text = cliType.getAttribute("data-cli-text") || "npm run build";
  let index = 0;
  cliType.textContent = "";
  cliOutputs.forEach((line) => line.classList.remove("is-visible"));

  const typeTimer = window.setInterval(() => {
    cliType.textContent += text[index] || "";
    index += 1;

    if (index > text.length) {
      window.clearInterval(typeTimer);
      cliOutputs.forEach((line, lineIndex) => {
        window.setTimeout(() => line.classList.add("is-visible"), 220 + lineIndex * 360);
      });

      window.setTimeout(runCliAnimation, 5200);
    }
  }, 58);
}

window.addEventListener("load", runCliAnimation);
