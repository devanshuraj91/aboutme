const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const body = document.body;
const root = document.documentElement;
const themePicker = $('.theme-picker');
const themeToggle = $('.theme-toggle');
const themeMenu = $('.theme-menu');
const themeMeta = $('meta[name="theme-color"]');
const terminalOutput = $('.terminal-output');
const terminalInput = $('.terminal-input');
const palette = $('#command-palette');
const paletteInput = $('#command-input');
const bootOverlay = $('#boot-overlay');

const themes = {
  light: { label: 'Daylight', icon: '☼', meta: '#f3efe9', vars: {'--bg':'#f3efe9','--surface':'#fff','--surface-alt':'#f6f1eb','--text':'#0e1724','--muted':'#58677a','--line':'rgba(15,23,42,.12)','--accent':'#ff7a59','--accent-strong':'#ff8f6f','--success':'#1bbf94','--warning':'#f5b942','--code-bg':'#0f172a'} },
  dark: { label: 'Midnight', icon: '☾', meta: '#0b1020', vars: {'--bg':'#0b1020','--surface':'#101a2d','--surface-alt':'#0d1426','--text':'#edf2ff','--muted':'#9aa6c9','--line':'rgba(154,166,201,.2)','--accent':'#8b7cff','--accent-strong':'#b6a6ff','--success':'#66f0c2','--warning':'#ffce6d','--code-bg':'#070b14'} },
  coder: { label: 'Coder Mode', icon: '</>', meta: '#101226', vars: {'--bg':'#101226','--surface':'#171a38','--surface-alt':'#111a2d','--text':'#eef0ff','--muted':'#aab1d5','--line':'rgba(173,180,255,.2)','--accent':'#8b7cff','--accent-strong':'#b6a6ff','--success':'#55e6c1','--warning':'#ffc86b','--code-bg':'#080b1b'} },
  hacker: { label: 'Ethical Hacker', icon: '⌁', meta: '#071009', vars: {'--bg':'#071009','--surface':'#0c1a12','--surface-alt':'#091a0f','--text':'#e6ffe3','--muted':'#96bb9d','--line':'rgba(120,255,140,.2)','--accent':'#9cff57','--accent-strong':'#b9ff7a','--success':'#7af5ab','--warning':'#ffd26e','--code-bg':'#030804'} },
  cyber: { label: 'Cyber Lime', icon: '◆', meta: '#101510', vars: {'--bg':'#101510','--surface':'#172018','--surface-alt':'#131d18','--text':'#e5f6ce','--muted':'#9ab28c','--line':'rgba(177,214,86,.2)','--accent':'#b7f34a','--accent-strong':'#d8ff71','--success':'#bbff85','--warning':'#ffd86c','--code-bg':'#071007'} },
  sunset: { label: 'Sunset', icon: '◒', meta: '#25181b', vars: {'--bg':'#25181b','--surface':'#352124','--surface-alt':'#2b1d20','--text':'#fff0df','--muted':'#d2a5a0','--line':'rgba(255,136,102,.2)','--accent':'#ff8666','--accent-strong':'#ffb07e','--success':'#ffd870','--warning':'#ffb364','--code-bg':'#1b1013'} },
  ocean: { label: 'Ocean', icon: '◓', meta: '#eaf5f4', vars: {'--bg':'#eaf5f4','--surface':'#f8fffe','--surface-alt':'#edf8f6','--text':'#112b35','--muted':'#597a80','--line':'rgba(8,127,140,.18)','--accent':'#087f8c','--accent-strong':'#0a9aac','--success':'#47c8a7','--warning':'#ffc96b','--code-bg':'#102b35'} }
};

function applyTheme(name, persist = true) {
  const key = themes[name] ? name : 'coder';
  const theme = themes[key];
  Object.entries(theme.vars).forEach(([property, value]) => root.style.setProperty(property, value));
  root.dataset.theme = key;
  body.dataset.theme = key;
  if (themeMeta) themeMeta.content = theme.meta;
  if (themeToggle) {
    themeToggle.textContent = theme.icon;
    themeToggle.title = `Theme: ${theme.label}`;
    themeToggle.setAttribute('aria-label', `Theme: ${theme.label}. Open theme picker`);
  }
  $$('.theme-menu [data-theme]').forEach((button) => button.classList.toggle('active', button.dataset.theme === key));
  if (persist) localStorage.setItem('portfolio-theme', key);
}

