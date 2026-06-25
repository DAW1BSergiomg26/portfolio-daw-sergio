const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

function markActiveSection() {
  let currentId = "inicio";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    link.classList.toggle("active-link", href === `#${currentId}`);
  });
}

const revealItems = document.querySelectorAll(".reveal");

function showRevealItem(item) {
  item.classList.add("is-visible");
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showRevealItem(entry.target);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Fallback defensivo: evita espacios vacíos si el navegador salta a un ancla
  // antes de que IntersectionObserver pinte las secciones.
  window.setTimeout(() => {
    revealItems.forEach(showRevealItem);
  }, 350);
} else {
  revealItems.forEach(showRevealItem);
}

window.addEventListener("scroll", markActiveSection, { passive: true });
window.addEventListener("hashchange", markActiveSection);
markActiveSection();
