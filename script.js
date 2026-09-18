/**
 * ============================================================
 * SECRET GARDEN PIXEL ART (TAMAN BUNGA) - GAME ENGINE
 * Sage Green & Sunflower Aesthetics, Louder Auto-Play BGM
 * ============================================================
 */

// Konfigurasi Kontak & Default
const DEFAULT_CONFIG = {
  myWhatsAppNumber: "6285189968899", // Nomor WhatsApp kamu
  defaultHisName: "Sayang",          // Default nama cowok
  soundEnabled: true
};

// State Manager
const state = {
  config: { ...DEFAULT_CONFIG },
  herName: "",
  hisName: "",
  loveScore: 100,
  loveDescription: "Mekar harum seperti melati!",
  rejectionCount: 0,
  currentStep: 0,
  isTyping: false,
  typingTimeout: null,
  currentText: "",
  onCompleteTyping: null,
  audioCtx: null,
  bgmPlaying: false,
  bgmTimer: null
};

// ============================================================
// 1. WEB AUDIO API SYNTHESIZER: LOUDER AUTO-PLAY BGM & SFX
// ============================================================

function initAudio() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

// BGM: Melodi Padang Rumput 8-Bit Romantis (Lebih Kencang & Merdu)
const GARDEN_MELODY = [
  { f: 329.63, d: 0.28 }, // E4
  { f: 392.00, d: 0.28 }, // G4
  { f: 493.88, d: 0.28 }, // B4
  { f: 587.33, d: 0.55 }, // D5
  { f: 523.25, d: 0.28 }, // C5
  { f: 493.88, d: 0.28 }, // B4
  { f: 392.00, d: 0.55 }, // G4
  { f: 349.23, d: 0.28 }, // F4
  { f: 440.00, d: 0.28 }, // A4
  { f: 523.25, d: 0.55 }, // C5
  { f: 493.88, d: 0.28 }, // B4
  { f: 392.00, d: 0.28 }, // G4
  { f: 329.63, d: 0.65 }, // E4
];

let bgmIndex = 0;

function playGardenBgmNote() {
  if (!state.bgmPlaying || !state.config.soundEnabled || !state.audioCtx) return;
  const note = GARDEN_MELODY[bgmIndex];
  try {
    const now = state.audioCtx.currentTime;
    
    // Main Lead Melody (Square Wave)
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(note.f, now);
    // Volume lebih kencang (0.09)
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.002, now + note.d);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + note.d);

    // Warm Harmony Chord
    const chordOsc = state.audioCtx.createOscillator();
    const chordGain = state.audioCtx.createGain();
    chordOsc.type = 'sine';
    chordOsc.frequency.setValueAtTime(note.f / 2, now);
    chordGain.gain.setValueAtTime(0.07, now);
    chordGain.gain.exponentialRampToValueAtTime(0.001, now + note.d);
    chordOsc.connect(chordGain);
    chordGain.connect(state.audioCtx.destination);
    chordOsc.start(now);
    chordOsc.stop(now + note.d);

  } catch (e) {}

  bgmIndex = (bgmIndex + 1) % GARDEN_MELODY.length;
  state.bgmTimer = setTimeout(playGardenBgmNote, note.d * 1000 + 40);
}

function startAutoPlayBgm() {
  initAudio();
  if (state.bgmPlaying) return;
  state.bgmPlaying = true;
  bgmIndex = 0;
  playGardenBgmNote();
}

function stopBgm() {
  state.bgmPlaying = false;
  if (state.bgmTimer) {
    clearTimeout(state.bgmTimer);
    state.bgmTimer = null;
  }
}

// SFX: Blip ketik peri bunga
function playTypeBlip() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(580 + Math.random() * 120, state.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, state.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start();
    osc.stop(state.audioCtx.currentTime + 0.035);
  } catch (e) {}
}

// SFX: Sentuhan peri ajaib (Fairy Sparkle)
function playFairyChime() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const notes = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
    notes.forEach((freq, idx) => {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      const startTime = state.audioCtx.currentTime + (idx * 0.06);
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  } catch (e) {}
}

// SFX: Bunga layu saat klik tidak
function playWiltSound() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const now = state.audioCtx.currentTime;
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    gain.connect(state.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  } catch (e) {}
}

