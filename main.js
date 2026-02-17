/* ══════════════════════════════════════════
   MEOW MUSIC — main.js
   Polished player logic
══════════════════════════════════════════ */

// ── DOM REFS ──────────────────────────────
const audioPlayer    = document.getElementById('audioPlayer');
const mainPage       = document.getElementById('mainPage');
const playerPage     = document.getElementById('playerPage');
const backBtn        = document.getElementById('backBtn');
const playPauseBtn   = document.getElementById('playPauseBtn');
const pauseIcon      = playPauseBtn.querySelector('.pause-btn');
const playIcon       = playPauseBtn.querySelector('.play-btn');
const prevBtn        = document.querySelector('.js-prev');
const nextBtn        = document.querySelector('.js-next');
const vinylDisc      = document.getElementById('vinylDisc');
const vinylNeedle    = document.getElementById('vinylNeedle');
const progressFill   = document.getElementById('progressFill');
const progressBar    = document.getElementById('progressBar');
const timerEl        = document.getElementById('timer');
const durationEl     = document.getElementById('duration');
const songTitleEl    = document.getElementById('songTitle');
const artistNameEl   = document.getElementById('artistName');
const volumeSlider   = document.getElementById('volumeSlider');
const heartBtn       = document.getElementById('heartBtn');
const searchInput    = document.getElementById('searchInput');
const trackItems     = document.querySelectorAll('.music-list li');
const musicTitles    = document.querySelectorAll('.music-title');

let currentIndex = 0;
let isPlaying    = false;

// ── PARTICLES ────────────────────────────
function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 15 + 8) + 's';
    p.style.animationDelay    = (Math.random() * 10) + 's';
    p.style.width  = (Math.random() * 2 + 1.5) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = Math.random() * 0.5;
    container.appendChild(p);
  }
}
createParticles();

