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

backButton.addEventListener("click", goBack)

let currentSongIndex = 0;

playMusicButton.forEach((music, index) => {
  music.addEventListener("click", () => {
    selectedSongTitle = musicTitle[index].textContent
    
    currentSongIndex = index;
    
    currentSongTitle.textContent = musicTitle[index].textContent;
    musicPlayerPage.style.display = "block"
    startPlaying(selectedSongTitle)
  })
})


function goBack(){
  musicPlayerPage.style.display = "none"
  mainPage.style.display = "block"
}



function startPlaying(selectedSongTitle) {
  musicPlayer.src = `music/${selectedSongTitle}`
  musicPlayer.play()
  
  musicPlayer.addEventListener('loadedmetadata', () => {
    songDuration.textContent = `${ Math.floor(musicPlayer.duration / 60)}:${ Math.floor(musicPlayer.duration % 60)}`;
  });
}

musicPlayer.addEventListener('timeupdate', () => {
  const currentTime = musicPlayer.currentTime;

  const duration = musicPlayer.duration;
  const progressPercentage = (currentTime / duration) * 100;
  progress.style.width = progressPercentage + "%";

  let seconds = (Math.floor(currentTime) % 60).toString().padStart(2, "0")
  let minutes = (Math.floor(currentTime / 60) % 60)
  musicCurrentTime.innerHTML = `
  ${minutes}:${seconds}
  `
});

pauseButton.addEventListener("click", () => {
  musicPlayer.pause()
  pauseButton.style.display = "none"
  playButton.style.display = "block"
  
})

playButton.addEventListener("click", () => {
  playSong()
})

function playSong(){
  musicPlayer.play()
  pauseButton.style.display = "block"
  playButton.style.display = "none"
}

nextButton.addEventListener("click", () => {
  try{
  playSong()
  currentSongIndex += 1;
  navigateSong(currentSongIndex)
  } catch {
    currentSongIndex = 0;
    navigateSong(currentSongIndex)
  }
})

previousButton.addEventListener("click", () => {
  try{
  playSong()
  currentSongIndex -= 1;
  navigateSong(currentSongIndex)
  } catch {
    alert(" ok ")
  }
})

function navigateSong(currentSongIndex){
  selectedSongTitle = musicTitle[currentSongIndex].textContent
  currentSongTitle.textContent = musicTitle[currentSongIndex].textContent;
  startPlaying(selectedSongTitle)
}