// SFX: Bunga mekar jingle (Victory)
function playGardenFanfare() {
  if (!state.config.soundEnabled || !state.audioCtx) return;
  try {
    const notes = [392.00, 493.88, 587.33, 783.99, 987.77]; // G4, B4, D5, G5, B5
    notes.forEach((freq, idx) => {
      const osc = state.audioCtx.createOscillator();
      const gain = state.audioCtx.createGain();
      osc.type = 'triangle';
      const startTime = state.audioCtx.currentTime + (idx * 0.08);
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.12, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
      osc.connect(gain);
      gain.connect(state.audioCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch (e) {}
}

// ============================================================
// 2. CANVAS: FLOATING DANDELIONS, JASMINE & SUNFLOWER PETALS
// ============================================================

const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Preload 5 Authentic 16-Bit Pixel Art Flower Sprites
const FLOWER_SPRITE_URLS = [
  'assets/flower_sunflower.png',
  'assets/flower_jasmine.png',
  'assets/flower_rose.png',
  'assets/flower_dandelion.png',
  'assets/flower_clover.png'
];

const FLOWER_IMAGES = FLOWER_SPRITE_URLS.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

// Ragam flora & fauna taman dengan 5 tier ukuran
const FLOWER_TIERS = [
  // Micro tier (10px - 14px)
  { type: 'micro', minSize: 10, maxSize: 14, speed: 0.6, countWeight: 0.35 },
  // Small tier (16px - 22px)
  { type: 'small', minSize: 16, maxSize: 22, speed: 0.9, countWeight: 0.30 },
  // Medium tier (24px - 32px)
  { type: 'medium', minSize: 24, maxSize: 32, speed: 1.2, countWeight: 0.20 },
  // Large tier (34px - 44px)
  { type: 'large', minSize: 34, maxSize: 44, speed: 1.5, countWeight: 0.12 },
  // Giant Foreground tier (48px - 58px)
  { type: 'giant', minSize: 48, maxSize: 58, speed: 1.8, countWeight: 0.03 }
];

function getRandomTier() {
  const rand = Math.random();
  let cumulative = 0;
  for (const tier of FLOWER_TIERS) {
    cumulative += tier.countWeight;
    if (rand <= cumulative) return tier;
  }
  return FLOWER_TIERS[1];
}

class GardenParticle {
  constructor(x, y, isBurst = false, customSize = null, customImgIdx = null) {
    const tier = getRandomTier();
    this.x = x !== undefined ? x : Math.random() * canvas.width;
    this.y = y !== undefined ? y : (isBurst ? canvas.height / 2 : -40);
    
    const imgIdx = customImgIdx !== null ? customImgIdx : Math.floor(Math.random() * FLOWER_IMAGES.length);
    this.img = FLOWER_IMAGES[imgIdx];
    
    if (customSize) {
      this.size = customSize;
    } else {
      this.size = isBurst 
        ? Math.floor(Math.random() * 20) + 14 
        : Math.floor(Math.random() * (tier.maxSize - tier.minSize)) + tier.minSize;
    }

    this.speedY = isBurst ? (Math.random() * 10 - 5) : (Math.random() * 1.1 + tier.speed);
    this.speedX = isBurst ? (Math.random() * 10 - 5) : (Math.sin(Math.random() * 10) * 1.1);
    this.opacity = 1;
    this.fade = isBurst ? 0.022 : (tier.type === 'giant' ? 0.0016 : 0.0022);
    this.rotation = Math.random() * 360;
    this.rotSpeed = (Math.random() - 0.5) * 1.8;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    this.rotation += this.rotSpeed;
    this.opacity -= this.fade;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    if (this.img && this.img.complete && this.img.naturalWidth > 0) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    ctx.restore();
  }
}

function spawnGardenParticles() {
  if (particles.length < 65 && Math.random() < 0.45) {
    particles.push(new GardenParticle());
  }
}

function burstFlowers(count = 35) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < count; i++) {
    const burstSize = Math.floor(Math.random() * 24) + 14;
    particles.push(new GardenParticle(cx, cy, true, burstSize));
  }
}

// Sentuhan / klik di mana saja memicu ledakan bunga pixel art
window.addEventListener('click', (e) => {
  for (let i = 0; i < 4; i++) {
    const pSize = Math.floor(Math.random() * 18) + 12;
    particles.push(new GardenParticle(e.clientX, e.clientY, true, pSize));
  }
});

function animateGarden() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  spawnGardenParticles();

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].opacity <= 0 || particles[i].y > canvas.height + 30) {
      particles.splice(i, 1);
    }
  }
  requestAnimationFrame(animateGarden);
}
animateGarden();

