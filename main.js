const currentSongTitle = document.querySelector('.song-title')
const musicPlayer = document.querySelector('.js-music')
const backButton = document.querySelector('.back-btn')
const pausePlayButton = document.querySelector('.js-pause-play')
const playButton = document.querySelector('.play-btn')
const nextButton = document.querySelector('.js-next')
const previousButton = document.querySelector('.js-prev')
const pauseButton = document.querySelector('.pause-btn')
const progress = document.querySelector('.progress')
const musicCurrentTime = document.querySelector('.timer')
const songDuration = document.querySelector('.duration')
const playMusicButton = document.querySelectorAll('.play-music')
const musicTitle = document.querySelectorAll('.music-title')
const musicPlayerPage = document.querySelector('.music-play-page')
const mainPage = document.querySelector('.music-player-main')
const albumCover = document.querySelector('.cover')

backButton.addEventListener("click", goBack)

let currentSongIndex = 0;
let selectedSongTitle = '';

playMusicButton.forEach((music, index) => {
  music.addEventListener("click", () => {
    selectedSongTitle = musicTitle[index].textContent.trim()
    currentSongIndex = index;
    currentSongTitle.textContent = formatTitle(selectedSongTitle)
    musicPlayerPage.style.display = "flex"
    musicPlayerPage.classList.add('visible')
    startPlaying(selectedSongTitle)
  })
})

function goBack() {
  musicPlayerPage.style.display = "none"
  musicPlayerPage.classList.remove('visible')
  mainPage.style.display = "flex"
  musicPlayer.pause()
  albumCover.classList.remove('playing')
  pauseButton.style.display = "none"
  playButton.style.display = "block"
}

function formatTitle(raw) {
  // Strip file extension and replace underscores/hyphens
  return raw
    .replace(/\.(mp3|m4a|wav|ogg)$/i, '')
    .replace(/_/g, ' ')
    .trim()
}

function startPlaying(selectedSongTitle) {
  musicPlayer.src = `music/${selectedSongTitle}`
  musicPlayer.play()
  albumCover.classList.add('playing')
  pauseButton.style.display = "block"
  playButton.style.display = "none"

  musicPlayer.addEventListener('loadedmetadata', () => {
    const mins = Math.floor(musicPlayer.duration / 60)
    const secs = Math.floor(musicPlayer.duration % 60).toString().padStart(2, '0')
    songDuration.textContent = `${mins}:${secs}`
  }, { once: false })
}

musicPlayer.addEventListener('timeupdate', () => {
  const currentTime = musicPlayer.currentTime
  const duration = musicPlayer.duration
  if (!duration) return

  const progressPercentage = (currentTime / duration) * 100
  progress.style.width = progressPercentage + "%"

  const seconds = Math.floor(currentTime % 60).toString().padStart(2, "0")
  const minutes = Math.floor(currentTime / 60)
  musicCurrentTime.textContent = `${minutes}:${seconds}`
})

musicPlayer.addEventListener('ended', () => {
  // Auto-advance to next track
  currentSongIndex = (currentSongIndex + 1) % musicTitle.length
  navigateSong(currentSongIndex)
})

pauseButton.addEventListener("click", () => {
  musicPlayer.pause()
  pauseButton.style.display = "none"
  playButton.style.display = "block"
  albumCover.classList.remove('playing')
})

playButton.addEventListener("click", () => {
  playSong()
})

function playSong() {
  musicPlayer.play()
  pauseButton.style.display = "block"
  playButton.style.display = "none"
  albumCover.classList.add('playing')
}

nextButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex + 1) % musicTitle.length
  navigateSong(currentSongIndex)
})

previousButton.addEventListener("click", () => {
  currentSongIndex = (currentSongIndex - 1 + musicTitle.length) % musicTitle.length
  navigateSong(currentSongIndex)
})

function navigateSong(index) {
  selectedSongTitle = musicTitle[index].textContent.trim()
  currentSongTitle.textContent = formatTitle(selectedSongTitle)
  startPlaying(selectedSongTitle)
}
