// --- Track Dataset ---
const trackList = [
    {
        name: "One_Bottle_Down",
        artist: "Yo Yo Honey Singh",
        image: "image1.png",
        path: "song1.mp3"
    },
    {
        name: "Azul",
        artist: "Guru Randhawa",
        image: "image2.png",
        path: "song2.mp3"
    },
    {
        name: "Jeene laga hoon",
        artist: "Sachin-Jigar",
        image: "image3.png",
        path: "song3.mp3"
    }
];

// --- Selectors ---
const audio = document.getElementById('audioElement');
const trackArt = document.getElementById('trackArt');
const trackName = document.getElementById('trackName');
const trackArtist = document.getElementById('trackArtist');

const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const progressSlider = document.getElementById('progressSlider');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeDisplay = document.getElementById('currentTime');
const totalDurationDisplay = document.getElementById('totalDuration');
const playlistContainer = document.getElementById('playlistItems');

let trackIndex = 0;
let isPlaying = false;

// --- Initialize Setup ---
function loadTrack(index) {
    trackIndex = index;
    const currentTrack = trackList[trackIndex];

    audio.src = currentTrack.path;
    audio.load();

    trackName.innerText = currentTrack.name;
    trackArtist.innerText = currentTrack.artist;
    trackArt.style.backgroundImage = `url('${currentTrack.image}')`;

    resetTimelineValues();
    highlightActiveTrack();
}

// UI element generation for playlist
function buildPlaylistUI() {
    playlistContainer.innerHTML = '';
    trackList.forEach((track, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${track.name}</span><small>${track.artist}</small>`;
        li.addEventListener('click', () => {
            loadTrack(idx);
            playTrack();
        });
        playlistContainer.appendChild(li);
    });
}

function highlightActiveTrack() {
    const items = playlistContainer.querySelectorAll('li');
    items.forEach((item, idx) => {
        if (idx === trackIndex) {
            item.classList.add('active-track');
        } else {
            item.classList.remove('active-track');
        }
    });
}

// --- Audio Control Functions ---
function playPauseToggle() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    isPlaying = true;
    audio.play();
    playPauseBtn.innerHTML = "&#10074;&#10074;"; // Pause sign change
    trackArt.classList.add('playing');
}

function pauseTrack() {
    isPlaying = false;
    audio.pause();
    playPauseBtn.innerHTML = "&#9658;"; // Play sign change
    trackArt.classList.remove('playing');
}

function nextTrack() {
    if (trackIndex < trackList.length - 1) {
        trackIndex += 1;
    } else {
        trackIndex = 0; // Return to start loop
    }
    loadTrack(trackIndex);
    playTrack();
}

function prevTrack() {
    if (trackIndex > 0) {
        trackIndex -= 1;
    } else {
        trackIndex = trackList.length - 1; // Return to ending loop
    }
    loadTrack(trackIndex);
    playTrack();
}

function resetTimelineValues() {
    currentTimeDisplay.innerText = "0:00";
    totalDurationDisplay.innerText = "0:00";
    progressSlider.value = 0;
}

// --- Sliders Tracking & Calculation ---
function updateProgress() {
    if (isNaN(audio.duration)) return;
    
    // Percentage tracker conversion
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progressSlider.value = progressPercent;

    // Time calculations conversion format
    let currentMins = Math.floor(audio.currentTime / 60);
    let currentSecs = Math.floor(audio.currentTime % 60);
    let durationMins = Math.floor(audio.duration / 60);
    let durationSecs = Math.floor(audio.duration % 60);

    if (currentSecs < 10) currentSecs = "0" + currentSecs;
    if (durationSecs < 10) durationSecs = "0" + durationSecs;

    currentTimeDisplay.innerText = `${currentMins}:${currentSecs}`;
    totalDurationDisplay.innerText = `${durationMins}:${durationSecs}`;
}

function setProgressValue() {
    // Jump track timelines
    const seekTime = (progressSlider.value / 100) * audio.duration;
    audio.currentTime = seekTime;
}

function setVolumeValue() {
    audio.volume = volumeSlider.value / 100;
}

// --- Event Connection Listeners ---
playPauseBtn.addEventListener('click', playPauseToggle);
nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);

// Bonus: Autoplay integration feature when track ends
audio.addEventListener('ended', nextTrack);

progressSlider.addEventListener('input', setProgressValue);
volumeSlider.addEventListener('input', setVolumeValue);

// App initialization runtime
buildPlaylistUI();
loadTrack(trackIndex);
setVolumeValue(); // sync initial standard volume state