// ============================================================
// 3. FLORA SPRITE & INSTANT TYPEWRITER
// ============================================================

const charBox = document.getElementById('characterSprite');
const charMoodLabel = document.getElementById('characterMood');
const typewriterEl = document.getElementById('typewriterText');
const cursorEl = document.getElementById('blinkingCursor');

function setCharacterMood(mood, textLabel) {
  charBox.className = 'character-box ' + mood;
  if (textLabel) {
    charMoodLabel.textContent = textLabel;
  }
}

document.getElementById('characterStage').addEventListener('click', (e) => {
  e.stopPropagation();
  initAudio();
  playFairyChime();
  setCharacterMood('happy', 'Flora mengepakkan sayap riang! ✨');
  setTimeout(() => {
    if (!state.isTyping && charBox.classList.contains('happy')) {
      setCharacterMood('normal', 'Flora Peri Taman Bunga 🌿');
    }
  }, 1200);
});

function typeDialogue(text, onComplete) {
  if (state.typingTimeout) {
    clearTimeout(state.typingTimeout);
    state.typingTimeout = null;
  }
  
  state.isTyping = true;
  state.currentText = text;
  state.onCompleteTyping = onComplete;
  typewriterEl.textContent = "";
  cursorEl.style.display = "none";
  setCharacterMood('talking', 'Flora sedang bicara... 💬');

  let charIndex = 0;
  
  function typeChar() {
    if (charIndex < text.length) {
      typewriterEl.textContent += text[charIndex];
      if (charIndex % 2 === 0) {
        playTypeBlip();
      }
      charIndex++;
      state.typingTimeout = setTimeout(typeChar, 20);
    } else {
      finishTyping();
    }
  }
  typeChar();
}

function finishTyping() {
  if (state.typingTimeout) {
    clearTimeout(state.typingTimeout);
    state.typingTimeout = null;
  }
  if (state.currentText) {
    typewriterEl.textContent = state.currentText;
  }
  state.isTyping = false;
  cursorEl.style.display = "inline-block";
  if (charBox.classList.contains('talking')) {
    setCharacterMood('normal', 'Flora Peri Taman Bunga 🌿');
  }
  if (state.onCompleteTyping) {
    const cb = state.onCompleteTyping;
    state.onCompleteTyping = null;
    cb();
  }
}

function skipTyping() {
  if (state.isTyping) {
    finishTyping();
  }
}

// Tap di mana saja pada dialog box untuk selesaikan teks langsung
document.getElementById('dialogueWindow').addEventListener('click', (e) => {
  if (state.isTyping && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
    skipTyping();
  }
});

// ============================================================
// 4. QUEST FLOW (5 STEPS SEPERTI VERSI 1)
// ============================================================

