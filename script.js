
(function () {
  'use strict';
  const KEY = 'nsmeProgress';
  const defaults = { completedLessons: [], quizScores: {}, gameLevel: 0, badges: [], finalScore: null };

  function getProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      return Object.assign({}, defaults, saved || {});
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }
  function saveProgress(progress) {
    try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch (error) {}
  }

  window.NSME = {
    get: getProgress,
    save: saveProgress,
    completeLesson: function (number, score) {
      const p = getProgress();
      if (!p.completedLessons.includes(number)) p.completedLessons.push(number);
      p.quizScores[number] = score;
      const badge = 'Lesson Star ' + number;
      if (score >= 4 && !p.badges.includes(badge)) p.badges.push(badge);
      saveProgress(p);
    },
    awardGame: function (level) {
      const p = getProgress();
      p.gameLevel = Math.max(Number(p.gameLevel) || 0, level);
      const names = ['Number Explorer', 'Binary Builder', 'Conversion Champion', 'Base Master', 'Number Quest Hero'];
      const badge = names[level - 1];
      if (badge && !p.badges.includes(badge)) p.badges.push(badge);
      saveProgress(p);
    },
    eligible: function () {
      const p = getProgress();
      return p.completedLessons.length >= 10 && Number(p.gameLevel) >= 5;
    }
  };

  function initSiteControls() {
    const body = document.body;
    const root = document.documentElement;

    // Restore preferences
    const savedTheme = localStorage.getItem('nsmeTheme') || 'light';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    let fontSize = Number(localStorage.getItem('nsmeFontSize')) || 15;
    fontSize = Math.min(22, Math.max(12, fontSize));
    root.style.setProperty('--site-font-size', fontSize + 'px');
    root.style.zoom = String(fontSize / 15);

    // Make the mobile navigation button work on every page.
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    if (navToggle && nav) {
      navToggle.addEventListener('click', function () {
        nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
      });
    }

    // Create a small, consistent accessibility toolbar. No synthetic "bing" music.
    if (!document.getElementById('site-accessibility-tools')) {
      const toolbar = document.createElement('div');
      toolbar.id = 'site-accessibility-tools';
      toolbar.className = 'site-accessibility-tools';
      toolbar.innerHTML =
        '<button type="button" id="font-smaller" aria-label="Decrease text size" title="Decrease text size">A−</button>' +
        '<button type="button" id="font-reset" aria-label="Reset text size" title="Reset text size">A</button>' +
        '<button type="button" id="font-larger" aria-label="Increase text size" title="Increase text size">A+</button>' +
        '<button type="button" id="theme-toggle" aria-label="Toggle light and dark mode" title="Toggle light and dark mode">☾</button>';
      body.appendChild(toolbar);

      function applyFontSize() {
        root.style.setProperty('--site-font-size', fontSize + 'px');
        root.style.zoom = String(fontSize / 15);
        localStorage.setItem('nsmeFontSize', String(fontSize));
      }
      document.getElementById('font-smaller').addEventListener('click', function () {
        fontSize = Math.max(12, fontSize - 1);
        applyFontSize();
      });
      document.getElementById('font-reset').addEventListener('click', function () {
        fontSize = 15;
        applyFontSize();
      });
      document.getElementById('font-larger').addEventListener('click', function () {
        fontSize = Math.min(22, fontSize + 1);
        applyFontSize();
      });
      document.getElementById('theme-toggle').addEventListener('click', function () {
        const dark = !body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode', dark);
        localStorage.setItem('nsmeTheme', dark ? 'dark' : 'light');
        this.textContent = dark ? '☀' : '☾';
      });
      document.getElementById('theme-toggle').textContent = body.classList.contains('dark-mode') ? '☀' : '☾';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteControls);
  } else {
    initSiteControls();
  }
})();