// ── HELPERS ───────────────────────────────
function formatTitle(raw) {
  return raw.trim()
    .replace(/\.(mp3|m4a|wav|ogg|flac)$/i, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatTime(secs) {
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getArtist(rawTitle) {
  const clean = formatTitle(rawTitle);
  const separators = [' - ', ' by '];
  for (const sep of separators) {
    const idx = clean.indexOf(sep);
    if (idx > -1) return clean.substring(0, idx).trim();
  }
  return '🐱 Relaxing Cats';
}

function getSongName(rawTitle) {
  const clean = formatTitle(rawTitle);
  const idx = clean.indexOf(' - ');
  if (idx > -1) return clean.substring(idx + 3).trim();
  return clean;
}

// ── PLAYBACK STATE ────────────────────────
function setPlayingUI(playing) {
  isPlaying = playing;
  if (playing) {
    pauseIcon.style.display = 'block';
    playIcon.style.display  = 'none';
    vinylDisc.classList.add('spinning');
    vinylNeedle.classList.add('playing');
  } else {
    pauseIcon.style.display = 'none';
    playIcon.style.display  = 'block';
    vinylDisc.classList.remove('spinning');
    vinylNeedle.classList.remove('playing');
  }
}

function highlightActiveTrack(index) {
  trackItems.forEach(li => li.classList.remove('active'));
  if (trackItems[index]) trackItems[index].classList.add('active');
}

// ── LOAD & PLAY ───────────────────────────
function loadAndPlay(index) {
  if (index < 0 || index >= musicTitles.length) return;
  currentIndex = index;

  const raw   = musicTitles[index].textContent.trim();
  const song  = getSongName(raw);
  const artist = getArtist(raw);

  songTitleEl.textContent  = song;
  artistNameEl.textContent = artist;

  audioPlayer.src = `music/${raw}`;
  audioPlayer.volume = volumeSlider.value / 100;
  audioPlayer.play()
    .then(() => setPlayingUI(true))
    .catch(() => setPlayingUI(false));

  highlightActiveTrack(index);
  progressFill.style.width = '0%';
  timerEl.textContent = '0:00';
  heartBtn.classList.remove('liked');
}

// ── TRACK LIST CLICKS ─────────────────────
trackItems.forEach((li, idx) => {
  li.addEventListener('click', (e) => {
    if (e.target.closest('.play-music') || e.target === li || li.contains(e.target)) {
      showPlayerPage(idx);
    }
  });
});

function showPlayerPage(index) {
  mainPage.style.display  = 'none';
  playerPage.style.display = 'flex';
  playerPage.classList.add('visible');
  loadAndPlay(index);
}

// ── BACK BUTTON ───────────────────────────
backBtn.addEventListener('click', () => {
  playerPage.style.display = 'none';
  playerPage.classList.remove('visible');
  mainPage.style.display = 'flex';
  // Keep audio playing in background — pause it
  audioPlayer.pause();
  setPlayingUI(false);
});

// ── PLAY / PAUSE ──────────────────────────
playPauseBtn.addEventListener('click', () => {
  if (isPlaying) {
    audioPlayer.pause();
    setPlayingUI(false);
  } else {
    audioPlayer.play()
      .then(() => setPlayingUI(true))
      .catch(() => {});
  }
});

// ── NEXT / PREV ───────────────────────────
nextBtn.addEventListener('click', () => {
  const next = (currentIndex + 1) % musicTitles.length;
  loadAndPlay(next);
});

prevBtn.addEventListener('click', () => {
  // If more than 3s in, restart; else go previous
  if (audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  const prev = (currentIndex - 1 + musicTitles.length) % musicTitles.length;
  loadAndPlay(prev);
});

// ── AUTO ADVANCE ──────────────────────────
audioPlayer.addEventListener('ended', () => {
  const next = (currentIndex + 1) % musicTitles.length;
  loadAndPlay(next);
});

// ── PROGRESS ──────────────────────────────
audioPlayer.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audioPlayer;
  if (!duration) return;
  const pct = (currentTime / duration) * 100;
  progressFill.style.width = pct + '%';
  timerEl.textContent = formatTime(currentTime);
});

// Click/drag progress bar
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pct  = (e.clientX - rect.left) / rect.width;
  audioPlayer.currentTime = pct * audioPlayer.duration;
});

let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
  isDragging = true;
  scrubTo(e);
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  scrubTo(e);
});

document.addEventListener('mouseup', () => { isDragging = false; });

function scrubTo(e) {
  const rect = progressBar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  audioPlayer.currentTime = pct * (audioPlayer.duration || 0);
}

// ── VOLUME ────────────────────────────────
volumeSlider.addEventListener('input', () => {
  audioPlayer.volume = volumeSlider.value / 100;
  // Update slider fill color
  const pct = volumeSlider.value;
  volumeSlider.style.background = `linear-gradient(to right, rgba(167,139,250,0.8) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
});

// Init volume
volumeSlider.dispatchEvent(new Event('input'));

// ── HEART / LIKE ──────────────────────────
heartBtn.addEventListener('click', () => {
  heartBtn.classList.toggle('liked');
  // Small pop animation
  heartBtn.style.transform = 'scale(1.3)';
  setTimeout(() => { heartBtn.style.transform = ''; }, 200);
});

// ── SEARCH ────────────────────────────────
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();
  trackItems.forEach((li) => {
    const title = li.querySelector('.music-title').textContent.toLowerCase();
    if (title.includes(query) || query === '') {
      li.style.display = 'flex';
      li.style.animation = 'fadeSlideIn 0.3s ease backwards';
    } else {
      li.style.display = 'none';
    }
  });
});

// ── KEYBOARD SHORTCUTS ────────────────────
document.addEventListener('keydown', (e) => {
  if (playerPage.classList.contains('visible')) {
    if (e.code === 'Space') {
      e.preventDefault();
      playPauseBtn.click();
    }
    if (e.code === 'ArrowRight') nextBtn.click();
    if (e.code === 'ArrowLeft')  prevBtn.click();
    if (e.code === 'Escape')     backBtn.click();
  }
});