const STEPS = [
  {
    stepId: 'step0',
    getText: () => "Halo bidadari manis! ✨ Selamat datang di Taman Bunga Ajaib. Flora si Peri Bunga siap memandumu memetik bunga cinta terindah. Siap?",
    onEnter: () => setCharacterMood('normal', 'Flora Peri Taman Bunga 🌿')
  },
  {
    stepId: 'step1',
    getText: () => "Pertama-tama, bolehkah Flora tahu siapa nama putri penjaga taman yang secantik bunga melati ini? 🤍",
    onEnter: () => {
      setCharacterMood('normal', 'Menunggu namamu... 🌼');
      setTimeout(() => document.getElementById('inputHerName').focus(), 300);
    }
  },
  {
    stepId: 'step2',
    getText: () => `Wah, nama "${state.herName}" harum dan manis sekali! 🌸 Nah, siapa nama pangeran / sosok mataharimu yang paling beruntung di dunia itu? 🌻`,
    onEnter: () => {
      setCharacterMood('normal', 'Siapakah mataharimu? 🌻');
      const input = document.getElementById('inputHisName');
      if (!input.value && state.config.defaultHisName) {
        input.value = state.config.defaultHisName;
      }
      setTimeout(() => input.focus(), 300);
    }
  },
  {
    stepId: 'step3',
    getText: () => `Flora mau tanya pertanyaan penentu takdir: Apakah kamu SANGAT mencintai ${state.hisName} sebesar keindahan bunga di seluruh semesta?`,
    onEnter: () => {
      state.rejectionCount = 0;
      resetLoveButtons();
      setCharacterMood('normal', 'Pilihlah dari lubuk hatimu! 🌿');
    }
  },
  {
    stepId: 'step4',
    getText: () => `YAAAY! Flora udah tahu pasti jawabannya IYA BANGET! 🌻 Sekarang buktikan seberapa mekar dan besar rasa cinta kamu ke ${state.hisName}?`,
    onEnter: () => {
      setCharacterMood('happy', 'Bunga-bunga bermekaran! 🌻✨');
      updateSliderDesc(document.getElementById('loveSlider').value);
    }
  },
  {
    stepId: 'step5',
    getText: () => `HOREEE! 🏆 Selamat! Kamu telah resmi dinyatakan LULUS sebagai Ratu Penjaga Taman Bunga Tercantik Se-Semesta dan Pemilik Sah Hati ${state.hisName}! Ini Sertifikat Kelulusan Resmimu... 📜✨`,
    onEnter: () => {
      setCharacterMood('happy', 'RESMI LULUS BUCIN! 📜🌻');
      playGardenFanfare();
      burstFlowers(45);
      setupCertificateStep();
    }
  },
  {
    stepId: 'step6',
    getText: () => `Dan sekarang tiba di QUEST TAMAN BUNGA TERAKHIR! 📸💐 Persembahkan buket bunga cinta & kirimkan PAP paling manis yang kamu suka langsung ke WhatsApp ${state.hisName}!`,
    onEnter: () => {
      setCharacterMood('happy', 'QUEST PAP TERAKHIR! 📸💕');
      playFairyChime();
      burstFlowers(30);
      setupPapStep();
    }
  }
];

function goToStep(stepIndex) {
  state.currentStep = stepIndex;

  document.querySelectorAll('.step-view').forEach(view => {
    view.classList.remove('active');
  });

  const stepObj = STEPS[stepIndex];
  if (!stepObj) return;

  const activeView = document.getElementById(stepObj.stepId);
  if (activeView) {
    activeView.classList.add('active');
  }

  stepObj.onEnter();
  typeDialogue(stepObj.getText());
}

// ============================================================
// 5. STEP 3: INTERAKSI IYA vs TIDAK (MEMBESAR & KABUR)
// ============================================================

const btnYesLove = document.getElementById('btnYesLove');
const btnNoLove = document.getElementById('btnNoLove');
const rejectionFeedback = document.getElementById('rejectionFeedback');

const REJECTION_DIALOGUES = [
  "Ehh kok mau klik nggak?! Bunga-bunganya layu tau! 🥀",
  "Hwaaa... jangan bohong dong! Flora nangis nih air terjun! 😭💦",
  "Tombol IYA-nya udah mekar raksasa seperti bunga matahari, klik yang itu aja! 👉👈",
  "Nggak bisa klik ini pokoknya! Flora sembunyikan tombolnya! 🌿",
  "Ayo ngaku aja, kamu pasti cinta mati kan? Jangan gengsi! 🌻",
  "Tombol 'Tidak' sudah layu dan kabur! Klik IYA sekarang! 🏃💨"
];

function resetLoveButtons() {
  btnYesLove.style.transform = 'scale(1)';
  btnNoLove.style.transform = 'scale(1)';
  btnNoLove.style.position = 'relative';
  btnNoLove.style.left = '0px';
  btnNoLove.style.top = '0px';
  btnNoLove.style.display = 'inline-block';
  rejectionFeedback.textContent = '';
}

function handleRejection() {
  state.rejectionCount++;
  playWiltSound();
  setCharacterMood('crying', 'Flora nangis... bunganya layu! 🥀💦');

  const yesScale = 1 + (state.rejectionCount * 0.28);
  const noScale = Math.max(0.2, 1 - (state.rejectionCount * 0.18));

  btnYesLove.style.transform = `scale(${yesScale})`;
  btnNoLove.style.transform = `scale(${noScale})`;

  const textIdx = Math.min(state.rejectionCount - 1, REJECTION_DIALOGUES.length - 1);
  rejectionFeedback.textContent = REJECTION_DIALOGUES[textIdx];

  if (state.rejectionCount >= 3) {
    const rx = (Math.random() - 0.5) * 160;
    const ry = (Math.random() - 0.5) * 60;
    btnNoLove.style.position = 'relative';
    btnNoLove.style.left = `${rx}px`;
    btnNoLove.style.top = `${ry}px`;
  }

  if (state.rejectionCount >= 6) {
    btnNoLove.style.display = 'none';
    rejectionFeedback.textContent = "Tombol 'Tidak' resmi layu! Sekarang hanya ada CINTA! 🌻🥰";
  }
}