function initThemes() {
  // Delegation avoids stale listeners and works after any menu re-render.
  themeMenu?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-theme]');
    if (!button) return;
    applyTheme(button.dataset.theme);
    themePicker.classList.remove('open');
    themeToggle?.setAttribute('aria-expanded', 'false');
  });
  themeToggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = themePicker.classList.toggle('open');
    themeToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    if (themePicker && !themePicker.contains(event.target)) {
      themePicker.classList.remove('open');
      themeToggle?.setAttribute('aria-expanded', 'false');
    }
  });
  const saved = localStorage.getItem('portfolio-theme');
  applyTheme(saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'hacker' : 'coder'), false);
}

function writeLine(text, className = '') {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  line.textContent = text;
  if (className) line.className = className;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!command) return;
  if (command === 'clear') { terminalOutput.innerHTML = ''; return; }
  if (command.startsWith('theme ')) {
    const name = command.slice(6);
    if (themes[name]) { applyTheme(name); writeLine(`Theme changed to ${themes[name].label}.`, 'success'); }
    else writeLine('Unknown theme. Try: coder, hacker, dark, light, cyber, sunset, ocean.');
    return;
  }
  const responses = {
    help: ['Commands: help, whoami, about, skills, projects, contact, theme <name>, matrix, sudo, clear.'],
    whoami: ['devanshu_raj — student developer and cybersecurity learner.'],
    about: ['I build software, explore systems, and learn security responsibly.'],
    skills: ['Python • Flask • JavaScript • C/C++ • Linux • AI/ML • Cybersecurity • Git'],
    projects: ['Local AI Tools | Cyber Lab Research | Portfolio + Web Experiments'],
    contact: ['Email: devanshuraj2891@gmail.com | GitHub: github.com/devanshuraj91'],
    sudo: ['Nice try. This portfolio runs in user mode.'],
    matrix: ['Matrix visuals are already active in the background.']
  };
  if (responses[command]) { writeLine(`$ ${command}`); responses[command].forEach((line) => writeLine(line, command === 'matrix' ? 'success' : '')); return; }
  writeLine(`$ ${command}`); writeLine('Command not found. Type help for available commands.');
}

function initTerminal() {
  terminalInput?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    runCommand(terminalInput.value);
    terminalInput.value = '';
  });
}

function initPalette() {
  if (!palette || !paletteInput) return;
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement?.tagName !== 'INPUT') { event.preventDefault(); palette.classList.remove('hidden'); paletteInput.focus(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette.classList.toggle('hidden'); if (!palette.classList.contains('hidden')) paletteInput.focus(); }
    if (event.key === 'Escape') { palette.classList.add('hidden'); paletteInput.value = ''; }
  });
  paletteInput.addEventListener('keydown', (event) => { if (event.key === 'Enter') { runCommand(paletteInput.value); paletteInput.value = ''; palette.classList.add('hidden'); } });
  palette.addEventListener('click', (event) => { const button = event.target.closest('[data-command]'); if (button) { runCommand(button.dataset.command); palette.classList.add('hidden'); } });
}

function initReveal() {
  const elements = $$('.reveal');
  if (!('IntersectionObserver' in window)) { elements.forEach((element) => element.classList.add('visible')); return; }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 });
  elements.forEach((element) => observer.observe(element));
}

function initBackground() {
  const layer = $('.matrix-background');
  if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\{}[]#*+@';
  for (let i = 0; i < 80; i += 1) { const span = document.createElement('span'); span.textContent = chars[Math.floor(Math.random() * chars.length)]; span.style.left = `${Math.random() * 100}%`; span.style.top = `${Math.random() * 100}%`; span.style.setProperty('--delay', `${Math.random() * 8}s`); layer.appendChild(span); }
}

function init() {
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
  initThemes(); initTerminal(); initPalette(); initReveal(); initBackground();
  window.addEventListener('pointermove', (event) => { const glow = $('.cursor-glow'); if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; } }, { passive: true });
  setTimeout(() => bootOverlay?.classList.add('hidden'), 1800);
}
init();
