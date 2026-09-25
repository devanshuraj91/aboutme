const year = document.querySelector('#year');
const themeToggle = document.querySelector('.theme-toggle');
const themePicker = document.querySelector('.theme-picker');
const themeMenu = document.querySelector('.theme-menu');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

const themes = {
  light: {
    label: 'Daylight', icon: '☼', color: '#d75a3e', meta: '#f4f1eb',
    vars: { '--bg': '#f4f1eb', '--surface': '#fffdf8', '--text': '#17201d', '--muted': '#68736d', '--line': '#d6d8cf', '--accent': '#d75a3e', '--accent-dark': '#ad3e28', '--lime': '#d7ec69', '--code-bg': '#1b2522' }
  },
  dark: {
    label: 'Midnight', icon: '☾', color: '#ef795b', meta: '#111816',
    vars: { '--bg': '#111816', '--surface': '#1d2925', '--text': '#eff2e9', '--muted': '#9ca9a1', '--line': '#3a4741', '--accent': '#ef795b', '--accent-dark': '#ef795b', '--lime': '#b8d747', '--code-bg': '#0a0f0e' }
  },
  coder: {
    label: 'Coder Mode', icon: '</>', color: '#8b7cff', meta: '#101226',
    vars: { '--bg': '#101226', '--surface': '#171a38', '--text': '#eef0ff', '--muted': '#9aa2c7', '--line': '#343b68', '--accent': '#8b7cff', '--accent-dark': '#b7aaff', '--lime': '#55e6c1', '--code-bg': '#080a18' }
  },
  hacker: {
    label: 'Ethical Hacker', icon: '⌁', color: '#9cff57', meta: '#071009',
    vars: { '--bg': '#071009', '--surface': '#0d1b12', '--text': '#dfffd1', '--muted': '#7da47a', '--line': '#24452b', '--accent': '#9cff57', '--accent-dark': '#75d83d', '--lime': '#d7ff70', '--code-bg': '#030804' }
  },
  cyber: {
    label: 'Cyber Lime', icon: '◆', color: '#b7f34a', meta: '#101510',
    vars: { '--bg': '#101510', '--surface': '#172018', '--text': '#e5f6ce', '--muted': '#9ab28c', '--line': '#344832', '--accent': '#b7f34a', '--accent-dark': '#8bbb24', '--lime': '#ecff73', '--code-bg': '#071007' }
  },
  sunset: {
    label: 'Sunset', icon: '◒', color: '#ff8666', meta: '#25181b',
    vars: { '--bg': '#25181b', '--surface': '#352124', '--text': '#fff0df', '--muted': '#cda79b', '--line': '#684047', '--accent': '#ff8666', '--accent-dark': '#ffad70', '--lime': '#ffd06b', '--code-bg': '#1b1013' }
  },
  ocean: {
    label: 'Ocean', icon: '◓', color: '#087f8c', meta: '#eaf5f4',
    vars: { '--bg': '#eaf5f4', '--surface': '#f8fffe', '--text': '#102b35', '--muted': '#5e7c82', '--line': '#c3dcda', '--accent': '#087f8c', '--accent-dark': '#05606a', '--lime': '#8dd9ca', '--code-bg': '#102b35' }
  }
};

if (year) year.textContent = new Date().getFullYear();

// Add the specialist themes even if an older index.html is cached.
const specialistThemes = ['coder', 'hacker'];
if (themeMenu) {
  specialistThemes.forEach((name) => {
    if (themeMenu.querySelector(`[data-theme="${name}"]`)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.theme = name;
    button.setAttribute('role', 'menuitem');
    button.innerHTML = `<i></i> ${themes[name].label}`;
    themeMenu.appendChild(button);
  });
}

function updateThemeButtons(activeTheme) {
  document.querySelectorAll('[data-theme]').forEach((button) => {
    const theme = themes[button.dataset.theme];
    if (!theme) return;
    const swatch = button.querySelector('i');
    if (swatch) swatch.style.background = theme.color;
    button.classList.toggle('active', button.dataset.theme === activeTheme);
    button.setAttribute('aria-label', `Use ${theme.label} theme`);
  });
}

function applyTheme(name, save = true) {
  const theme = themes[name] || themes.light;
  Object.entries(theme.vars).forEach(([property, value]) => document.documentElement.style.setProperty(property, value));
  document.body.dataset.theme = name;
  if (themeToggle) {
    themeToggle.textContent = theme.icon;
    themeToggle.setAttribute('aria-label', `Current theme: ${theme.label}. Open theme picker`);
  }
  if (themeMeta) themeMeta.setAttribute('content', theme.meta);
  updateThemeButtons(name);
  if (save) localStorage.setItem('theme', name);
}

const savedTheme = localStorage.getItem('theme');
applyTheme(savedTheme && themes[savedTheme] ? savedTheme : (prefersDark.matches ? 'dark' : 'light'), false);

themeToggle?.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = themePicker.classList.toggle('open');
  themeToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('[data-theme]').forEach((button) => {
  button.addEventListener('click', () => {
    applyTheme(button.dataset.theme);
    themePicker?.classList.remove('open');
    themeToggle?.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  if (themePicker && !themePicker.contains(event.target)) {
    themePicker.classList.remove('open');
    themeToggle?.setAttribute('aria-expanded', 'false');
  }
});

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => {
  if (glow) {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