btnNoLove.addEventListener('click', (e) => {
  e.preventDefault();
  handleRejection();
});

btnNoLove.addEventListener('mouseenter', () => {
  if (state.rejectionCount >= 2) handleRejection();
});

btnYesLove.addEventListener('click', () => {
  initAudio();
  playFairyChime();
  playGardenFanfare();
  burstFlowers(35);
  setCharacterMood('happy', 'Flora sangat gembira! 🌻✨');
  
  btnYesLove.style.transform = 'scale(1.15)';
  rejectionFeedback.textContent = "YAAAY! Flora tahu kamu cinta bangeeet! 🌻💕";

  setTimeout(() => goToStep(4), 1000);
});

// ============================================================
// 6. STEP 4: LOVE STATS & GARDEN VINE GROWTH
// ============================================================

const loveSlider = document.getElementById('loveSlider');
const meterValText = document.getElementById('meterValText');
const meterDescBadge = document.getElementById('meterDescBadge');
const vineFill = document.getElementById('vineFill');
const flowerBud = document.getElementById('flowerBud');
const btnMaxLove = document.getElementById('btnMaxLove');

function updateSliderDesc(val) {
  state.loveScore = parseInt(val, 10);
  playTypeBlip();

  const percent = Math.min(100, Math.round((state.loveScore / 1000) * 100));
  vineFill.style.width = `${percent}%`;
  
  const budWrapper = flowerBud ? flowerBud.parentElement : null;
  if (budWrapper) {
    budWrapper.style.left = `calc(${percent}% - 14px)`;
  }

  if (state.loveScore < 300) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Mekar harum seperti bunga melati! 🤍";
    if (flowerBud) flowerBud.src = 'assets/flower_dandelion.png';
  } else if (state.loveScore < 600) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Sebesar padang bunga matahari semesta! 🌻✨";
    if (flowerBud) flowerBud.src = 'assets/flower_jasmine.png';
  } else if (state.loveScore < 950) {
    meterValText.textContent = `${state.loveScore}%`;
    state.loveDescription = "Abadi seperti mawar terindah! 🌹💕";
    if (flowerBud) flowerBud.src = 'assets/flower_rose.png';
  } else {
    meterValText.textContent = `1000% (MAX!)`;
    state.loveDescription = "TAK TERHINGGA SAMPAI AKHIR HAYAT!! 🌻💥💖";
    if (flowerBud) flowerBud.src = 'assets/flower_bouquet.png';
  }
  meterDescBadge.textContent = `"${state.loveDescription}"`;
}

loveSlider.addEventListener('input', (e) => {
  updateSliderDesc(e.target.value);
});

btnMaxLove.addEventListener('click', () => {
  loveSlider.value = 1000;
  updateSliderDesc(1000);
  playGardenFanfare();
  burstFlowers(30);
});

// ============================================================
// 7. STEP 5 & 6: AMPLOP SURAT, SERTIFIKAT MODAL & PAP QUEST
// ============================================================

const envelopeWrapper = document.getElementById('envelopeWrapper');
const envelopeImg = document.getElementById('envelopeImg');
const btnOpenEnvelope = document.getElementById('btnOpenEnvelope');
const btnStep5Next = document.getElementById('btnStep5Next');
const certModal = document.getElementById('certModal');
const btnCloseCertModal = document.getElementById('btnCloseCertModal');
const btnCertModalNext = document.getElementById('btnCertModalNext');

