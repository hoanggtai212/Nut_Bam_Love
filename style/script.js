const PHRASES = [
  "Bùi Ngọc Thiên Hương",
  "I Love You bé Hương",
  "Bùi Ngọc Thiên Hương ❤️❤️❤️",
  "Valentine vui vẻ ❤️",
  "Có em, mọi thứ đều trở nên kỳ diệu 🌙 💖",
  "Valentine ấm áp và bình yên nha 💖",
  "Chúc em luôn cười thật tươi 🌟💖",
  "Valentine ngọt ngào như một bản nhạc 🎶💖"
];

const scene = document.getElementById("scene");
const heartBtn = document.getElementById("heartBtn");
const musicPlayer = document.getElementById("musicPlayer");
const audioPlayer = document.getElementById("audioPlayer");
const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const progressFill = document.getElementById("progressFill");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const toggleBtn = document.getElementById("toggleBtn");

let isProcessing = false;
let firstClick = true;
let isPlaying = false;
let phraseIndex = 0;
let colorIndex = 0; // dùng riêng cho màu 10 bước

function triggerRelease(e) {
  if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  if (isProcessing) return;

  isProcessing = true;

  if (firstClick) {
    activateMusic();
    firstClick = false;
  }

  releasePhrase();

  setTimeout(() => {
    isProcessing = false;
  }, 300);
}

function activateMusic() {
  musicPlayer.classList.add("active");
  audioPlayer.play().then(() => {
    isPlaying = true;
    showPauseIcon();
  }).catch(() => {});
}

function showPlayIcon() {
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
}

function showPauseIcon() {
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
}

function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    showPlayIcon();
    isPlaying = false;
  } else {
    audioPlayer.play().then(() => {
      showPauseIcon();
      isPlaying = true;
    }).catch(() => {});
  }
}

function updateProgress() {
  if (audioPlayer.duration) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = progress + "%";
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return mins + ":" + (secs < 10 ? "0" : "") + secs;
}

function seekAudio(e) {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const newTime = (clickX / rect.width) * audioPlayer.duration;
  audioPlayer.currentTime = newTime;
}

heartBtn.addEventListener("click", triggerRelease);
heartBtn.addEventListener("keydown", triggerRelease);
playPauseBtn.addEventListener("click", togglePlayPause);
progressBar.addEventListener("click", seekAudio);
audioPlayer.addEventListener("timeupdate", updateProgress);
audioPlayer.addEventListener("loadedmetadata", updateProgress);

toggleBtn.addEventListener("click", () => {
  musicPlayer.classList.toggle("minimized");
});

function releasePhrase() {
  heartBtn.classList.add("clicked");
  setTimeout(() => heartBtn.classList.remove("clicked"), 700);
  createParticlesBurst();
  createPhrase();
}

function createPhrase() {
  const phraseText = PHRASES[phraseIndex];
  phraseIndex++;
  if (phraseIndex >= PHRASES.length) phraseIndex = 0;

  // 🎨 10 bước tăng dần rồi reset
  const step = colorIndex % 10;
  const lightnessStart = 80;
  const lightnessEnd = 45;
  const lightness =
    lightnessStart -
    ((lightnessStart - lightnessEnd) / 9) * step;

  colorIndex++;
  if (colorIndex >= 10) colorIndex = 0;

  const el = document.createElement("div");
  el.className = "phrase shooting";
  el.textContent = phraseText;

  el.style.color = `hsl(330, 100%, ${lightness}%)`;
  el.style.textShadow = `
    0 0 8px hsl(330, 100%, ${lightness}%),
    0 0 16px hsl(330, 100%, ${lightness - 5}%)
  `;

  const heartRect = heartBtn.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();

  const startX = heartRect.left + heartRect.width / 2 - sceneRect.left;
  const startY = heartRect.top + heartRect.height / 2 - sceneRect.top;

  el.style.left = startX + "px";
  el.style.top = startY + "px";

  const angle = Math.random() * 120 - 150;
  const shootForce = rand(150, 230);
  const shootX = Math.cos((angle * Math.PI) / 180) * shootForce;
  const shootY = Math.sin((angle * Math.PI) / 180) * shootForce;

  const fallDistance = rand(250, 450);
  const horizontalDrift = rand(-120, 120);
  const finalX = shootX + horizontalDrift;
  const finalY = shootY + fallDistance;

  const initialRotation = rand(-20, 20);
  const finalRotation = initialRotation + rand(-40, 40);
  const duration = rand(4.5, 6.5);

  el.style.setProperty("--shoot-x", shootX + "px");
  el.style.setProperty("--shoot-y", shootY + "px");
  el.style.setProperty("--final-x", finalX + "px");
  el.style.setProperty("--final-y", finalY + "px");
  el.style.setProperty("--rotation", initialRotation + "deg");
  el.style.setProperty("--final-rotation", finalRotation + "deg");
  el.style.setProperty("--duration", duration + "s");

  scene.appendChild(el);
  el.addEventListener("animationend", () => el.remove(), { once: true });
}

function createParticlesBurst() {
  const heartRect = heartBtn.getBoundingClientRect();
  const sceneRect = scene.getBoundingClientRect();
  const centerX = heartRect.left + heartRect.width / 2 - sceneRect.left;
  const centerY = heartRect.top + heartRect.height / 2 - sceneRect.top;

  const particleCount = rand(10, 15);

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle burst";

    particle.style.left = centerX + "px";
    particle.style.top = centerY + "px";

    const angle = Math.random() * 360;
    const distance = rand(50, 90);
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;

    particle.style.setProperty("--particle-x", x + "px");
    particle.style.setProperty("--particle-y", y + "px");

    scene.appendChild(particle);
    particle.addEventListener("animationend", () => particle.remove(), { once: true });
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
