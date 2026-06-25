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

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectCounter = document.querySelector(".project-counter");

function getProjectCategories(card) {
  const text = card.textContent.toLowerCase();
  const categories = ["todos"];

  if (text.includes("publicado") || text.includes("v1.0.0")) categories.push("publicados");
  if (text.includes("web") || text.includes("html") || text.includes("css") || text.includes("frontend") || text.includes("landing")) categories.push("web");
  if (text.includes("javascript") || text.includes("dom") || text.includes("juego") || text.includes("localstorage")) categories.push("javascript");
  if (text.includes("python")) categories.push("python");
  if (text.includes("bbdd") || text.includes("sql") || text.includes("base de datos")) categories.push("bbdd");
  if (text.includes("grupo") || text.includes("intermodular") || text.includes("auri") || text.includes("naranco")) categories.push("grupo");
  if (text.includes("religioso") || text.includes("devocional") || text.includes("divina") || text.includes("misericordia")) categories.push("religioso");
  if (text.includes("app") || text.includes("aplicación") || text.includes("webapp")) categories.push("apps");

  return categories;
}

function updateProjectCounter(visibleCount) {
  if (!projectCounter) return;

  const total = projectCards.length;
  projectCounter.textContent = `${visibleCount} de ${total} proyectos visibles`;
}

function filterProjects(category) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = getProjectCategories(card);
    const isVisible = category === "todos" || categories.includes(category);

    card.classList.toggle("is-hidden", !isVisible);

    if (isVisible) {
      visibleCount += 1;
    }
  });

  updateProjectCounter(visibleCount);
}

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter || "todos";

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      filterProjects(category);
    });
  });

  filterProjects("todos");
}

window.addEventListener("scroll", markActiveSection, { passive: true });
window.addEventListener("hashchange", markActiveSection);
markActiveSection();