function setupCertificateStep() {
  const her = (state.herName || 'Putri Bunga').trim();
  const his = (state.hisName || state.config.defaultHisName || 'Pangerannya').trim();

  const certHer = document.getElementById('certHerName');
  if (certHer) certHer.textContent = her;

  const certHis = document.getElementById('certHisName');
  if (certHis) certHis.textContent = his;

  const certDesc = document.getElementById('certDesc');
  if (certDesc) {
    certDesc.innerHTML = `
      Telah resmi dinobatkan sebagai <strong>Ratu Penjaga Taman Bunga Tercantik Se-Semesta</strong> dan Pemilik Sah Hati <strong>${his}</strong> dengan Tingkat Mekar Cinta: <strong>${state.loveDescription}</strong>!
    `;
  }
}

function openCertModal() {
  initAudio();
  playFairyChime();
  playGardenFanfare();
  burstFlowers(35);

  if (envelopeImg) {
    envelopeImg.src = 'assets/envelope_open.png';
    envelopeImg.style.transform = 'scale(1.1) rotate(2deg)';
    setTimeout(() => {
      if (envelopeImg) envelopeImg.style.transform = 'scale(1) rotate(0deg)';
    }, 280);
  }

  if (btnStep5Next) btnStep5Next.style.display = 'inline-block';
  if (btnOpenEnvelope) btnOpenEnvelope.innerHTML = '📜 BUKA SERTIFIKAT LAGI ✨';

  setupCertificateStep();

  setTimeout(() => {
    if (certModal) certModal.classList.add('open');
  }, 300);
}

if (envelopeWrapper) envelopeWrapper.addEventListener('click', openCertModal);
if (btnOpenEnvelope) btnOpenEnvelope.addEventListener('click', openCertModal);

if (btnCloseCertModal) {
  btnCloseCertModal.addEventListener('click', () => {
    if (certModal) certModal.classList.remove('open');
  });
}

if (btnCertModalNext) {
  btnCertModalNext.addEventListener('click', () => {
    if (certModal) certModal.classList.remove('open');
    goToStep(6);
  });
}

if (certModal) {
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) certModal.classList.remove('open');
  });
}

if (btnStep5Next) {
  btnStep5Next.addEventListener('click', () => {
    goToStep(6);
  });
}

function setupPapStep() {
  const his = (state.hisName || state.config.defaultHisName || 'Pangerannya').trim();
  const papQuestDesc = document.getElementById('papQuestDesc');
  if (papQuestDesc) {
    papQuestDesc.innerHTML = `
      Kirimkan Pap paling manis & cantik yang disukai <strong>${his}</strong> sekarang juga lewat WhatsApp! 📸🌻
    `;
  }
}

