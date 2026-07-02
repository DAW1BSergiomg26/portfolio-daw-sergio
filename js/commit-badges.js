(function () {
  'use strict';

  var CACHE_KEY = 'gh-commit-cache';
  var cache = {};

  try { cache = JSON.parse(sessionStorage.getItem(CACHE_KEY)) || {}; } catch(e) {}

  function extractRepo(url) {
    var m = url.match(/github\.com\/([^\/]+\/[^\/]+?)(?:\/|$)/);
    return m ? m[1] : null;
  }

  function addBadge(card, repo) {
    var badges = card.querySelector('.project-health');
    if (!badges) return;

    var commitBadge = document.createElement('span');
    commitBadge.className = 'health-badge health-badge--commit';
    commitBadge.textContent = '...';
    badges.appendChild(commitBadge);

    var m = repo.match(/^[^\/]+\/(.+)$/);
    var repoName = m ? m[1] : repo;

    if (cache[repo]) {
      commitBadge.textContent = cache[repo];
      return;
    }

    fetch('https://api.github.com/repos/' + repo + '/commits?per_page=1', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
      .then(function (data) {
        if (data && data.length && data[0].commit) {
          var date = data[0].commit.author.date;
          var d = new Date(date);
          var now = new Date();
          var diff = Math.round((now - d) / (1000 * 60 * 60 * 24));
          var label = diff === 0 ? 'hoy' : diff + 'd';
          cache[repo] = label;
          try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch(e) {}
          commitBadge.textContent = label;
        }
      })
      .catch(function () {
        commitBadge.textContent = '-';
      });
  }

  function init() {
    document.querySelectorAll('.project-card').forEach(function (card) {
      // Find GitHub link in card
      var links = card.querySelectorAll('a');
      var ghLink = null;
      links.forEach(function (a) {
        if (a.href && a.href.indexOf('github.com') > -1 && a.href.indexOf('/releases') === -1) {
          var repo = extractRepo(a.href);
          if (repo && !ghLink) ghLink = repo;
        }
      });
      if (ghLink) addBadge(card, ghLink);
    });
  }

  // Observe for dynamically rendered cards
  var observer = new MutationObserver(function () {
    if (document.querySelectorAll('.project-card').length > 0 && !observer.disabled) {
      observer.disabled = true;
      init();
    }
  });
  observer.observe(document.getElementById('proyectos') || document.body, { childList: true, subtree: true });

  if (document.querySelector('.project-card')) init();
})();
