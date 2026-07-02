(function () {
  'use strict';

  const COMMANDS = {
    help: { desc: 'Muestra esta ayuda', desc_en: 'Show this help', fn: cmdHelp },
    ls: { desc: 'Lista las secciones', desc_en: 'List sections', fn: cmdLs },
    cd: { desc: 'Navega a una sección (ej: cd proyectos)', desc_en: 'Navigate to a section (e.g. cd projects)', fn: cmdCd },
    'cat README.md': { desc: 'Muestra el README', desc_en: 'Show README', fn: cmdCat },
    whoami: { desc: 'Muestra quién soy', desc_en: 'Show who I am', fn: cmdWhoami },
    skills: { desc: 'Lista tecnologías', desc_en: 'List technologies', fn: cmdSkills },
    projects: { desc: 'Lista proyectos (ej: projects 3)', desc_en: 'List projects (e.g. projects 3)', fn: cmdProjects },
    theme: { desc: 'Cambia entre tema dark/light', desc_en: 'Toggle dark/light theme', fn: cmdTheme },
    social: { desc: 'Muestra redes sociales', desc_en: 'Show social links', fn: cmdSocial },
    date: { desc: 'Fecha y hora actual', desc_en: 'Current date and time', fn: cmdDate },
    clear: { desc: 'Limpia la terminal', desc_en: 'Clear terminal', fn: cmdClear },
    exit: { desc: 'Cierra la terminal', desc_en: 'Exit terminal', fn: cmdExit },
    zen: { desc: 'Activa/desactiva Modo Zen', desc_en: 'Toggle Zen Mode', fn: cmdZen }
  };

  let terminalEl = null;
  let outputEl = null;
  let inputEl = null;
  let history = [];
  let historyIdx = -1;
  let isEn = false;

  function getLang() {
    return localStorage.getItem('lang') || 'es';
  }

  function t(key) { return isEn ? key : key; }

  function init() {
    const wrapper = document.getElementById('terminal-wrapper');
    if (!wrapper || wrapper.dataset.term) return;
    wrapper.dataset.term = '1';
    isEn = getLang() === 'en';

    terminalEl = document.createElement('div');
    terminalEl.className = 'terminal';
    terminalEl.innerHTML = `
      <div class="term-header">
        <span class="term-dot red"></span>
        <span class="term-dot yellow"></span>
        <span class="term-dot green"></span>
        <span class="term-title">${isEn ? 'Terminal — portfolio@daw' : 'Terminal — portfolio@daw'}</span>
      </div>
      <div class="term-body">
        <div class="term-output" tabindex="-1"></div>
        <div class="term-input-line">
          <span class="term-prompt">visitor@portfolio:~$</span>
          <input type="text" class="term-input" spellcheck="false" autocomplete="off">
        </div>
      </div>
    `;

    wrapper.appendChild(terminalEl);
    outputEl = terminalEl.querySelector('.term-output');
    inputEl = terminalEl.querySelector('.term-input');

    inputEl.addEventListener('keydown', onKey);
    terminalEl.addEventListener('click', () => inputEl.focus());

    welcome();
  }

  function welcome() {
    print('');
    print('  ╔══════════════════════════════════════════╗');
    print('  ║     Portfolio DAW — Terminal v1.0       ║');
    print('  ║  Type "help" to see available commands   ║');
    print('  ╚══════════════════════════════════════════╝');
    print('');
    document.addEventListener('languagechange', () => {
      isEn = getLang() === 'en';
    });
  }

  function onKey(e) {
    if (e.key === 'Enter') {
      const cmd = inputEl.value.trim();
      history.push(cmd);
      historyIdx = history.length;
      execute(cmd);
      inputEl.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        inputEl.value = history[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        inputEl.value = history[historyIdx];
      } else {
        historyIdx = history.length;
        inputEl.value = '';
      }
    }
  }

  function execute(raw) {
    printPrompt(raw);
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (!raw) return;

    if (cmd === 'cat' && args[0] === 'README.md') {
      cmdCat();
    } else if (cmd === 'cd') {
      cmdCd(args);
    } else if (cmd === 'projects') {
      cmdProjects(args);
    } else if (COMMANDS[cmd]) {
      COMMANDS[cmd].fn(args);
    } else if (typeof window.__runDevCommand === 'function') {
      const devMsg = window.__runDevCommand(cmd);
      if (devMsg) print(`  ${devMsg}`);
      else print(`  bash: ${cmd}: ${isEn ? 'command not found' : 'comando no encontrado'}`);
    } else {
      print(`  bash: ${cmd}: ${isEn ? 'command not found' : 'comando no encontrado'}`);
    }
  }

  function print(text) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printHTML(html) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = html;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function printPrompt(cmd) {
    const line = document.createElement('div');
    line.className = 'term-line term-line-cmd';
    line.innerHTML = `<span class="term-prompt">visitor@portfolio:~$</span> <span class="term-cmd">${escHtml(cmd)}</span>`;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  function escHtml(s) {
    return String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] || c);
  }

  function cmdHelp() {
    const cn = isEn ? [
      '  Available commands:',
      '',
      '  ls              List sections',
      '  cd &lt;section&gt;  Navigate to a section',
      '  cat README.md   Show about me',
      '  whoami          Who I am',
      '  skills          List technologies',
      '  projects [n]    List N projects',
      '  theme           Toggle dark/light mode',
      '  social          Show social links',
      '  date            Current date & time',
      '  clear           Clear terminal',
      '  exit            Close terminal',
      '  help            Show this help'
    ] : [
      '  Comandos disponibles:',
      '',
      '  ls              Lista secciones',
      '  cd &lt;seccion&gt;   Navega a una sección',
      '  cat README.md   Muestra sobre mí',
      '  whoami          Quién soy',
      '  skills          Lista tecnologías',
      '  projects [n]    Lista N proyectos',
      '  theme           Cambia tema dark/light',
      '  social          Muestra redes sociales',
      '  date            Fecha y hora actual',
      '  clear           Limpia la terminal',
      '  exit            Cierra la terminal',
      '  help            Muestra esta ayuda'
    ];
    cn.forEach(l => print(l));
  }

  function cmdLs() {
    const sections = isEn
      ? ['about', 'technologies', 'github/', 'projects/', 'blog/', 'route/', 'contact']
      : ['sobre-mi', 'tecnologias', 'github/', 'proyectos/', 'blog/', 'ruta/', 'contacto'];
    print('  ' + sections.join('    '));
  }

  function cmdCd(args) {
    if (!args.length) {
      print(`  cd: ${isEn ? 'missing argument' : 'falta argumento'}`);
      return;
    }
    const map = isEn
      ? { about: 'sobre-mi', technologies: 'tecnologias', projects: 'proyectos', blog: 'blog', route: 'ruta', contact: 'contacto', github: 'github' }
      : { 'sobre-mi': 'sobre-mi', tecnologias: 'tecnologias', proyectos: 'proyectos', blog: 'blog', ruta: 'ruta', contacto: 'contacto', github: 'github' };
    const target = map[args[0]];
    if (target) {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        print(`  ${isEn ? 'Navigating to' : 'Navegando a'} "${args[0]}"...`);
      }
    } else {
      print(`  cd: ${args[0]}: ${isEn ? 'No such section' : 'No existe la sección'}`);
    }
  }

  function cmdCat() {
    const text = isEn
      ? `  Sergio Daniel Martínez Gómez — DAW Student
  
  I am a Web Development student creating this portfolio 
  to document my evolution: from simple exercises to 
  complete projects published on GitHub Pages.
  
  My goal is to learn the fundamentals well, practice 
  consistently, and build work I can confidently defend.`
      : `  Sergio Daniel Martínez Gómez — Alumno DAW
  
  Soy alumno de Desarrollo de Aplicaciones Web creando 
  este portfolio para documentar mi evolución: desde 
  ejercicios sencillos hasta proyectos completos 
  publicados en GitHub Pages.
  
  Mi objetivo es aprender bien la base, practicar mucho 
  y crear trabajos que pueda defender con claridad.`;
    print(text);
  }

  function cmdWhoami() {
    print('  Sergio Daniel Martínez Gómez');
    print(`  ${isEn ? 'DAW Student · Web Developer · GitHub Pages' : 'Alumno DAW · Desarrollo Web · GitHub Pages'}`);
  }

  function cmdSkills() {
    const skills = ['HTML5', 'CSS3', 'JavaScript', 'JSON', 'Git', 'GitHub', 'GitHub Pages', 'Responsive Design', 'SEO', 'Python', 'SQL'];
    print(`  ${skills.join('  •  ')}`);
  }

  function cmdProjects(args) {
    const limit = parseInt(args[0], 10) || 5;
    fetch(`data/projects.json?v=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.priority - b.priority).slice(0, limit);
        sorted.forEach(p => {
          const title = isEn && p.title_en ? p.title_en : p.title;
          const ver = p.version || '';
          printHTML(`  <span class="term-accent">${escHtml(title)}</span>  <span class="term-muted">${escHtml(ver)}</span>`);
        });
      })
      .catch(() => print(`  ${isEn ? 'Error loading projects' : 'Error al cargar proyectos'}`));
  }

  function cmdZen() {
    if (typeof window.toggleZen === 'function') {
      window.toggleZen();
      const active = document.documentElement.classList.contains('zen-mode');
      print(`  ${isEn ? (active ? 'Zen Mode activated' : 'Zen Mode deactivated') : (active ? 'Modo Zen activado' : 'Modo Zen desactivado')}`);
      print(`  ${isEn ? 'Only essential sections are shown.' : 'Solo se muestran las secciones esenciales.'}`);
    } else {
      print(`  ${isEn ? 'Zen Mode not available' : 'Modo Zen no disponible'}`);
    }
  }

  function cmdTheme() {
    if (typeof window.toggleTheme === 'function') {
      window.toggleTheme();
      const current = document.documentElement.getAttribute('data-theme');
      print(`  ${isEn ? 'Theme changed to' : 'Tema cambiado a'}: ${current}`);
    }
  }

  function cmdSocial() {
    if (isEn) {
      printHTML('  GitHub:   <a href="https://github.com/DAW1BSergiomg26" target="_blank" class="term-link">github.com/DAW1BSergiomg26</a>');
      printHTML('  LinkedIn: <a href="https://linkedin.com/in/sergiodanielmg" target="_blank" class="term-link">linkedin.com/in/sergiodanielmg</a>');
      printHTML('  Email:    <a href="mailto:menu2informatico@gmail.com" class="term-link">menu2informatico@gmail.com</a>');
    } else {
      printHTML('  GitHub:   <a href="https://github.com/DAW1BSergiomg26" target="_blank" class="term-link">github.com/DAW1BSergiomg26</a>');
      printHTML('  LinkedIn: <a href="https://linkedin.com/in/sergiodanielmg" target="_blank" class="term-link">linkedin.com/in/sergiodanielmg</a>');
      printHTML('  Email:    <a href="mailto:menu2informatico@gmail.com" class="term-link">menu2informatico@gmail.com</a>');
    }
  }

  function cmdDate() {
    print(`  ${new Date().toLocaleString(isEn ? 'en-US' : 'es-ES')}`);
  }

  function cmdClear() {
    outputEl.innerHTML = '';
  }

  function cmdExit() {
    closeTerminal();
  }

  function openTerminal() {
    const wrapper = document.getElementById('terminal-wrapper');
    if (!wrapper) return;
    const content = document.getElementById('hero-content');
    if (content) content.style.display = 'none';
    wrapper.hidden = false;
    init();
    setTimeout(() => {
      if (inputEl) inputEl.focus();
    }, 100);
  }

  function closeTerminal() {
    const wrapper = document.getElementById('terminal-wrapper');
    if (!wrapper) return;
    wrapper.hidden = true;
    const content = document.getElementById('hero-content');
    if (content) content.style.display = '';
    if (terminalEl) {
      terminalEl.remove();
      terminalEl = null;
      outputEl = null;
      inputEl = null;
    }
    if (wrapper.dataset) delete wrapper.dataset.term;
  }

  window.openTerminal = openTerminal;
  window.closeTerminal = closeTerminal;

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('terminal-toggle');
    if (btn) btn.addEventListener('click', openTerminal);
  });
})();