// Tombol Kirim Pap & Laporan Bunga ke WhatsApp
document.getElementById('btnSendPap').addEventListener('click', () => {
  initAudio();
  playGardenFanfare();
  burstFlowers(40);

  let phone = state.config.myWhatsAppNumber.replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }

  const herName = (state.herName || 'Bidadarimu').trim();
  const hisName = (state.hisName || state.config.defaultHisName || 'Sayang').trim();

  const greeting = hisName.toLowerCase().includes('sayang')
    ? `Halo ${hisName}! 🥰🌻`
    : `Halo ${hisName} sayang! 🥰🌻`;

  const textMessage = 
`💌 *LAPORAN RESMI TAMAN BUNGA CINTA* 🌻🌿
━━━━━━━━━━━━━━━━━━━━
• *DARI:* ${herName} 🤍
• *UNTUK:* ${hisName} 🌻
━━━━━━━━━━━━━━━━━━━━

${greeting}
Aku baru aja menyelesaikan petualangan di Taman Bunga Ajaib bareng Flora si Peri Bunga! 🌼✨

Berikut rangkuman jawaban cintaku:
✨ *Nama Cantik:* ${herName} 🤍
✨ *Sosok Matahariku:* ${hisName} 🌻
✨ *Apakah Aku Sangat Mencintaimu?:* IYA BANGET! 💖
✨ *Daya Mekar Cinta:* ${meterValText.textContent} (${state.loveDescription})

💐 *BUKET BUNGA SPESIAL:*
Aku persembahkan buket bunga melati suci, mawar abadi, dan bunga matahari ini khusus untukmu.

📸 *QUEST TERAKHIR:*
Sesuai perintah Peri Flora, ini PAP paling manis yang kamu suka spesial buat kamu... 💕👇`;

  // Auto copy ke clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textMessage).catch(() => {});
  }

  // Direct endpoint api.whatsapp.com tanpa 302 redirect
  const waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(textMessage)}`;
  window.open(waUrl, '_blank');
});

// ============================================================
// 8. STEP TRANSITIONS & BUTTON LISTENERS
// ============================================================

// Mulai Game (Otomatis nyalakan BGM)
document.getElementById('btnStartGame').addEventListener('click', () => {
  initAudio();
  startAutoPlayBgm();
  playFairyChime();
  burstFlowers(20);
  goToStep(1);
});

// Step 1 -> 2
document.getElementById('btnStep1Next').addEventListener('click', () => {
  initAudio();
  const input = document.getElementById('inputHerName');
  const val = input.value.trim();
  if (!val) {
    alert("Ketik namamu dulu yaa bidadari bunga! 🤍");
    input.focus();
    return;
  }
  state.herName = val;
  playFairyChime();
  goToStep(2);
});

document.getElementById('inputHerName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btnStep1Next').click();
});

// Step 2 -> 3
document.getElementById('btnStep2Next').addEventListener('click', () => {
  initAudio();
  const input = document.getElementById('inputHisName');
  const val = input.value.trim();
  if (!val) {
    alert("Ketik nama pacarmu dulu yaa! 🌻");
    input.focus();
    return;
  }
  state.hisName = val;
  playFairyChime();
  goToStep(3);
});

document.getElementById('inputHisName').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('btnStep2Next').click();
});

// Step 4 -> 5 (Love Meter -> Amplop Surat)
document.getElementById('btnStep4Next').addEventListener('click', () => {
  initAudio();
  playFairyChime();
  goToStep(5);
});

// Restart Game
document.getElementById('btnRestartGame').addEventListener('click', () => {
  goToStep(0);
});

// ============================================================
// 9. SETTINGS MODAL & AUDIO TOGGLE
// ============================================================

const configModal = document.getElementById('configModal');
const btnConfigToggle = document.getElementById('configToggle');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnSaveConfig = document.getElementById('btnSaveConfig');
const cfgWaNumber = document.getElementById('cfgWaNumber');
const cfgDefaultBoy = document.getElementById('cfgDefaultBoy');

function loadSavedConfig() {
  const saved = localStorage.getItem('pixel_taman_bunga_cfg');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.config = { ...state.config, ...parsed };
    } catch (e) {}
  }
  cfgWaNumber.value = state.config.myWhatsAppNumber;
  cfgDefaultBoy.value = state.config.defaultHisName;
}

btnConfigToggle.addEventListener('click', () => {
  initAudio();
  configModal.classList.add('open');
});

btnCloseModal.addEventListener('click', () => {
  configModal.classList.remove('open');
});

btnSaveConfig.addEventListener('click', () => {
  let phone = cfgWaNumber.value.trim().replace(/[^0-9]/g, '');
  if (phone.startsWith('0')) {
    phone = '62' + phone.substring(1);
  }
  const boy = cfgDefaultBoy.value.trim();

  if (phone) {
    state.config.myWhatsAppNumber = phone;
    cfgWaNumber.value = phone;
  }
  if (boy) state.config.defaultHisName = boy;

  localStorage.setItem('pixel_taman_bunga_cfg', JSON.stringify({
    myWhatsAppNumber: state.config.myWhatsAppNumber,
    defaultHisName: state.config.defaultHisName
  }));

  playFairyChime();
  alert("Pengaturan nomor WhatsApp berhasil disimpan! 💾🌻");
  configModal.classList.remove('open');
});

configModal.addEventListener('click', (e) => {
  if (e.target === configModal) configModal.classList.remove('open');
});

// Sound / Music Toggle Button
const soundToggleBtn = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');

soundToggleBtn.addEventListener('click', () => {
  initAudio();
  state.config.soundEnabled = !state.config.soundEnabled;
  soundIcon.textContent = state.config.soundEnabled ? '🔊' : '🔇';
  if (state.config.soundEnabled) {
    startAutoPlayBgm();
  } else {
    stopBgm();
  }
});

// Auto initialize audio on first user touch anywhere
window.addEventListener('pointerdown', () => {
  initAudio();
  if (!state.bgmPlaying && state.config.soundEnabled && state.currentStep > 0) {
    startAutoPlayBgm();
  }
}, { once: true });

// ============================================================
// INITIALIZATION
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
  loadSavedConfig();
  goToStep(0);
});
