let currentLang = localStorage.getItem('lang') || 'es';
let translations = {};

async function loadTranslations() {
  try {
    const res = await fetch('data/lang.json?v=3.11.1');
    translations = await res.json();
    updateLangButtons();
    applyTranslations();
  } catch (e) {
    console.error('[CV] Error loading translations:', e);
  }
}

function t(key) {
  return translations[currentLang]?.[key] || translations['es']?.[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    if (text) el.textContent = text;
  });
  document.querySelectorAll('[data-i18n-att]').forEach(el => {
    const [attr, key] = el.getAttribute('data-i18n-att').split('|');
    const text = t(key);
    if (text && attr) el.setAttribute(attr, text);
  });
  document.documentElement.lang = currentLang;
  document.title = t('cv_page_title');
}

function updateLangButtons() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
  });
}

function setCvLanguage(lang) {
  if (!['es', 'en'].includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('lang', currentLang);
  updateLangButtons();
  applyTranslations();
}

window.setCvLanguage = setCvLanguage;

loadTranslations();
