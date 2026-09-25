const year = document.querySelector('#year');
const themeToggle = document.querySelector('.theme-toggle');
const themePicker = document.querySelector('.theme-picker');
const themeMenu = document.querySelector('.theme-menu');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const themes = {
  light: { label: 'Daylight', icon: '☼', meta: '#f4f1eb', vars: { '--bg': '#f4f1eb', '--surface': '#fffdf8', '--text': '#17201d', '--muted': '#68736d', '--line': '#d6d8cf', '--accent': '#d75a3e', '--accent-dark': '#ad3e28', '--lime': '#d7ec69', '--code-bg': '#1b2522' } },
  dark: { label: 'Midnight', icon: '☾', meta: '#111816', vars: { '--bg': '#111816', '--surface': '#1d2925', '--text': '#eff2e9', '--muted': '#9ca9a1', '--line': '#3a4741', '--accent': '#ef795b', '--accent-dark': '#ef795b', '--lime': '#b8d747', '--code-bg': '#0a0f0e' } },
  coder: { label: 'Coder Mode', icon: '</>', meta: '#101226', vars: { '--bg': '#101226', '--surface': '#171a38', '--text': '#eef0ff', '--muted': '#9aa2c7', '--line': '#343b68', '--accent': '#8b7cff', '--accent-dark': '#b7aaff', '--lime': '#55e6c1', '--code-bg': '#080a18' } },
  hacker: { label: 'Ethical Hacker', icon: '⌁', meta: '#071009', vars: { '--bg': '#071009', '--surface': '#0d1b12', '--text': '#dfffd1', '--muted': '#7da47a', '--line': '#24452b', '--accent': '#9cff57', '--accent-dark': '#75d83d', '--lime': '#d7ff70', '--code-bg': '#030804' } },
  cyber: { label: 'Cyber Lime', icon: '◆', meta: '#101510', vars: { '--bg': '#101510', '--surface': '#172018', '--text': '#e5f6ce', '--muted': '#9ab28c', '--line': '#344832', '--accent': '#b7f34a', '--accent-dark': '#8bbb24', '--lime': '#ecff73', '--code-bg': '#071007' } },
  sunset: { label: 'Sunset', icon: '◒', meta: '#25181b', vars: { '--bg': '#25181b', '--surface': '#352124', '--text': '#fff0df', '--muted': '#cda79b', '--line': '#684047', '--accent': '#ff8666', '--accent-dark': '#ffad70', '--lime': '#ffd06b', '--code-bg': '#1b1013' } },
  ocean: { label: 'Ocean', icon: '◓', meta: '#eaf5f4', vars: { '--bg': '#eaf5f4', '--surface': '#f8fffe', '--text': '#102b35', '--muted': '#5e7c82', '--line': '#c3dcda', '--accent': '#087f8c', '--accent-dark': '#05606a', '--lime': '#8dd9ca', '--code-bg': '#102b35' } }
};

if (year) year.textContent = new Date().getFullYear();

function renderThemeOptions() {
  if (!themeMenu) return;
  themeMenu.innerHTML = Object.entries(themes).map(([name, theme]) => `
    <button type="button" data-theme="${name}" role="menuitem" aria-label="Use ${theme.label} theme">
      <i style="background:${theme.vars['--accent']}"></i>${theme.label}
    </button>`).join('');
}

function applyTheme(name, save = true) {
  const selected = themes[name] ? name : 'light';
  const theme = themes[selected];
  Object.entries(theme.vars).forEach(([property, value]) => document.documentElement.style.setProperty(property, value));
  document.documentElement.dataset.theme = selected;
  document.body.dataset.theme = selected;
  if (themeToggle) {
    themeToggle.textContent = theme.icon;
    themeToggle.setAttribute('aria-label', `Current theme: ${theme.label}. Open theme picker`);
  }
  if (themeMeta) themeMeta.setAttribute('content', theme.meta);
  themeMenu?.querySelectorAll('[data-theme]').forEach((button) => button.classList.toggle('active', button.dataset.theme === selected));
  if (save) localStorage.setItem('theme', selected);
}

renderThemeOptions();
const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme || (prefersDark.matches ? 'dark' : 'light'), false);

themeToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = themePicker?.classList.toggle('open') || false;
  themeToggle.setAttribute('aria-expanded', String(open));
});

themeMenu?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-theme]');
  if (!button) return;
  applyTheme(button.dataset.theme);
  themePicker.classList.remove('open');
  themeToggle?.setAttribute('aria-expanded', 'false');
});

document.addEventListener('click', (event) => {
  if (themePicker && !themePicker.contains(event.target)) {
    themePicker.classList.remove('open');
    themeToggle?.setAttribute('aria-expanded', 'false');
  }
});

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; }
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
