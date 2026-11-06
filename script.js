
(function () {
  'use strict';
  const KEY = 'nsmeProgress';
  const defaults = { completedLessons: [], quizScores: {}, gameLevel: 0, badges: [], finalScore: null, videoCompleted: [], videoSeconds: {} };

  function getProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
      const merged = Object.assign({}, defaults, saved || {});
      merged.completedLessons = Array.isArray(merged.completedLessons) ? merged.completedLessons : [];
      merged.videoCompleted = Array.isArray(merged.videoCompleted) ? merged.videoCompleted : [];
      merged.videoSeconds = merged.videoSeconds && typeof merged.videoSeconds === 'object' ? merged.videoSeconds : {};
      merged.badges = Array.isArray(merged.badges) ? merged.badges : [];
      merged.quizScores = merged.quizScores || {};
      return merged;
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
      if (!p.videoCompleted.includes(number)) return false;
      if (number > 1 && !p.completedLessons.includes(number - 1)) return false;
      if (!p.completedLessons.includes(number)) p.completedLessons.push(number);
      p.quizScores[number] = score;
      const badge = 'Lesson Star ' + number;
      if (score >= 4 && !p.badges.includes(badge)) p.badges.push(badge);
      saveProgress(p);
      return true;
    },
    videoCompleted: function(number) { return getProgress().videoCompleted.includes(Number(number)); },
    markVideoComplete: function(number) {
      const p = getProgress();
      if (!p.videoCompleted.includes(Number(number))) p.videoCompleted.push(Number(number));
      saveProgress(p);
      const fields = document.getElementById('lesson-quiz-fields');
      const submit = document.getElementById('lesson-submit');
      const note = document.getElementById('quiz-lock-note');
      const status = document.getElementById('video-status');
      if (fields) fields.disabled = false;
      if (submit) submit.disabled = false;
      if (note) note.textContent = '✓ Video completed. The five-question lesson check is now unlocked.';
      if (status) { status.textContent = 'Completed'; status.classList.add('is-complete'); }
      return true;
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


  function initLessonVideo() {
    const card = document.getElementById('video-learning-card');
    if (!card) return;
    const lesson = Number(card.dataset.lesson || document.querySelector('[data-lesson]')?.dataset.lesson || 0);
    const progress = getProgress();
    if (!lesson) return;

    // Prevent direct URL access to a lesson that has not been unlocked.
    if (lesson > 1 && !progress.completedLessons.includes(lesson - 1)) {
      const main = document.querySelector('main');
      if (main) main.innerHTML = '<section class="locked-lesson panel"><div class="lock-emblem">🔒</div><h1>This lesson is locked</h1><p>Complete Lesson ' + (lesson - 1) + ' with at least 4/5 to unlock this lesson.</p><a class="btn btn-primary" href="lessons.html">Return to Learn</a></section>';
      return;
    }

    const ids = window.NUMBER_SYSTEM_VIDEO_IDS || {};
    const videoId = ids[lesson];
    const mount = document.getElementById('lesson-video-player');
    if (!videoId || !mount) {
      if (mount) mount.textContent = 'This lesson video is not configured yet.';
      return;
    }
    const key = String(lesson);
    let lastTime = Number(progress.videoSeconds[key] || 0);
    let player = null, poll = null, apiReady = false;
    const savedComplete = progress.videoCompleted.includes(lesson);
    const progressText = document.getElementById('video-progress-text');
    const progressBar = document.getElementById('video-progress-bar');
    const status = document.getElementById('video-status');
    if (savedComplete) {
      NSME.markVideoComplete(lesson);
      if (progressText) progressText.textContent = '100% watched';
      if (progressBar) progressBar.style.width = '100%';
    } else if (lastTime > 0 && status) status.textContent = 'Resume available';

    mount.innerHTML = '<div id="nsme-youtube-player"></div>';
    function loadApi() {
      if (window.YT && window.YT.Player) { createPlayer(); return; }
      if (!document.querySelector('script[data-nsme-youtube-api]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.dataset.nsmeYoutubeApi = 'true';
        document.head.appendChild(tag);
      }
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function() {
        if (typeof previous === 'function') previous();
        createPlayer();
      };
    }
    function createPlayer() {
      if (apiReady || !window.YT || !window.YT.Player) return;
      apiReady = true;
      player = new YT.Player('nsme-youtube-player', {
        videoId: videoId,
        playerVars: {rel:0, modestbranding:1, playsinline:1, controls:1, enablejsapi:1, origin:location.origin},
        events: {
          onReady: function() {
            if (lastTime > 0 && lastTime < player.getDuration() - 2) {
              player.seekTo(lastTime, true);
            }
            poll = window.setInterval(trackWatch, 1000);
          },
          onStateChange: function(event) {
            if (event.data === YT.PlayerState.ENDED) {
              NSME.markVideoComplete(lesson);
              if (progressText) progressText.textContent = '100% watched';
              if (progressBar) progressBar.style.width = '100%';
              if (poll) clearInterval(poll);
            }
            if (event.data === YT.PlayerState.PLAYING && status) status.textContent = 'In progress';
            if (event.data === YT.PlayerState.PAUSED && status && !NSME.videoCompleted(lesson)) status.textContent = 'Paused · saved';
          },
          onError: function() {
            mount.innerHTML = '<p class="video-error">The video could not be loaded. Check the YouTube link or try again later.</p>';
          }
        }
      });
    }
    function trackWatch() {
      if (!player || !player.getDuration) return;
      const current = Number(player.getCurrentTime() || 0);
      const duration = Number(player.getDuration() || 0);
      if (!duration) return;
      // Discourage skipping: a large forward seek is returned to the last tracked position.
      if (current > lastTime + 3.5) {
        player.seekTo(lastTime, true);
        return;
      }
      if (current > lastTime) lastTime = current;
      const p = getProgress();
      p.videoSeconds[key] = Math.floor(lastTime);
      saveProgress(p);
      const percent = Math.min(99, Math.floor((lastTime / duration) * 100));
      if (progressText) progressText.textContent = percent + '% watched';
      if (progressBar) progressBar.style.width = percent + '%';
    }
    loadApi();
  }

  function enforcePageAccess() {
    const lessonPage = document.querySelector('main.lesson-page[data-lesson]');
    if (!lessonPage) return;
    const lesson = Number(lessonPage.dataset.lesson);
    const p = getProgress();
    if (lesson > 1 && !p.completedLessons.includes(lesson - 1)) {
      lessonPage.innerHTML = '<section class="locked-lesson panel"><div class="lock-emblem">🔒</div><h1>This lesson is locked</h1><p>Pass Lesson ' + (lesson - 1) + ' with at least 4/5 to continue.</p><a class="btn btn-primary" href="lessons.html">Return to Learn</a></section>';
    }
  }

  function initSiteControls() {
    const body = document.body;
    const root = document.documentElement;

    // Restore preferences
    const savedTheme = localStorage.getItem('nsmeTheme') || 'light';
    body.classList.toggle('dark-mode', savedTheme === 'dark');
    let fontSize = Number(localStorage.getItem('nsmeFontSize')) || 15;
    fontSize = Math.min(22, Math.max(12, fontSize));
    root.style.setProperty('--site-font-size', fontSize + 'px');
    body.style.zoom = String(fontSize / 15);
    

    // Make the mobile navigation button work on every page.
    const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a').forEach(link => {
      const target = (link.getAttribute('href') || '').toLowerCase();
      if (target === currentPage) link.classList.add('active');
    });
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
        '<button type="button" id="theme-toggle" aria-label="Toggle light and dark mode" title="Toggle light and dark mode">☾</button>' +
        '<button type="button" id="music-toggle" aria-label="Turn background music on or off" title="Turn background music on or off">♫ Music: Off</button>';
      body.appendChild(toolbar);

      function applyFontSize() {
        root.style.setProperty('--site-font-size', fontSize + 'px');
    body.style.zoom = String(fontSize / 15);
        
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

      // Gentle original ambient soundtrack. Browsers require a user gesture before audio playback.
      let music = document.getElementById('nsme-background-music');
      if (!music) {
        music = document.createElement('audio');
        music.id = 'nsme-background-music';
        music.src = 'assets/soothing-ambient.ogg';
        music.loop = true;
        music.preload = 'none';
        music.volume = 0.22;
        music.setAttribute('aria-label', 'Soft ambient background music');
        body.appendChild(music);
      }
      const musicButton = document.getElementById('music-toggle');
      let musicWanted = localStorage.getItem('nsmeMusic') === 'on';
      function updateMusicButton(state) {
        musicButton.textContent = state ? '♫ Music: On' : '♫ Music: Off';
        musicButton.setAttribute('aria-pressed', state ? 'true' : 'false');
        musicButton.title = state ? 'Turn background music off' : 'Turn background music on';
      }
      updateMusicButton(false);
      musicButton.addEventListener('click', function () {
        if (musicWanted && !music.paused) {
          music.pause();
          musicWanted = false;
          localStorage.setItem('nsmeMusic', 'off');
          updateMusicButton(false);
          return;
        }
        musicWanted = true;
        music.play().then(function () {
          localStorage.setItem('nsmeMusic', 'on');
          updateMusicButton(true);
        }).catch(function () {
          musicWanted = false;
          localStorage.setItem('nsmeMusic', 'off');
          updateMusicButton(false);
          musicButton.textContent = '♫ Tap to play';
        });
      });
      music.addEventListener('pause', function () {
        if (!musicWanted) updateMusicButton(false);
      });
    }
  }

  function boot() {
    initSiteControls();
    enforcePageAccess();
    initLessonVideo();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
