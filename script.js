const year = document.getElementById('year');
const themeToggle = document.querySelector('.theme-toggle');
const themePicker = document.querySelector('.theme-picker');
const themeMenu = document.querySelector('.theme-menu');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const bootOverlay = document.getElementById('boot-overlay');
const commandPalette = document.getElementById('command-palette');
const commandInput = document.getElementById('command-input');
const terminalBody = document.querySelector('.terminal-body');
const body = document.body;

const themes = {
  light: {
    label: 'Daylight',
    icon: '☼',
    meta: '#f3efe9',
    vars: {
      '--bg': '#f3efe9',
      '--surface': '#ffffff',
      '--surface-alt': '#f6f1eb',
      '--text': '#0e1724',
      '--muted': '#58677a',
      '--line': 'rgba(15, 23, 42, 0.12)',
      '--accent': '#ff7a59',
      '--accent-strong': '#ff8f6f',
      '--success': '#1bbf94',
      '--warning': '#f5b942',
      '--code-bg': '#0f172a'
    }
  },
  dark: {
    label: 'Midnight',
    icon: '☾',
    meta: '#0b1020',
    vars: {
      '--bg': '#0b1020',
      '--surface': '#101a2d',
      '--surface-alt': '#0d1426',
      '--text': '#edf2ff',
      '--muted': '#9aa6c9',
      '--line': 'rgba(154, 166, 201, 0.2)',
      '--accent': '#8b7cff',
      '--accent-strong': '#b6a6ff',
      '--success': '#66f0c2',
      '--warning': '#ffce6d',
      '--code-bg': '#070b14'
    }
  },
  coder: {
    label: 'Coder Mode',
    icon: '</>',
    meta: '#101226',
    vars: {
      '--bg': '#101226',
      '--surface': '#171a38',
      '--surface-alt': '#111a2d',
      '--text': '#eef0ff',
      '--muted': '#aab1d5',
      '--line': 'rgba(173, 180, 255, 0.2)',
      '--accent': '#8b7cff',
      '--accent-strong': '#b6a6ff',
      '--success': '#55e6c1',
      '--warning': '#ffc86b',
      '--code-bg': '#080b1b'
    }
  },
  hacker: {
    label: 'Ethical Hacker',
    icon: '⌁',
    meta: '#071009',
    vars: {
      '--bg': '#071009',
      '--surface': '#0c1a12',
      '--surface-alt': '#091a0f',
      '--text': '#e6ffe3',
      '--muted': '#96bb9d',
      '--line': 'rgba(120, 255, 140, 0.2)',
      '--accent': '#9cff57',
      '--accent-strong': '#b9ff7a',
      '--success': '#7af5ab',
      '--warning': '#ffd26e',
      '--code-bg': '#030804'
    }
  },
  cyber: {
    label: 'Cyber Lime',
    icon: '◆',
    meta: '#101510',
    vars: {
      '--bg': '#101510',
      '--surface': '#172018',
      '--surface-alt': '#131d18',
      '--text': '#e5f6ce',
      '--muted': '#9ab28c',
      '--line': 'rgba(177, 214, 86, 0.2)',
      '--accent': '#b7f34a',
      '--accent-strong': '#d8ff71',
      '--success': '#bbff85',
      '--warning': '#ffd86c',
      '--code-bg': '#071007'
    }
  },
  sunset: {
    label: 'Sunset',
    icon: '◒',
    meta: '#25181b',
    vars: {
      '--bg': '#25181b',
      '--surface': '#352124',
      '--surface-alt': '#2b1d20',
      '--text': '#fff0df',
      '--muted': '#d2a5a0',
      '--line': 'rgba(255, 136, 102, 0.2)',
      '--accent': '#ff8666',
      '--accent-strong': '#ffb07e',
      '--success': '#ffd870',
      '--warning': '#ffb364',
      '--code-bg': '#1b1013'
    }
  },
  ocean: {
    label: 'Ocean',
    icon: '◓',
    meta: '#eaf5f4',
    vars: {
      '--bg': '#eaf5f4',
      '--surface': '#f8fffe',
      '--surface-alt': '#edf8f6',
      '--text': '#112b35',
      '--muted': '#597a80',
      '--line': 'rgba(8, 127, 140, 0.18)',
      '--accent': '#087f8c',
      '--accent-strong': '#0a9aac',
      '--success': '#47c8a7',
      '--warning': '#ffc96b',
      '--code-bg': '#102b35'
    }
  }
};

