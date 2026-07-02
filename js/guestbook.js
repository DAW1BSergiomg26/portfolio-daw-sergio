(function () {
  'use strict';

  var OWNER = 'DAW1BSergiomg26';
  var REPO = 'portfolio-daw-sergio';
  var LABEL = 'guestbook';
  var TOKEN = ''; // Set your GitHub token here to enable submissions

  var container = document.getElementById('guestbook-container');
  if (!container) return;

  var listEl = container.querySelector('.guestbook-list');
  var formEl = container.querySelector('.guestbook-form');
  var countEl = container.querySelector('.guestbook-count');
  var statusEl = container.querySelector('.guestbook-status');

  var entries = [];

  function t(key) {
    var lang = document.documentElement.lang || 'es';
    // fallback: use data-i18n-msg attributes on elements
    return key;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString(document.documentElement.lang === 'en' ? 'en-GB' : 'es-ES', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function escape(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderEntries() {
    listEl.innerHTML = '';
    if (entries.length === 0) {
      var emptyMsg = document.documentElement.lang === 'en'
        ? 'No messages yet. Be the first!'
        : 'Todavia no hay mensajes. Se el primero!';
      listEl.innerHTML = '<p class="guestbook-empty">' + emptyMsg + '</p>';
      return;
    }

    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var card = document.createElement('article');
      card.className = 'guestbook-entry';

      var avatar = e.user && e.user.avatar_url
        ? '<img class="guestbook-avatar" src="' + escape(e.user.avatar_url) + '" alt="" width="36" height="36" loading="lazy">'
        : '<div class="guestbook-avatar guestbook-avatar--fallback">' + escape((e.title || '?')[0].toUpperCase()) + '</div>';

      card.innerHTML =
        '<div class="guestbook-entry-head">' +
          avatar +
          '<div class="guestbook-entry-meta">' +
            '<strong class="guestbook-name">' + escape(e.title) + '</strong>' +
            '<time class="guestbook-date">' + formatDate(e.created_at) + '</time>' +
          '</div>' +
        '</div>' +
        '<div class="guestbook-entry-body">' + escape(e.body || '') + '</div>';

      listEl.appendChild(card);
    }
  }

  function updateCount() {
    if (!countEl) return;
    var lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    var text = lang === 'en'
      ? entries.length + ' message' + (entries.length !== 1 ? 's' : '')
      : entries.length + ' mensaje' + (entries.length !== 1 ? 's' : '');
    countEl.textContent = text;
  }

  function fetchEntries() {
    listEl.innerHTML = '<p class="guestbook-empty">' +
      (document.documentElement.lang === 'en' ? 'Loading...' : 'Cargando...') + '</p>';

    var url = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/issues?labels=' + LABEL +
      '&state=all&sort=created&direction=desc&per_page=50';

    fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        entries = data.filter(function (issue) {
          return issue.labels.some(function (l) { return l.name === LABEL; });
        });
        renderEntries();
        updateCount();
      })
      .catch(function (err) {
        listEl.innerHTML = '<p class="guestbook-empty guestbook-error">' +
          (document.documentElement.lang === 'en'
            ? 'Could not load messages.'
            : 'No se pudieron cargar los mensajes.') + '</p>';
        console.warn('[Guestbook] fetch error:', err);
      });
  }

  function submitEntry(name, message) {
    if (!TOKEN) {
      setStatus(document.documentElement.lang === 'en'
        ? 'Submission not available. Configure GitHub token in guestbook.js'
        : 'Envio no disponible. Configura el token de GitHub en guestbook.js', 'error');
      return Promise.reject(new Error('No token'));
    }

    setStatus(document.documentElement.lang === 'en' ? 'Sending...' : 'Enviando...', 'sending');
    var btn = formEl.querySelector('.guestbook-submit');
    if (btn) btn.disabled = true;

    return fetch('https://api.github.com/repos/' + OWNER + '/' + REPO + '/issues', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': 'Bearer ' + TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: name,
        body: message + '\n\n---\n_enviado desde el portfolio DAW_',
        labels: [LABEL]
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (issue) {
        // Prepend to local list
        entries.unshift({
          title: issue.title,
          body: issue.body,
          created_at: issue.created_at,
          user: issue.user
        });
        renderEntries();
        updateCount();

        setStatus(document.documentElement.lang === 'en'
          ? 'Message sent!'
          : 'Mensaje enviado!', 'success');
        formEl.reset();

        if (btn) btn.disabled = false;
      })
      .catch(function (err) {
        setStatus(document.documentElement.lang === 'en'
          ? 'Error sending message. Try again later.'
          : 'Error al enviar. Intentalo de nuevo.', 'error');
        console.warn('[Guestbook] submit error:', err);
        if (btn) btn.disabled = false;
      });
  }

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'guestbook-status';
    if (type) statusEl.classList.add('guestbook-status--' + type);
  }

  // Form handler
  if (formEl) {
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = formEl.querySelector('[name="gb-name"]');
      var msgInput = formEl.querySelector('[name="gb-message"]');
      if (!nameInput || !msgInput) return;

      var name = nameInput.value.trim();
      var message = msgInput.value.trim();

      if (!name || !message) {
        setStatus(document.documentElement.lang === 'en'
          ? 'Please fill in all fields.'
          : 'Completa todos los campos.', 'error');
        return;
      }

      submitEntry(name, message);
    });
  }

  // Init
  fetchEntries();
})();
