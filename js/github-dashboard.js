(function () {
  const GH_USER = 'DAW1BSergiomg26';
  const CACHE_KEY = 'gh-dashboard';
  const CACHE_DURATION = 30 * 60 * 1000; // 30 min

  async function fetchWithCache(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('GitHub API: ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('[GitHubDash] Error fetching:', url, e.message);
      return null;
    }
  }

  async function loadDashboard() {
    const container = document.getElementById('github-dashboard');
    if (!container) return;

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          render(container, data);
          return;
        }
      } catch {}
    }

    container.innerHTML = '<div class="gh-loading"><span class="gh-spinner"></span> Cargando actividad...</div>';

    const [user, repos] = await Promise.all([
      fetchWithCache('https://api.github.com/users/' + GH_USER),
      fetchWithCache('https://api.github.com/users/' + GH_USER + '/repos?sort=updated&per_page=6&type=public')
    ]);

    if (!user && !repos) {
      container.innerHTML = '<div class="gh-error">No se pudo cargar la actividad de GitHub.</div>';
      return;
    }

    const data = {
      user: user || { public_repos: 0, followers: 0, following: 0 },
      repos: repos || []
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    render(container, data);
  }

  function render(container, data) {
    const { user, repos } = data;
    const langMap = {};
    repos.forEach(r => {
      if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
    });
    const topLangs = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);

    container.innerHTML = `
      <div class="gh-grid">
        <div class="gh-stat-card gh-highlight">
          <div class="gh-stat-value">${user.public_repos}</div>
          <div class="gh-stat-label">Repositorios públicos</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-value">${totalStars}</div>
          <div class="gh-stat-label">Estrellas ⭐</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-value">${totalForks}</div>
          <div class="gh-stat-label">Forks 🍴</div>
        </div>
        <div class="gh-stat-card">
          <div class="gh-stat-value">${user.followers}</div>
          <div class="gh-stat-label">Seguidores</div>
        </div>
      </div>
      ${topLangs.length ? '<div class="gh-langs"><div class="gh-section-title">Lenguajes principales</div><div class="gh-lang-bars">' +
        topLangs.map(([lang, count]) => {
          const pct = Math.round((count / repos.length) * 100);
          return '<div class="gh-lang-row"><span class="gh-lang-name">' + lang + '</span><div class="gh-lang-bar"><div class="gh-lang-fill" style="width:' + pct + '%"></div></div><span class="gh-lang-pct">' + pct + '%</span></div>';
        }).join('') + '</div></div>' : ''}
      <div class="gh-repos">
        <div class="gh-section-title">Repositorios recientes</div>
        ${repos.slice(0, 4).map(r => {
          const desc = (r.description || '').slice(0, 80);
          return '<a href="' + r.html_url + '" target="_blank" rel="noopener noreferrer" class="gh-repo-card"><div class="gh-repo-name"><svg class="icon" aria-hidden="true" style="width:1em;height:1em;flex-shrink:0"><use href="icons.svg#icon-github"></use></svg> ' + r.name + '</div>' +
            (desc ? '<div class="gh-repo-desc">' + desc + '</div>' : '') +
            '<div class="gh-repo-meta">' +
            (r.language ? '<span class="gh-repo-lang" style="--gh-lang:' + getLangColor(r.language) + '">' + r.language + '</span>' : '') +
            '<span>⭐ ' + (r.stargazers_count || 0) + '</span>' +
            '<span>🍴 ' + (r.forks_count || 0) + '</span>' +
            '<span>' + timeAgo(new Date(r.updated_at)) + '</span>' +
            '</div></a>';
        }).join('')}
      </div>
    `;
  }

  function getLangColor(lang) {
    const colors = {
      JavaScript: '#f1e05a', HTML: '#e34c26', CSS: '#563d7c',
      Python: '#3572A5', Java: '#b07219', TypeScript: '#3178c6',
      PHP: '#4F5D95', Shell: '#89e051', Ruby: '#701516'
    };
    return colors[lang] || '#8b8b8b';
  }

  function timeAgo(date) {
    const sec = Math.floor((Date.now() - date) / 1000);
    if (sec < 60) return 'ahora';
    const min = Math.floor(sec / 60);
    if (min < 60) return 'hace ' + min + 'm';
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return 'hace ' + hrs + 'h';
    const days = Math.floor(hrs / 24);
    if (days < 30) return 'hace ' + days + 'd';
    return 'hace ' + Math.floor(days / 30) + 'mes';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDashboard);
  } else {
    loadDashboard();
  }
})();