function applyTheme(name, persist = true) {
  const safeName = themes[name] ? name : 'dark';
  const selected = themes[safeName];

  Object.entries(selected.vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', selected.meta);

  if (themeToggle) themeToggle.textContent = selected.icon;
  if (themeMenu) {
    themeMenu.querySelectorAll('[data-theme]').forEach((button) => {
      button.classList.toggle('active', button.dataset.theme === safeName);
    });
  }
  if (persist) localStorage.setItem('portfolio-theme', safeName);
}

function renderThemeOptions() {
  if (!themeMenu) return;
  const buttons = Object.entries(themes).map(([name, theme]) => {
    return `<button type="button" data-theme="${name}" role="menuitem"><i></i> ${theme.label}</button>`;
  }).join('');
  themeMenu.innerHTML = buttons;
  themeMenu.querySelectorAll('[data-theme]').forEach((button) => {
    button.addEventListener('click', () => {
      applyTheme(button.dataset.theme);
      themePicker?.classList.remove('open');
      themeToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

function setBootSequence() {
  if (!bootOverlay) return;
  setTimeout(() => {
    bootOverlay.classList.add('hidden');
  }, 1800);
}

function initTheme() {
  renderThemeOptions();
  const savedTheme = localStorage.getItem('portfolio-theme');
  const initialTheme = savedTheme && themes[savedTheme] ? savedTheme : (prefersDark.matches ? 'dark' : 'coder');
  applyTheme(initialTheme, false);
}

function addTerminalOutput(text, type = 'normal') {
  if (!terminalBody) return;
  const line = document.createElement('p');
  const label = document.createElement('span');
  line.className = type === 'success' ? 'success' : '';
  if (type === 'normal') {
    line.textContent = text;
  } else {
    line.textContent = text;
  }
  terminalBody.appendChild(line);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function runCommand(command) {
  const input = command.trim().toLowerCase();
  const clean = input.replace(/\s+/g, ' ');

  if (!clean) return;

  const responseMap = {
    about: [
      'I am Devanshu Raj, a student developer exploring software, security, AI, and systems.',
      'I enjoy learning how technology works and building projects that improve understanding.'
    ],
    help: [
      'Available commands: about, skills, projects, contact, whoami, theme, sudo, hack, clear, help.'
    ],
    whoami: ['devanshu_raj'],
    skills: [
      'Python • Flask • Web Dev • C/C++ • Linux • Termux • AI/ML • Cybersecurity • Git • SQLite'
    ],
    projects: [
      'Local AI Tools',
      'Cyber Lab Research',
      'Portfolio + Web Experiments',
      'Open-source learning projects'
    ],
    contact: ['Email: devanshuraj2891@gmail.com', 'GitHub: github.com/devanshuraj91'],
    sudo: ['Nice try. This portfolio runs in user mode.'],
    hack: ['Ethical hacking is about understanding systems responsibly, not exploiting them.'],
    clear: ['CLEARING TERMINAL...']
  };

  const matched = clean.split(' ');

  if (clean.startsWith('theme ')) {
    const selected = clean.split(' ')[1];
    if (themes[selected]) {
      applyTheme(selected, true);
      addTerminalOutput(`theme set to ${selected}`);
    } else {
      addTerminalOutput('Theme not found. Try: light, dark, coder, hacker, cyber, sunset, ocean');
    }
    return;
  }

  if (clean === 'clear') {
    terminalBody.innerHTML = '';
    addTerminalOutput('$ clear');
    return;
  }

  if (responseMap[clean]) {
    addTerminalOutput(`$ ${clean}`);
    responseMap[clean].forEach((line) => addTerminalOutput(line));
    return;
  }

  if (clean === 'matrix') {
    body.classList.toggle('matrix-mode');
    addTerminalOutput('$ matrix');
    addTerminalOutput(body.classList.contains('matrix-mode') ? 'matrix mode activated.' : 'matrix mode deactivated.');
    return;
  }

  addTerminalOutput(`$ ${clean}`);
  addTerminalOutput('Command not found. Type help for a list of valid commands.');
}

function attachTerminalBehavior() {
  const terminalInput = document.querySelector('.terminal-input');
  if (!terminalInput) return;

  terminalInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = terminalInput.value.trim();
      if (!value) return;
      runCommand(value);
      terminalInput.value = '';
    }
  });
}

function initCommandPalette() {
  if (!commandPalette || !commandInput) return;

  document.addEventListener('keydown', (event) => {
    const isOpen = !commandPalette.classList.contains('hidden');
    if (event.key === '/' && !isOpen) {
      event.preventDefault();
      commandPalette.classList.remove('hidden');
      commandInput.focus();
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      commandPalette.classList.toggle('hidden');
      if (!commandPalette.classList.contains('hidden')) commandInput.focus();
    }
    if (event.key === 'Escape' && !commandPalette.classList.contains('hidden')) {
      commandPalette.classList.add('hidden');
      commandInput.value = '';
    }
  });

  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const value = commandInput.value.trim();
      if (!value) return;
      runCommand(value);
      commandInput.value = '';
      commandPalette.classList.add('hidden');
    }
  });

  commandPalette.querySelectorAll('.command-item').forEach((button) => {
    button.addEventListener('click', () => {
      const command = button.dataset.command || '';
      runCommand(command);
      commandPalette.classList.add('hidden');
      commandInput.value = '';
    });
  });
}

function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
}

function initThemeToggle() {
  if (!themeToggle || !themePicker) return;

  themeToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = themePicker.classList.toggle('open');
    themeToggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (event) => {
    if (!themePicker.contains(event.target)) {
      themePicker.classList.remove('open');
      themeToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function initKonamiEasterEgg() {
  const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let index = 0;

  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === code[index]) {
      index++;
      if (index === code.length) {
        body.classList.add('root-mode');
        setTimeout(() => {
          const rootMessage = 'root access granted. welcome back, operator.';
          addTerminalOutput(rootMessage, 'success');
        }, 300);
        index = 0;
      }
    } else {
      index = 0;
    }
  });
}

function addMatrixCharacters() {
  const matrixLayer = document.querySelector('.matrix-background');
  if (!matrixLayer) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\{}[]#*+@';
  for (let i = 0; i < 120; i++) {
    const span = document.createElement('span');
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.position = 'absolute';
    span.style.left = `${Math.random() * 100}%`;
    span.style.top = `${Math.random() * 100}%`;
    span.style.fontSize = `${Math.random() * 14 + 8}px`;
    span.style.opacity = String(Math.random() * 0.6 + 0.2);
    span.style.color = 'rgba(102, 240, 194, 0.7)';
    span.style.transform = `translateY(${Math.random() * 20 - 10}px)`;
    matrixLayer.appendChild(span);
  }
}

function init() {
  if (year) year.textContent = new Date().getFullYear();
  initTheme();
  initThemeToggle();
  initCommandPalette();
  setBootSequence();
  initRevealAnimations();
  initKonamiEasterEgg();
  addMatrixCharacters();
  attachTerminalBehavior();

  setTimeout(() => {
    const terminal = document.querySelector('.terminal-card');
    if (terminal) terminal.classList.add('visible');
  }, 400);
}

init();
