/* ================================================================
   FOR JULIE ANN — script.js
   Vanilla JS. No build step. Organized into clearly commented
   sections. Edit CONFIG below to customize names/assets/messages.
   ================================================================ */

/* ================================================================
   1. CONFIGURATION  — the ONE place to edit names, assets, text
   ================================================================ */
const CONFIG = {
  JULIE_NAME: "Julie Ann",

  // ---- Music files (place in assets/music/) ----
  // Set any value to null if you don't have that track yet — the
  // app will simply skip music for that section without crashing.
  music: {
    dessert:     "assets/music/dessert.mp3",
    shopping:    "assets/music/shopping.mp3",
    expensive:   "assets/music/expensive.mp3",
    food:        "assets/music/food.mp3",
    apple:       "assets/music/apple.mp3",
    billionaire: "assets/music/billionaire.mp3",
    ending:      "assets/music/ending.mp3"
  },

  // ---- Final video (place in assets/video/) ----
  endingVideo: "assets/video/apology.mp4",

  // ---- Game messages — tweak freely ----
  messages: {
    dessertLines: [
      "you really do love dessert huh",
      "okay, one more.",
      "fine. one more."
    ],
    shoppingLines: [
      "just looking.",
      "…sure.",
      "definitely not buying anything.",
      "okay, maybe everything."
    ],
    expensiveReact: "why is everything so expensive 😭",
    bargainDiscoveryLines: ["wait…", "pinduoduo."],
    bargainHappyLine: "julie: much better.",
    orderStatusSteps: ["ORDER PLACED 📦", "WAITING…", "STILL WAITING…", "IT ARRIVED."],
    haulReveal: "LOOK WHAT I GOT.",
    haulHappy: "julie is happy.",
    appleLines: ["where did apple go?", "oh.", "there he is.", "apple has decided this is his game now."],
    billionaireWin: "JULIE HAS OFFICIALLY BEATEN THE BILLIONAIRES.",
    endingLines: [
      "You made it to the end.",
      "I know this doesn't fix what happened.",
      "But I wanted to make something just for you.",
      "I'm sorry, Julie.",
      "Really."
    ]
  },

  // ---- Colors mirror style.css but exposed here for quick reference ----
  colors: {
    pink: "#ff8fb3",
    pinkDeep: "#ff5c8a",
    blush: "#ffe3ec",
    cream: "#fff8f3"
  },

  // ---- Sticker categories & emoji sets (swap for real images in assets/stickers/ if desired) ----
  stickerCategories: {
    hearts:   ["❤️","💕","💗","💖","💘","🩷"],
    stars:    ["⭐","✨","🌟","💫"],
    flowers:  ["🌸","🌷","🌹","🌻","🌼"],
    bows:     ["🎀"],
    sparkles: ["✨","🎇","🎆"],
    faces:    ["🥰","😊","😳","🥹","😽"],
    food:     ["🍪","🍦","🍰","🧋"],
    drinks:   ["🧋","🥤","☕"],
    corgi:    ["🐶","🐾","🦴"],
    singapore:["🇸🇬","🦁","🏙️"],
    travel:   ["✈️","🧳","🗺️","📍"],
    shopping: ["🛍️","👜","💄","👗"]
  },

  // ---- Filters (name shown to user -> CSS class in style.css) ----
  filters: [
    { name: "Natural", cls: "filter-natural" },
    { name: "Warm", cls: "filter-warm" },
    { name: "Cool", cls: "filter-cool" },
    { name: "Soft", cls: "filter-soft" },
    { name: "Vintage", cls: "filter-vintage" },
    { name: "Film", cls: "filter-film" },
    { name: "Retro", cls: "filter-retro" },
    { name: "Grainy", cls: "filter-grainy" },
    { name: "Flash", cls: "filter-flash" },
    { name: "Faded", cls: "filter-faded" },
    { name: "Dreamy", cls: "filter-dreamy" },
    { name: "Night", cls: "filter-night" },
    { name: "Polaroid", cls: "filter-polaroid" },
    { name: "Disposable", cls: "filter-disposable" },
    { name: "High Contrast", cls: "filter-highcontrast" },
    { name: "Soft Glow", cls: "filter-glow" },
    { name: "Pink", cls: "filter-pink" },
    { name: "B&W", cls: "filter-bw" },
    { name: "Sepia", cls: "filter-sepia" }
  ],

  // ---- Frames (name shown to user -> CSS class in style.css) ----
  frames: [
    { name: "None", cls: "frame-none" },
    { name: "Classic", cls: "frame-classic" },
    { name: "White", cls: "frame-white" },
    { name: "Black", cls: "frame-black" },
    { name: "Pink", cls: "frame-pink" },
    { name: "Minimal", cls: "frame-minimal" },
    { name: "Film Strip", cls: "frame-filmstrip" },
    { name: "Polaroid", cls: "frame-polaroid" },
    { name: "Cute", cls: "frame-cute" },
    { name: "Heart", cls: "frame-heart" },
    { name: "Travel", cls: "frame-travel" },
    { name: "Date", cls: "frame-date" },
    { name: "Scrapbook", cls: "frame-scrapbook" }
  ],

  // ---- Layout options (photo counts supported) ----
  layoutOptions: [1, 2, 3, 4],

  // ---- Default trip names offered as suggestions (user can add more) ----
  suggestedTrips: ["Singapore 🇸🇬", "Japan 🇯🇵", "Dubai 🇦🇪", "Korea 🇰🇷"]
};

// Apply Julie's name to the home screen immediately
document.addEventListener("DOMContentLoaded", () => {
  const nameSpan = document.getElementById("homeNameSpan");
  if (nameSpan) nameSpan.textContent = CONFIG.JULIE_NAME;
});

/* ================================================================
   2. APP STATE
   ================================================================ */
const State = {
  currentScreen: "screen-home",
  dessertScore: 0,
  shoppingCart: [],
  bargainCart: [],
  bargainTotal: 0,
  foodScore: 0,
  foodBuffs: {},
  money: 1,
  billionairesBeaten: 0,
  // Photobooth
  selectedLayoutCount: 1,
  capturedPhotos: [],   // dataURLs, one per shot in current session
  currentShotIndex: 0,
  cameraStream: null,
  currentFacingMode: "user",
  activeFilterCls: "filter-natural",
  activeFrameCls: "frame-none",
  placedStickers: [],   // {id, emoji, x, y, scale, rotation, z}
  placedTexts: [],      // {id, text, x, y}
  finalComposedDataUrl: null,
  editorTab: "filters",
  stickerCat: "hearts",
  printFormat: "photo",
  // Album / IndexedDB
  db: null,
  albumPhotos: [],
  currentAlbumFilter: "all",
  currentViewerPhotoId: null,
  tripList: []
};

/* ================================================================
   3. SCREEN NAVIGATION
   ================================================================ */
function goToScreen(screenId) {
  const current = document.getElementById(State.currentScreen);
  const next = document.getElementById(screenId);
  if (!next) { console.warn("Missing screen:", screenId); return; }
  if (current) current.classList.remove("active");
  next.classList.add("active");
  State.currentScreen = screenId;
  window.scrollTo(0, 0);

  // Stop camera stream if we navigate away from camera screen
  if (screenId !== "screen-camera" && State.cameraStream) {
    stopCameraStream();
  }
}

// Wire up all elements with data-go attribute (simple back buttons etc.)
document.addEventListener("click", (e) => {
  const goEl = e.target.closest("[data-go]");
  if (goEl) {
    goToScreen(goEl.getAttribute("data-go"));
  }
});

/* ================================================================
   4. AMBIENT SPARKLE LAYER (purely cosmetic, low frequency)
   ================================================================ */
const SPARKLE_EMOJIS = ["✨", "💕", "🌸", "⭐", "🎀"];
function spawnSparkle() {
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "floaty-sparkle";
  el.textContent = SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
  el.style.left = Math.random() * 96 + "vw";
  el.style.fontSize = (12 + Math.random() * 14) + "px";
  const duration = 8 + Math.random() * 6;
  el.style.animationDuration = duration + "s";
  layer.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000 + 500);
}
setInterval(spawnSparkle, 2200);

/* ================================================================
   5. MUSIC SYSTEM
   ================================================================
   - One shared <audio> element, source swapped between levels.
   - Fades out old track / fades in new track.
   - Respects browser autoplay restrictions: if a play() promise
     rejects (no user gesture yet), we silently wait for the next
     user tap anywhere on the page to retry once.
   ================================================================ */
const MusicSystem = (() => {
  const audioEl = new Audio();
  audioEl.loop = true;
  audioEl.volume = 0.6;
  let currentKey = null;
  let muted = false;
  let pendingKey = null;
  let fadeInterval = null;

  function fadeTo(targetVolume, duration, onDone) {
    clearInterval(fadeInterval);
    const steps = 20;
    const startVol = audioEl.volume;
    const stepAmt = (targetVolume - startVol) / steps;
    let i = 0;
    fadeInterval = setInterval(() => {
      i++;
      audioEl.volume = Math.max(0, Math.min(1, startVol + stepAmt * i));
      if (i >= steps) {
        clearInterval(fadeInterval);
        if (onDone) onDone();
      }
    }, duration / steps);
  }

  function updateStatusLabel(label) {
    const statusEl = document.getElementById("musicStatus");
    if (statusEl) statusEl.textContent = label || "—";
  }

  function play(key) {
    const src = CONFIG.music[key];
    if (!src) { updateStatusLabel("no track"); return; } // missing asset: skip gracefully
    if (currentKey === key && !audioEl.paused) return;

    const sliderVol = parseFloat(document.getElementById("volumeSlider")?.value ?? "0.6");

    const switchTrack = () => {
      audioEl.src = src;
      audioEl.volume = 0;
      currentKey = key;
      const playPromise = audioEl.play();
      if (playPromise && playPromise.catch) {
        playPromise.then(() => {
          fadeTo(muted ? 0 : sliderVol, 700);
          updateStatusLabel(key);
        }).catch(() => {
          // Autoplay blocked — wait for a user gesture, then retry once.
          pendingKey = key;
          updateStatusLabel("tap to start music");
          const retry = () => {
            if (pendingKey) {
              const p = audioEl.play();
              if (p && p.then) {
                p.then(() => { fadeTo(muted ? 0 : sliderVol, 700); updateStatusLabel(pendingKey); pendingKey = null; }).catch(() => {});
              }
            }
            document.removeEventListener("touchstart", retry);
            document.removeEventListener("click", retry);
          };
          document.addEventListener("touchstart", retry, { once: true });
          document.addEventListener("click", retry, { once: true });
        });
      }
    };

    if (!audioEl.paused && audioEl.src) {
      fadeTo(0, 500, switchTrack);
    } else {
      switchTrack();
    }
  }

  function stop() {
    fadeTo(0, 500, () => { audioEl.pause(); currentKey = null; updateStatusLabel(""); });
  }

  function setMuted(val) {
    muted = val;
    const sliderVol = parseFloat(document.getElementById("volumeSlider")?.value ?? "0.6");
    audioEl.volume = muted ? 0 : sliderVol;
  }

  function setVolume(val) {
    if (!muted) audioEl.volume = val;
  }

  function isMuted() { return muted; }

  function duckForVideo() {
    fadeTo(0, 600, () => audioEl.pause());
  }

  return { play, stop, setMuted, setVolume, isMuted, duckForVideo };
})();

// Wire up mute + volume controls
document.getElementById("muteBtn")?.addEventListener("click", () => {
  const btn = document.getElementById("muteBtn");
  const newMuted = !MusicSystem.isMuted();
  MusicSystem.setMuted(newMuted);
  btn.textContent = newMuted ? "🔇" : "🔊";
});
document.getElementById("volumeSlider")?.addEventListener("input", (e) => {
  MusicSystem.setVolume(parseFloat(e.target.value));
});

/* ================================================================
   6. SMALL UTILITIES
   ================================================================ */
function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
function pick(arr) { return arr[randInt(0, arr.length - 1)]; }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function fmtMoney(n) {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: n < 100 ? 2 : 0, maximumFractionDigits: 2 });
}
function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
// Safe wrapper: run a function, never let it crash the app
function safe(fn) {
  try { return fn(); } catch (err) { console.error("Handled error:", err); return null; }
}

/* ================================================================
   7. HOME + GAME INTRO NAVIGATION
   ================================================================ */
document.getElementById("btnGoGame")?.addEventListener("click", () => {
  MusicSystem.stop();
  goToScreen("screen-game-intro");
});
document.getElementById("btnGoPhotobooth")?.addEventListener("click", () => {
  MusicSystem.stop();
  goToScreen("screen-photobooth-home");
});
document.getElementById("btnStartGame")?.addEventListener("click", () => {
  startLevelDessert();
});

/* ================================================================
   8. LEVEL 1 — DESSERT COLLECTOR
   ================================================================
   Falling emoji, player drags a basket left/right (touch or mouse)
   to catch them. Runs for a fixed short duration then auto-advances.
   ================================================================ */
const DESSERT_ITEMS = ["🍪", "🍦", "🍰"];
const DESSERT_GOAL = 14; // items to catch before level ends
let dessertLoopId = null;
let dessertSpawnId = null;
let dessertCaptionShown = [false, false, false];

function startLevelDessert() {
  goToScreen("screen-level-dessert");
  MusicSystem.play("dessert");
  State.dessertScore = 0;
  dessertCaptionShown = [false, false, false];
  document.getElementById("dessertScore").textContent = "0";
  document.getElementById("dessertCaption").textContent = "catch what you love 🍪";

  const stage = document.getElementById("dessertStage");
  // clear any leftover falling items from a previous run
  stage.querySelectorAll(".falling-item").forEach(el => el.remove());

  const catcher = document.getElementById("dessertCatcher");
  const stageRect = () => stage.getBoundingClientRect();

  // Drag-to-move catcher (touch + mouse)
  function moveCatcherTo(clientX) {
    const rect = stageRect();
    const pct = clamp(((clientX - rect.left) / rect.width) * 100, 6, 94);
    catcher.style.left = pct + "%";
  }
  function onPointerMove(e) {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    moveCatcherTo(x);
  }
  stage.onmousemove = onPointerMove;
  stage.ontouchmove = (e) => { onPointerMove(e); };
  stage.ontouchstart = (e) => { onPointerMove(e); };

  clearInterval(dessertSpawnId);
  clearInterval(dessertLoopId);

  dessertSpawnId = setInterval(() => {
    spawnDessertItem(stage);
  }, 550);

  // Collision check loop
  dessertLoopId = setInterval(() => {
    checkDessertCollisions(stage, catcher);
  }, 60);
}

function spawnDessertItem(stage) {
  if (State.dessertScore >= DESSERT_GOAL) return;
  const el = document.createElement("div");
  el.className = "falling-item";
  el.textContent = pick(DESSERT_ITEMS);
  el.style.left = rand(6, 90) + "%";
  const duration = rand(3.2, 4.6);
  el.style.animationDuration = duration + "s";
  el.dataset.caught = "0";
  stage.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000 + 100);
}

function checkDessertCollisions(stage, catcher) {
  const catcherRect = catcher.getBoundingClientRect();
  stage.querySelectorAll(".falling-item").forEach(item => {
    if (item.dataset.caught === "1") return;
    const r = item.getBoundingClientRect();
    const overlapX = Math.abs((r.left + r.width / 2) - (catcherRect.left + catcherRect.width / 2)) < 40;
    const overlapY = Math.abs(r.top - catcherRect.top) < 40;
    if (overlapX && overlapY) {
      item.dataset.caught = "1";
      State.dessertScore++;
      document.getElementById("dessertScore").textContent = State.dessertScore;
      popScoreText(stage, r.left, r.top, "+1");
      item.remove();

      // Milestone captions
      if (State.dessertScore >= 4 && !dessertCaptionShown[0]) {
        dessertCaptionShown[0] = true;
        setCaption("dessertCaption", pick(CONFIG.messages.dessertLines));
      }
      if (State.dessertScore >= 9 && !dessertCaptionShown[1]) {
        dessertCaptionShown[1] = true;
        setCaption("dessertCaption", "okay, one more.");
      }
      if (State.dessertScore >= DESSERT_GOAL) {
        dessertCaptionShown[2] = true;
        setCaption("dessertCaption", "fine. one more. ...okay that's it 🍰");
        endLevelDessert();
      }
    }
  });
}

function popScoreText(stage, clientX, clientY, text) {
  const stageRect = stage.getBoundingClientRect();
  const el = document.createElement("div");
  el.className = "catch-pop";
  el.textContent = text;
  el.style.left = (clientX - stageRect.left) + "px";
  el.style.top = (clientY - stageRect.top) + "px";
  stage.appendChild(el);
  setTimeout(() => el.remove(), 750);
}

function setCaption(elId, text) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.style.opacity = 0;
  setTimeout(() => { el.textContent = text; el.style.transition = "opacity 0.3s"; el.style.opacity = 1; }, 200);
}

function endLevelDessert() {
  clearInterval(dessertSpawnId);
  clearInterval(dessertLoopId);
  setTimeout(() => startLevelShopping(), 1600);
}

/* ================================================================
   9. LEVEL 2 — SHOPPING (Sephora / clothes)
   ================================================================ */
const SHOPPING_ITEMS = [
  { emoji: "💄", name: "Lip Tint", price: "$18" },
  { emoji: "🧴", name: "Serum", price: "$32" },
  { emoji: "👗", name: "Sundress", price: "$45" },
  { emoji: "👜", name: "Tote Bag", price: "$38" },
  { emoji: "🕶️", name: "Sunglasses", price: "$24" },
  { emoji: "💅", name: "Nail Set", price: "$14" },
  { emoji: "🧢", name: "Cap", price: "$20" },
  { emoji: "👠", name: "Heels", price: "$52" }
];

function startLevelShopping() {
  goToScreen("screen-level-shopping");
  MusicSystem.play("shopping");
  State.shoppingCart = [];
  document.getElementById("shoppingCount").textContent = "0";
  document.getElementById("btnShoppingNext").classList.add("hidden");
  setCaption("shoppingCaption", pick(CONFIG.messages.shoppingLines.slice(0, 2)));

  const grid = document.getElementById("shopGrid");
  grid.innerHTML = "";
  SHOPPING_ITEMS.forEach((item, idx) => {
    const card = document.createElement("button");
    card.className = "shop-item";
    card.innerHTML = `<span class="shop-emoji">${item.emoji}</span>
      <span class="shop-name">${item.name}</span>
      <span class="shop-price">${item.price}</span>`;
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
      if (card.classList.contains("selected")) {
        State.shoppingCart.push(idx);
      } else {
        State.shoppingCart = State.shoppingCart.filter(i => i !== idx);
      }
      document.getElementById("shoppingCount").textContent = State.shoppingCart.length;

      if (State.shoppingCart.length === 1) {
        setCaption("shoppingCaption", "…sure.");
      } else if (State.shoppingCart.length === 3) {
        setCaption("shoppingCaption", "definitely not buying anything.");
      } else if (State.shoppingCart.length >= 5) {
        setCaption("shoppingCaption", "okay, maybe everything.");
        document.getElementById("btnShoppingNext").classList.remove("hidden");
      }

      if (State.shoppingCart.length >= 2) {
        document.getElementById("btnShoppingNext").classList.remove("hidden");
      }
    });
    grid.appendChild(card);
  });
}

document.getElementById("btnShoppingNext")?.addEventListener("click", () => {
  startLevelExpensive();
});

/* ================================================================
   10. LEVEL 3 — THE EXPENSIVE COMPLAINT
   ================================================================
   Multi-phase sequence:
   A) regular expensive store -> B) reaction -> C) "pinduoduo" reveal
   -> D) bargain shopping -> E) order/wait -> F) haul reveal
   ================================================================ */
const EXPENSIVE_ITEMS = [
  { emoji: "👚", name: "Cute Top", price: 89 },
  { emoji: "👜", name: "Cute Bag", price: 240 },
  { emoji: "🎀", name: "Random Little Thing", price: 75 },
  { emoji: "👟", name: "Sneakers", price: 130 }
];
const BARGAIN_ITEMS = [
  { emoji: "👚", name: "\"Cute Top\"", price: 3.27 },
  { emoji: "💍", name: "Ring (x12 pack)", price: 4.81 },
  { emoji: "👜", name: "Bag-Shaped Bag", price: 6.92 },
  { emoji: "🧦", name: "Socks (x8)", price: 2.15 },
  { emoji: "💅", name: "Nail Stickers", price: 1.40 },
  { emoji: "🕶️", name: "Sunglasses", price: 3.60 },
  { emoji: "🎀", name: "Hair Clips (x20)", price: 2.99 },
  { emoji: "👗", name: "Dress (mystery size)", price: 5.55 }
];

function showPhase(...idsToShow) {
  ["expensivePhaseA","expensivePhaseB","expensivePhaseC","expensivePhaseD","expensivePhaseE","expensivePhaseF"]
    .forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.toggle("hidden", !idsToShow.includes(id));
    });
}

function startLevelExpensive() {
  goToScreen("screen-level-expensive");
  MusicSystem.play("expensive");
  showPhase("expensivePhaseA");

  const grid = document.getElementById("expensiveGrid");
  grid.innerHTML = "";
  EXPENSIVE_ITEMS.forEach(item => {
    const card = document.createElement("div");
    card.className = "shop-item selected";
    card.innerHTML = `<span class="shop-emoji">${item.emoji}</span>
      <span class="shop-name">${item.name}</span>
      <span class="shop-price">$${item.price}</span>`;
    grid.appendChild(card);
  });
}

document.getElementById("btnExpensiveReact")?.addEventListener("click", () => {
  const total = EXPENSIVE_ITEMS.reduce((s, i) => s + i.price, 0);
  showPhase("expensivePhaseB");
  document.getElementById("expensiveReactText").textContent =
    `${CONFIG.messages.expensiveReact} (total: $${total})`;
  setTimeout(() => {
    document.getElementById("btnWait").classList.remove("hidden");
  }, 1400);
});

document.getElementById("btnWait")?.addEventListener("click", () => {
  showPhase("expensivePhaseC");
});

document.getElementById("btnGoBargain")?.addEventListener("click", () => {
  startBargainShopping();
});

function startBargainShopping() {
  showPhase("expensivePhaseD");
  State.bargainCart = [];
  State.bargainTotal = 0;
  document.getElementById("bargainTotal").textContent = "$0.00";
  document.getElementById("btnPlaceOrder").classList.add("hidden");
  setCaption("shoppingCaption", "");

  const grid = document.getElementById("bargainGrid");
  grid.innerHTML = "";
  BARGAIN_ITEMS.forEach((item, idx) => {
    const card = document.createElement("button");
    card.className = "shop-item";
    card.innerHTML = `<span class="shop-emoji">${item.emoji}</span>
      <span class="shop-name">${item.name}</span>
      <span class="shop-price">$${item.price.toFixed(2)}</span>`;
    card.addEventListener("click", () => {
      card.classList.toggle("selected");
      if (card.classList.contains("selected")) {
        State.bargainCart.push(idx);
      } else {
        State.bargainCart = State.bargainCart.filter(i => i !== idx);
      }
      State.bargainTotal = State.bargainCart.reduce((s, i) => s + BARGAIN_ITEMS[i].price, 0);
      document.getElementById("bargainTotal").textContent = "$" + State.bargainTotal.toFixed(2);

      if (State.bargainCart.length === 1) {
        document.getElementById("bargainGrid").insertAdjacentHTML("afterend", "");
      }
      if (State.bargainCart.length >= 1) {
        document.getElementById("btnPlaceOrder").classList.remove("hidden");
      }
      if (State.bargainCart.length >= 5) {
        setCaption("shoppingCaption", CONFIG.messages.bargainHappyLine);
      }
    });
    grid.appendChild(card);
  });
}

document.getElementById("btnPlaceOrder")?.addEventListener("click", () => {
  runOrderSequence();
});

function runOrderSequence() {
  showPhase("expensivePhaseE");
  const steps = CONFIG.messages.orderStatusSteps;
  const statusEl = document.getElementById("orderStatusText");
  let i = 0;
  statusEl.textContent = steps[0];
  const interval = setInterval(() => {
    i++;
    if (i >= steps.length) {
      clearInterval(interval);
      setTimeout(() => showHaulReveal(), 900);
      return;
    }
    statusEl.textContent = steps[i];
    statusEl.style.animation = "none";
    void statusEl.offsetWidth; // restart animation
    statusEl.style.animation = "statusPulse 0.4s ease";
  }, 1100);
}

function showHaulReveal() {
  showPhase("expensivePhaseF");
  const reveal = document.getElementById("haulReveal");
  reveal.innerHTML = "";
  const items = State.bargainCart.length ? State.bargainCart.map(i => BARGAIN_ITEMS[i]) : [BARGAIN_ITEMS[0]];
  items.forEach((item, idx) => {
    const el = document.createElement("div");
    el.className = "haul-item";
    el.textContent = item.emoji;
    el.style.animationDelay = (idx * 0.15) + "s";
    reveal.appendChild(el);
  });
}

document.getElementById("btnAfterHaul")?.addEventListener("click", () => {
  startLevelFood();
});

/* ================================================================
   11. LEVEL 4 — FOOD & DRINK RUN (Singapore-inspired collector)
   ================================================================ */
const FOOD_ITEMS = [
  { emoji: "🧋", name: "CHAGEE", buff: "points" },
  { emoji: "🍵", name: "Miss Tea", buff: "speed" },
  { emoji: "🍗", name: "Wingstop", buff: "power" },
  { emoji: "🍟", name: "4Fingers", buff: "speedboost" },
  { emoji: "🍞", name: "Ya Kun Kaya Toast", buff: "energy" },
  { emoji: "🥔", name: "Salted Egg Chips", buff: "shield" }
];
const FOOD_GOAL = 16;
let foodSpawnId = null;
let foodLoopId = null;

function startLevelFood() {
  goToScreen("screen-level-food");
  MusicSystem.play("food");
  State.foodScore = 0;
  State.foodBuffs = {};
  document.getElementById("foodScore").textContent = "0";
  document.getElementById("buffBar").innerHTML = "";
  setCaption("foodCaption", "grab the good stuff 🧋");

  const stage = document.getElementById("foodStage");
  stage.querySelectorAll(".falling-item").forEach(el => el.remove());
  const runner = document.getElementById("foodCatcher");

  function moveCatcherTo(clientX) {
    const rect = stage.getBoundingClientRect();
    const pct = clamp(((clientX - rect.left) / rect.width) * 100, 6, 94);
    runner.style.left = pct + "%";
  }
  stage.onmousemove = (e) => moveCatcherTo(e.clientX);
  stage.ontouchmove = (e) => moveCatcherTo(e.touches[0].clientX);
  stage.ontouchstart = (e) => moveCatcherTo(e.touches[0].clientX);

  clearInterval(foodSpawnId);
  clearInterval(foodLoopId);
  foodSpawnId = setInterval(() => spawnFoodItem(stage), 500);
  foodLoopId = setInterval(() => checkFoodCollisions(stage, runner), 60);
}

function spawnFoodItem(stage) {
  if (State.foodScore >= FOOD_GOAL) return;
  const item = pick(FOOD_ITEMS);
  const el = document.createElement("div");
  el.className = "falling-item";
  el.textContent = item.emoji;
  el.dataset.buff = item.buff;
  el.dataset.name = item.name;
  el.style.left = rand(6, 90) + "%";
  const duration = rand(2.8, 4.2);
  el.style.animationDuration = duration + "s";
  stage.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, duration * 1000 + 100);
}

function checkFoodCollisions(stage, runner) {
  const runnerRect = runner.getBoundingClientRect();
  stage.querySelectorAll(".falling-item").forEach(item => {
    const r = item.getBoundingClientRect();
    const overlapX = Math.abs((r.left + r.width / 2) - (runnerRect.left + runnerRect.width / 2)) < 40;
    const overlapY = Math.abs(r.top - runnerRect.top) < 40;
    if (overlapX && overlapY) {
      State.foodScore++;
      document.getElementById("foodScore").textContent = State.foodScore;
      addBuffChip(item.dataset.name, item.dataset.buff);
      popScoreText(stage, r.left, r.top, "+1");
      item.remove();

      if (State.foodScore >= FOOD_GOAL) {
        clearInterval(foodSpawnId);
        clearInterval(foodLoopId);
        setCaption("foodCaption", "run's over — good haul 🥡");
        setTimeout(() => startLevelApple(), 1500);
      }
    }
  });
}

function addBuffChip(name, buff) {
  const bar = document.getElementById("buffBar");
  const chip = document.createElement("span");
  chip.className = "buff-chip";
  chip.textContent = `${name} +${buff}`;
  bar.appendChild(chip);
  // keep the buff bar short — remove oldest if too many
  while (bar.children.length > 4) bar.removeChild(bar.firstChild);
  setTimeout(() => chip.remove(), 2600);
}

/* ================================================================
   12. LEVEL 5 — FIND APPLE (the corgi)
   ================================================================ */
function startLevelApple() {
  goToScreen("screen-level-apple");
  MusicSystem.play("apple");
  document.getElementById("appleIntro").classList.remove("hidden");
  document.getElementById("appleStage").classList.add("hidden");
  document.getElementById("appleCaption").classList.add("hidden");
  document.getElementById("appleMsg").textContent = CONFIG.messages.appleLines[0];

  setTimeout(() => {
    document.getElementById("appleMsg").textContent = CONFIG.messages.appleLines[1]; // "oh."
    setTimeout(() => {
      document.getElementById("appleIntro").classList.add("hidden");
      document.getElementById("appleStage").classList.remove("hidden");
      document.getElementById("appleCaption").classList.remove("hidden");
      setupAppleFindStage();
    }, 1100);
  }, 1300);
}

function setupAppleFindStage() {
  const stage = document.getElementById("appleStage");
  stage.innerHTML = "";
  const decoySpots = ["🌳","🪴","🧺","📦","🪑","🎈"];

  // scatter decoys
  decoySpots.forEach(emoji => {
    const el = document.createElement("div");
    el.className = "apple-hidden-spot";
    el.textContent = emoji;
    el.style.left = rand(8, 85) + "%";
    el.style.top = rand(8, 82) + "%";
    stage.appendChild(el);
  });

  // place Apple somewhere random
  const apple = document.createElement("div");
  apple.className = "apple-corgi";
  apple.textContent = "🐶";
  apple.style.left = rand(15, 78) + "%";
  apple.style.top = rand(15, 72) + "%";
  apple.addEventListener("click", () => {
    document.getElementById("appleCaption").textContent = CONFIG.messages.appleLines[2]; // "there he is."
    apple.style.transition = "transform 0.3s ease";
    apple.style.transform = "scale(1.3)";
    setTimeout(() => {
      document.getElementById("appleCaption").textContent = CONFIG.messages.appleLines[3];
      setTimeout(() => startLevelBillionaires(), 1700);
    }, 900);
  }, { once: true });
  stage.appendChild(apple);
}

/* ================================================================
   13. LEVEL 6 — BEAT THE BILLIONAIRES
   ================================================================ */
const MONEY_MILESTONES = [100, 10000, 1000000, 100000000, 1000000000, 999999999999];
const RICH_CHARACTERS = ["Bezzy McBillion", "Elonora Musketeer", "Rich Uncle Pennybox", "Countess Von Cashflow"];
let billionaireIdx = 0;

function startLevelBillionaires() {
  goToScreen("screen-level-billionaires");
  MusicSystem.play("billionaire");
  State.money = 1;
  billionaireIdx = 0;
  document.getElementById("moneyCounter").textContent = fmtMoney(State.money);
  const list = document.getElementById("richList");
  list.innerHTML = "";
  RICH_CHARACTERS.forEach(name => {
    const line = document.createElement("div");
    line.id = "rich-" + name.replace(/\s/g, "");
    line.textContent = "richer than you: " + name;
    list.appendChild(line);
  });

  const btn = document.getElementById("btnTapMoney");
  btn.replaceWith(btn.cloneNode(true)); // clear old listeners on re-entry
  document.getElementById("btnTapMoney").addEventListener("click", onTapMoney);
}

function onTapMoney(e) {
  if (State.money >= MONEY_MILESTONES[MONEY_MILESTONES.length - 1]) return;

  // Multiplier grows so the count-up doesn't take forever, matching spec's rapid escalation
  const idx = billionaireIdx;
  const target = MONEY_MILESTONES[idx] || MONEY_MILESTONES[MONEY_MILESTONES.length - 1];
  const jump = Math.max(1, Math.floor((target - State.money) / 6)) || 1;
  State.money = Math.min(target, State.money + jump);
  document.getElementById("moneyCounter").textContent = fmtMoney(State.money);

  // floating +$ text
  const btn = document.getElementById("btnTapMoney");
  const rect = btn.getBoundingClientRect();
  const float = document.createElement("div");
  float.className = "money-float";
  float.textContent = "+" + fmtMoney(jump);
  float.style.position = "fixed";
  float.style.left = rect.left + rect.width / 2 + "px";
  float.style.top = rect.top + "px";
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 850);

  if (State.money >= target) {
    // mark a billionaire beaten
    if (RICH_CHARACTERS[idx]) {
      const el = document.getElementById("rich-" + RICH_CHARACTERS[idx].replace(/\s/g, ""));
      if (el) el.classList.add("rich-beaten");
    }
    billionaireIdx++;
    if (billionaireIdx >= MONEY_MILESTONES.length) {
      finishBillionaires();
    }
  }
}

function finishBillionaires() {
  document.getElementById("btnTapMoney").removeEventListener("click", onTapMoney);
  setCaption("moneyCounter", fmtMoney(State.money));
  const wrap = document.querySelector("#screen-level-billionaires .center-wrap");
  const celebrate = document.createElement("h2");
  celebrate.className = "msg-title";
  celebrate.style.marginTop = "20px";
  celebrate.textContent = CONFIG.messages.billionaireWin;
  wrap.appendChild(celebrate);

  // small celebration burst
  for (let i = 0; i < 14; i++) {
    setTimeout(() => spawnCelebrationConfetti(), i * 60);
  }

  setTimeout(() => beginEndingSequence(), 2600);
}

function spawnCelebrationConfetti() {
  const el = document.createElement("div");
  el.textContent = pick(["🎉","✨","💸","🎊"]);
  el.style.position = "fixed";
  el.style.left = rand(10, 90) + "vw";
  el.style.top = "-30px";
  el.style.fontSize = "26px";
  el.style.zIndex = 999;
  el.style.transition = "transform 1.6s ease-in, opacity 1.6s ease-in";
  document.body.appendChild(el);
  requestAnimationFrame(() => {
    el.style.transform = `translateY(${window.innerHeight + 60}px) rotate(${rand(-180,180)}deg)`;
    el.style.opacity = 0;
  });
  setTimeout(() => el.remove(), 1700);
}

/* ================================================================
   14. EMOTIONAL ENDING SEQUENCE
   ================================================================
   Tone shift: jokes stop, screen fades, lines appear one at a time,
   then ending music + video. No comedic text from here on.
   ================================================================ */
function beginEndingSequence() {
  goToScreen("screen-ending");
  MusicSystem.stop();

  const lineEl = document.getElementById("endingLine1");
  const lines = CONFIG.messages.endingLines;
  let i = 0;

  function showNextLine() {
    lineEl.classList.remove("show");
    setTimeout(() => {
      if (i >= lines.length) {
        // move on to ending song + video after the last line lingers
        setTimeout(() => {
          MusicSystem.play("ending");
          setTimeout(() => startEndingVideo(), 2200);
        }, 1800);
        return;
      }
      lineEl.textContent = lines[i];
      lineEl.classList.add("show");
      i++;
      setTimeout(showNextLine, 2600);
    }, i === 0 ? 400 : 700);
  }
  showNextLine();
}

function startEndingVideo() {
  goToScreen("screen-video");
  const video = document.getElementById("apologyVideo");
  const tapOverlay = document.getElementById("btnTapToWatch");

  video.src = CONFIG.endingVideo;
  video.onerror = () => {
    tapOverlay.textContent = "video not found — check assets/video/apology.mp4";
  };

  const playPromise = video.play();
  if (playPromise && playPromise.catch) {
    playPromise.then(() => {
      tapOverlay.classList.add("hidden");
    }).catch(() => {
      // Autoplay blocked - show tap-to-watch overlay (per spec, do not try to bypass this)
      tapOverlay.classList.remove("hidden");
    });
  }

  tapOverlay.addEventListener("click", () => {
    video.play().then(() => tapOverlay.classList.add("hidden")).catch(() => {});
  });
}

document.getElementById("btnBackHomeFromVideo")?.addEventListener("click", () => {
  const video = document.getElementById("apologyVideo");
  video.pause();
  MusicSystem.stop();
  goToScreen("screen-home");
});

/* ================================================================
   15. PHOTOBOOTH — HOME / NAVIGATION
   ================================================================ */
document.getElementById("btnOpenCamera")?.addEventListener("click", () => {
  goToScreen("screen-layout-picker");
});
document.getElementById("btnOpenAlbum")?.addEventListener("click", () => {
  goToScreen("screen-album");
  renderAlbum();
});

document.querySelectorAll(".layout-opt").forEach(btn => {
  btn.addEventListener("click", () => {
    State.selectedLayoutCount = parseInt(btn.dataset.count, 10);
    State.capturedPhotos = [];
    State.currentShotIndex = 0;
    goToScreen("screen-camera");
    startCameraStream();
  });
});

/* ================================================================
   16. CAMERA — real getUserMedia capture with countdown/flash
   ================================================================ */
async function startCameraStream(facingMode) {
  const video = document.getElementById("cameraVideo");
  const errorBox = document.getElementById("cameraError");
  const errorDetail = document.getElementById("cameraErrorDetail");
  errorBox.classList.add("hidden");

  stopCameraStream(); // ensure no duplicate stream

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    errorDetail.textContent = "this browser doesn't support camera access.";
    errorBox.classList.remove("hidden");
    return;
  }

  const mode = facingMode || State.currentFacingMode || "user";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: mode },
      audio: false
    });
    State.cameraStream = stream;
    State.currentFacingMode = mode;
    video.srcObject = stream;
    updateShotIndicator();
  } catch (err) {
    let msg = "something went wrong opening the camera.";
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      msg = "camera permission was denied. allow camera access in your browser settings, then try again.";
    } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
      msg = "no camera was found on this device.";
    } else if (err.name === "NotReadableError") {
      msg = "the camera is already in use by another app.";
    }
    errorDetail.textContent = msg;
    errorBox.classList.remove("hidden");
  }
}

function stopCameraStream() {
  if (State.cameraStream) {
    State.cameraStream.getTracks().forEach(t => t.stop());
    State.cameraStream = null;
  }
}

document.getElementById("btnRetryCamera")?.addEventListener("click", () => startCameraStream());

document.getElementById("btnSwitchCam")?.addEventListener("click", () => {
  const newMode = State.currentFacingMode === "user" ? "environment" : "user";
  startCameraStream(newMode);
});

function updateShotIndicator() {
  const el = document.getElementById("shotIndicator");
  if (State.selectedLayoutCount > 1) {
    el.textContent = `PHOTO ${State.currentShotIndex + 1}/${State.selectedLayoutCount}`;
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
}

let shutterBusy = false;
document.getElementById("btnShutter")?.addEventListener("click", () => {
  if (shutterBusy) return;
  runCaptureSequence();
});

function runCaptureSequence() {
  shutterBusy = true;
  const countdownEl = document.getElementById("countdownNum");
  const flashEl = document.getElementById("flashFlare");
  const sequence = ["Ready?", "3", "2", "1"];
  let i = 0;

  function step() {
    if (i < sequence.length) {
      countdownEl.textContent = sequence[i];
      countdownEl.style.animation = "none";
      void countdownEl.offsetWidth;
      countdownEl.style.animation = "countPulse 0.9s ease";
      i++;
      setTimeout(step, 700);
    } else {
      countdownEl.textContent = "";
      takePhoto();
      flashEl.classList.add("flash");
      setTimeout(() => flashEl.classList.remove("flash"), 400);
      const shotIndicator = document.getElementById("shotIndicator");
      shotIndicator.textContent = "PHOTO TAKEN";
      shotIndicator.classList.remove("hidden");

      setTimeout(() => {
        State.currentShotIndex++;
        if (State.currentShotIndex >= State.selectedLayoutCount) {
          shutterBusy = false;
          stopCameraStream();
          goToEditorWithPhotos();
        } else {
          updateShotIndicator();
          shutterBusy = false;
        }
      }, 700);
    }
  }
  step();
}

function takePhoto() {
  const video = document.getElementById("cameraVideo");
  const canvas = document.getElementById("captureCanvas");
  const w = video.videoWidth || 720;
  const h = video.videoHeight || 1280;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  // Mirror the image if using front camera, so it matches what the user saw
  if (State.currentFacingMode === "user") {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, w, h);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  State.capturedPhotos.push(dataUrl);
}

/* ================================================================
   17. EDITOR — composition, filters, frames, stickers, text
   ================================================================
   The editor renders the captured photo(s) inside a "composition"
   div. Filters/frames are applied as CSS classes for live preview.
   Stickers/text are absolutely-positioned DOM elements that are
   draggable, resizable (pinch or handle-drag) and rotatable via a
   two-finger twist approximation (simple drag-to-rotate handle).
   When the user hits "done", everything is flattened onto a single
   canvas to produce the final composed image (used by save/print/
   album so all edits are always included).
   ================================================================ */

function goToEditorWithPhotos() {
  State.activeFilterCls = "filter-natural";
  State.activeFrameCls = "frame-none";
  State.placedStickers = [];
  State.placedTexts = [];
  buildEditorComposition();
  buildFilterStrip();
  buildFrameStrip();
  buildStickerCategories();
  buildStickerStrip(State.stickerCat);
  switchEditorTab("filters");
  goToScreen("screen-editor");
}

function buildEditorComposition() {
  const wrap = document.getElementById("editorComposition");
  wrap.innerHTML = "";
  wrap.className = "editor-composition " + State.activeFrameCls;

  const count = State.capturedPhotos.length;
  // Layout container: for multi-photo, stack vertically as a strip (per spec examples)
  const inner = document.createElement("div");
  inner.id = "compInner";
  inner.style.display = "flex";
  inner.style.flexDirection = count > 1 ? "column" : "row";
  inner.style.gap = count > 1 ? "4px" : "0";

  State.capturedPhotos.forEach(dataUrl => {
    const img = document.createElement("img");
    img.src = dataUrl;
    img.className = "comp-photo " + State.activeFilterCls;
    img.style.width = "260px";
    img.style.height = count > 1 ? (260 / (count === 2 ? 1.3 : count === 3 ? 1 : 1) ) + "px" : "340px";
    if (count > 1) img.style.height = "150px";
    inner.appendChild(img);
  });

  wrap.appendChild(inner);
  wrap.style.width = "260px";

  // sticker/text layer sits on top, absolutely positioned relative to wrap
  const overlay = document.createElement("div");
  overlay.id = "editorOverlay";
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  wrap.appendChild(overlay);
}

function applyFilterToComposition(cls) {
  State.activeFilterCls = cls;
  document.querySelectorAll("#editorComposition .comp-photo").forEach(img => {
    img.className = "comp-photo " + cls;
  });
}
function applyFrameToComposition(cls) {
  State.activeFrameCls = cls;
  const wrap = document.getElementById("editorComposition");
  wrap.className = "editor-composition " + cls;
}

function buildFilterStrip() {
  const strip = document.getElementById("filterStrip");
  strip.innerHTML = "";
  CONFIG.filters.forEach((f, idx) => {
    const el = document.createElement("div");
    el.className = "filter-thumb" + (idx === 0 ? " active" : "");
    el.innerHTML = `<div class="filter-thumb-preview ${f.cls}" style="background-image:url('${State.capturedPhotos[0] || ""}')"></div><span>${f.name}</span>`;
    el.addEventListener("click", () => {
      strip.querySelectorAll(".filter-thumb").forEach(t => t.classList.remove("active"));
      el.classList.add("active");
      applyFilterToComposition(f.cls);
    });
    strip.appendChild(el);
  });
}

function buildFrameStrip() {
  const strip = document.getElementById("frameStrip");
  strip.innerHTML = "";
  CONFIG.frames.forEach((f, idx) => {
    const el = document.createElement("div");
    el.className = "frame-thumb" + (idx === 0 ? " active" : "");
    el.innerHTML = `<div class="frame-thumb-preview ${f.cls}"></div><span>${f.name}</span>`;
    el.addEventListener("click", () => {
      strip.querySelectorAll(".frame-thumb").forEach(t => t.classList.remove("active"));
      el.classList.add("active");
      applyFrameToComposition(f.cls);
    });
    strip.appendChild(el);
  });
}

function buildStickerCategories() {
  const wrap = document.getElementById("stickerCategories");
  wrap.innerHTML = "";
  Object.keys(CONFIG.stickerCategories).forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "sticker-cat-btn" + (cat === State.stickerCat ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      State.stickerCat = cat;
      wrap.querySelectorAll(".sticker-cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      buildStickerStrip(cat);
    });
    wrap.appendChild(btn);
  });
}

function buildStickerStrip(cat) {
  const strip = document.getElementById("stickerStrip");
  strip.innerHTML = "";
  (CONFIG.stickerCategories[cat] || []).forEach(emoji => {
    const btn = document.createElement("button");
    btn.className = "sticker-pick";
    btn.textContent = emoji;
    btn.addEventListener("click", () => addStickerToComposition(emoji));
    strip.appendChild(btn);
  });
}

/* ---- Editor tabs ---- */
document.querySelectorAll(".editor-tab").forEach(tab => {
  tab.addEventListener("click", () => switchEditorTab(tab.dataset.tab));
});
function switchEditorTab(tabName) {
  State.editorTab = tabName;
  document.querySelectorAll(".editor-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tabName));
  document.getElementById("panelFilters").classList.toggle("hidden", tabName !== "filters");
  document.getElementById("panelFrames").classList.toggle("hidden", tabName !== "frames");
  document.getElementById("panelStickers").classList.toggle("hidden", tabName !== "stickers");
  document.getElementById("panelText").classList.toggle("hidden", tabName !== "text");
}

/* ---- Stickers: add, drag, pinch-resize, rotate, delete, layering ---- */
let stickerZCounter = 10;

function addStickerToComposition(emoji) {
  const overlay = document.getElementById("editorOverlay");
  const id = uid();
  const data = { id, emoji, x: 50, y: 50, scale: 1, rotation: 0, z: ++stickerZCounter };
  State.placedStickers.push(data);

  const el = document.createElement("div");
  el.className = "sticker-el";
  el.id = "sticker-" + id;
  el.textContent = emoji;
  el.style.left = data.x + "%";
  el.style.top = data.y + "%";
  el.style.zIndex = data.z;
  overlay.appendChild(el);
  makeStickerInteractive(el, data);
  selectSticker(el);
}

function selectSticker(el) {
  document.querySelectorAll(".sticker-el, .text-el").forEach(s => {
    s.classList.remove("active-sticker");
    const del = s.querySelector(".sticker-del-btn");
    if (del) del.remove();
  });
  el.classList.add("active-sticker");
  const delBtn = document.createElement("div");
  delBtn.className = "sticker-del-btn";
  delBtn.textContent = "✕";
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = el.id.replace("sticker-", "").replace("text-", "");
    State.placedStickers = State.placedStickers.filter(s => s.id !== id);
    State.placedTexts = State.placedTexts.filter(t => t.id !== id);
    el.remove();
  });
  el.appendChild(delBtn);
}

function makeStickerInteractive(el, data) {
  const overlay = document.getElementById("editorOverlay");
  let dragging = false;
  let startX, startY, origX, origY;
  let initialPinchDist = null;
  let initialScale = data.scale;
  let initialAngle = null;
  let initialRotation = data.rotation;

  function applyTransform() {
    el.style.left = data.x + "%";
    el.style.top = data.y + "%";
    el.style.transform = `translate(-50%,-50%) scale(${data.scale}) rotate(${data.rotation}deg)`;
    el.style.zIndex = data.z;
  }
  applyTransform();

  function bringToFront() {
    data.z = ++stickerZCounter;
    el.style.zIndex = data.z;
  }

  function pointFromEvent(e) {
    if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }
  function distBetween(t1, t2) {
    return Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
  }
  function angleBetween(t1, t2) {
    return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180 / Math.PI;
  }

  function onStart(e) {
    e.stopPropagation();
    selectSticker(el);
    bringToFront();
    const overlayRect = overlay.getBoundingClientRect();

    if (e.touches && e.touches.length === 2) {
      initialPinchDist = distBetween(e.touches[0], e.touches[1]);
      initialScale = data.scale;
      initialAngle = angleBetween(e.touches[0], e.touches[1]);
      initialRotation = data.rotation;
      dragging = false;
    } else {
      const p = pointFromEvent(e);
      dragging = true;
      startX = p.x; startY = p.y;
      origX = data.x; origY = data.y;
    }

    document.addEventListener("mousemove", onMove);
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
  }

  function onMove(e) {
    const overlayRect = overlay.getBoundingClientRect();
    if (e.touches && e.touches.length === 2 && initialPinchDist !== null) {
      e.preventDefault();
      const newDist = distBetween(e.touches[0], e.touches[1]);
      data.scale = clamp(initialScale * (newDist / initialPinchDist), 0.4, 4);
      const newAngle = angleBetween(e.touches[0], e.touches[1]);
      data.rotation = initialRotation + (newAngle - initialAngle);
      applyTransform();
    } else if (dragging) {
      if (e.touches) e.preventDefault();
      const p = pointFromEvent(e);
      const dxPct = ((p.x - startX) / overlayRect.width) * 100;
      const dyPct = ((p.y - startY) / overlayRect.height) * 100;
      data.x = clamp(origX + dxPct, 5, 95);
      data.y = clamp(origY + dyPct, 5, 95);
      applyTransform();
    }
  }

  function onEnd() {
    dragging = false;
    initialPinchDist = null;
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("touchmove", onMove);
    document.removeEventListener("mouseup", onEnd);
    document.removeEventListener("touchend", onEnd);
  }

  el.addEventListener("mousedown", onStart);
  el.addEventListener("touchstart", onStart, { passive: true });

  // Simple double-tap/double-click to send backward one layer
  let lastTap = 0;
  el.addEventListener("click", () => {
    const now = Date.now();
    if (now - lastTap < 350) {
      data.z = Math.max(1, data.z - 5);
      el.style.zIndex = data.z;
    }
    lastTap = now;
  });
}

/* ---- Text captions ---- */
document.getElementById("btnAddText")?.addEventListener("click", () => {
  const input = document.getElementById("textInput");
  const text = input.value.trim();
  if (!text) return;
  const overlay = document.getElementById("editorOverlay");
  const id = uid();
  const data = { id, text, x: 50, y: 80, scale: 1, rotation: 0, z: ++stickerZCounter };
  State.placedTexts.push(data);

  const el = document.createElement("div");
  el.className = "text-el";
  el.id = "text-" + id;
  el.textContent = text;
  overlay.appendChild(el);
  makeStickerInteractive(el, data);
  selectSticker(el);
  input.value = "";
});

/* ---- Retake / Done ---- */
document.getElementById("btnRetake")?.addEventListener("click", () => {
  State.capturedPhotos = [];
  State.currentShotIndex = 0;
  goToScreen("screen-camera");
  startCameraStream();
});

document.getElementById("btnDoneEditing")?.addEventListener("click", () => {
  composeAndShowResult();
});

/* ================================================================
   18. FLATTEN COMPOSITION TO FINAL IMAGE (canvas)
   ================================================================
   Draws photo(s) + filter (via canvas filter property) + frame
   border + stickers + text onto one canvas so every downstream
   action (save/print/album) uses the exact same final image.
   ================================================================ */
const FILTER_CANVAS_MAP = {
  "filter-natural": "none",
  "filter-warm": "sepia(0.15) saturate(1.3) hue-rotate(-8deg) brightness(1.05)",
  "filter-cool": "saturate(1.1) hue-rotate(15deg) brightness(1.02) contrast(1.05)",
  "filter-soft": "brightness(1.08) contrast(0.92) saturate(0.95) blur(1px)",
  "filter-vintage": "sepia(0.35) contrast(0.9) brightness(1.05) saturate(0.85)",
  "filter-film": "contrast(1.1) saturate(0.85) brightness(0.98) sepia(0.12)",
  "filter-retro": "saturate(1.4) contrast(1.15) hue-rotate(-5deg) brightness(0.95)",
  "filter-grainy": "contrast(1.2) brightness(0.95) saturate(0.9)",
  "filter-flash": "brightness(1.35) contrast(1.1) saturate(1.1)",
  "filter-faded": "brightness(1.1) contrast(0.75) saturate(0.6)",
  "filter-dreamy": "brightness(1.15) contrast(0.85) saturate(1.1) blur(1.5px)",
  "filter-night": "brightness(0.75) contrast(1.2) saturate(0.8) hue-rotate(10deg)",
  "filter-polaroid": "sepia(0.2) contrast(1.05) brightness(1.1) saturate(0.9)",
  "filter-disposable": "contrast(1.25) saturate(1.3) brightness(1.05) hue-rotate(-3deg)",
  "filter-highcontrast": "contrast(1.5) saturate(1.1)",
  "filter-glow": "brightness(1.2) contrast(0.9) blur(1.2px) saturate(1.05)",
  "filter-pink": "saturate(1.2) hue-rotate(-15deg) brightness(1.08)",
  "filter-bw": "grayscale(1) contrast(1.1)",
  "filter-sepia": "sepia(0.75) contrast(1.05)"
};
const FRAME_COLOR_MAP = {
  "frame-none": null,
  "frame-classic": { color: "#ffffff", width: 28 },
  "frame-white": { color: "#ffffff", width: 40 },
  "frame-black": { color: "#1a1a1a", width: 32 },
  "frame-pink": { color: "#ff5c8a", width: 32 },
  "frame-minimal": { color: "#ffffff", width: 8 },
  "frame-filmstrip": { color: "#111111", width: 20 },
  "frame-polaroid": { color: "#ffffff", width: 28, bottomExtra: 70 },
  "frame-cute": { color: "#ffc2d6", width: 24 },
  "frame-heart": { color: "#ff8fb3", width: 28 },
  "frame-travel": { color: "#d5f2e3", width: 28 },
  "frame-date": { color: "#fff3c4", width: 28 },
  "frame-scrapbook": { color: "#e7d9ff", width: 32 }
};

async function composeAndShowResult() {
  const OUT_W = 900; // base output width per photo tile
  const count = State.capturedPhotos.length;
  const tileH = 1100;
  const gap = count > 1 ? 12 : 0;
  const totalH = count > 1 ? (tileH * count) + gap * (count - 1) : tileH;

  const frame = FRAME_COLOR_MAP[State.activeFrameCls];
  const frameW = frame ? frame.width * 3 : 0;
  const frameBottomExtra = frame && frame.bottomExtra ? frame.bottomExtra * 3 : 0;

  const canvas = document.createElement("canvas");
  canvas.width = OUT_W + frameW * 2;
  canvas.height = totalH + frameW * 2 + frameBottomExtra;
  const ctx = canvas.getContext("2d");

  // frame background
  if (frame) {
    ctx.fillStyle = frame.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // draw each photo tile with filter applied
  const images = await Promise.all(State.capturedPhotos.map(loadImage));
  ctx.filter = FILTER_CANVAS_MAP[State.activeFilterCls] || "none";
  images.forEach((img, idx) => {
    const y = frameW + idx * (tileH + gap);
    drawImageCover(ctx, img, frameW, y, OUT_W, tileH);
  });
  ctx.filter = "none";

  // draw stickers (scaled from editor overlay % coords to canvas px)
  const compEl = document.getElementById("editorComposition");
  const compRect = compEl.getBoundingClientRect();
  const scaleX = (OUT_W) / compRect.width;
  const scaleY = (totalH) / compRect.height;

  State.placedStickers.forEach(s => {
    const px = frameW + (s.x / 100) * OUT_W;
    const py = frameW + (s.y / 100) * totalH;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((s.rotation || 0) * Math.PI / 180);
    ctx.scale(s.scale, s.scale);
    ctx.font = "64px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(s.emoji, 0, 0);
    ctx.restore();
  });

  State.placedTexts.forEach(t => {
    const px = frameW + (t.x / 100) * OUT_W;
    const py = frameW + (t.y / 100) * totalH;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate((t.rotation || 0) * Math.PI / 180);
    ctx.scale(t.scale, t.scale);
    ctx.font = "bold 42px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 8;
    ctx.fillText(t.text, 0, 0);
    ctx.restore();
  });

  const finalUrl = canvas.toDataURL("image/jpeg", 0.92);
  State.finalComposedDataUrl = finalUrl;
  document.getElementById("resultImage").src = finalUrl;
  goToScreen("screen-result");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawImageCover(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sy = 0;
    sx = (img.width - sw) / 2;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/* ================================================================
   19. RESULT SCREEN ACTIONS — save / print / add to album / retake
   ================================================================ */
document.getElementById("btnSave")?.addEventListener("click", () => {
  safe(() => {
    const link = document.createElement("a");
    link.href = State.finalComposedDataUrl;
    link.download = `julie-photobooth-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
});

document.getElementById("btnPrint")?.addEventListener("click", () => {
  goToScreen("screen-print");
  buildPrintPreview("photo");
});

document.getElementById("btnAddToAlbum")?.addEventListener("click", () => {
  addPhotoToAlbum(State.finalComposedDataUrl);
});

document.getElementById("btnRetakeFromResult")?.addEventListener("click", () => {
  State.capturedPhotos = [];
  State.currentShotIndex = 0;
  goToScreen("screen-camera");
  startCameraStream();
});
document.getElementById("btnHomeFromResult")?.addEventListener("click", () => {
  goToScreen("screen-home");
});

/* ================================================================
   20. PRINT — canvas prepared at correct aspect ratio + native print
   ================================================================ */
const PRINT_FORMATS = {
  strip:  { w: 2, h: 6 },
  photo:  { w: 4, h: 6 },
  square: { w: 4, h: 4 }
};

document.querySelectorAll(".print-opt").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".print-opt").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    buildPrintPreview(btn.dataset.format);
  });
});

function buildPrintPreview(format) {
  State.printFormat = format;
  document.querySelectorAll(".print-opt").forEach(b => b.classList.toggle("active", b.dataset.format === format));

  const dims = PRINT_FORMATS[format];
  const DPI = 150;
  const canvas = document.getElementById("printCanvas");
  canvas.width = dims.w * DPI;
  canvas.height = dims.h * DPI;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const note = document.getElementById("printFallbackNote");
  const canNativePrint = typeof window.print === "function";
  note.textContent = canNativePrint
    ? "this opens your device's print/share sheet."
    : "printing isn't supported in this browser — use save, then print from your photos app.";

  if (!State.finalComposedDataUrl) return;
  loadImage(State.finalComposedDataUrl).then(img => {
    if (format === "strip") {
      // tile the same photo a few times down a 2x6 strip, classic photobooth style
      const tileH = canvas.height / 3;
      for (let i = 0; i < 3; i++) {
        drawImageCover(ctx, img, 10, i * tileH + 10, canvas.width - 20, tileH - 20);
      }
    } else {
      drawImageCover(ctx, img, 0, 0, canvas.width, canvas.height);
    }
  }).catch(() => {
    note.textContent = "couldn't load the image for printing. try saving it instead.";
  });
}

document.getElementById("btnDoPrint")?.addEventListener("click", () => {
  safe(() => {
    const canvas = document.getElementById("printCanvas");
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    if (typeof window.print !== "function") {
      document.getElementById("printFallbackNote").textContent =
        "printing isn't supported here — save the photo and print it from your photos app instead.";
      return;
    }
    // Open a print-friendly window with just the image, sized to the page
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      document.getElementById("printFallbackNote").textContent =
        "pop-up blocked — allow pop-ups for this site to print, or use save instead.";
      return;
    }
    const dims = PRINT_FORMATS[State.printFormat];
    printWindow.document.write(`
      <html><head><title>Print</title>
      <style>
        @page { size: ${dims.w}in ${dims.h}in; margin: 0; }
        html,body { margin:0; padding:0; }
        img { width:100%; height:100%; object-fit:cover; display:block; }
      </style>
      </head><body><img src="${dataUrl}" onload="window.print();"></body></html>
    `);
    printWindow.document.close();
  });
});

/* ================================================================
   21. ALBUM — IndexedDB persistent storage
   ================================================================ */
const DB_NAME = "julieAppDB";
const DB_VERSION = 1;
const STORE_PHOTOS = "photos";
const STORE_TRIPS = "trips";

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("IndexedDB not supported"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_PHOTOS)) {
        const store = db.createObjectStore(STORE_PHOTOS, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("trip", "trip");
      }
      if (!db.objectStoreNames.contains(STORE_TRIPS)) {
        db.createObjectStore(STORE_TRIPS, { keyPath: "name" });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function initDatabase() {
  try {
    State.db = await openDatabase();
    await loadAllTrips();
  } catch (err) {
    console.error("IndexedDB unavailable:", err);
    State.db = null; // Album will show a graceful message instead of crashing
  }
}

function dbTransaction(storeName, mode) {
  return State.db.transaction(storeName, mode).objectStore(storeName);
}

function addPhotoToAlbum(dataUrl) {
  if (!State.db) {
    alert("photo storage isn't available on this browser, so this can't be saved to the album. you can still use Save to download it.");
    return;
  }
  const record = {
    id: uid(),
    dataUrl,
    createdAt: Date.now(),
    trip: "none",
    caption: ""
  };
  try {
    const store = dbTransaction(STORE_PHOTOS, "readwrite");
    const req = store.add(record);
    req.onsuccess = () => {
      showAlbumSavedToast();
    };
    req.onerror = () => {
      alert("couldn't save this photo — your device storage might be full.");
    };
  } catch (err) {
    alert("couldn't save this photo right now.");
  }
}

function showAlbumSavedToast() {
  const btn = document.getElementById("btnAddToAlbum");
  const original = btn.textContent;
  btn.textContent = "✓ added!";
  setTimeout(() => { btn.textContent = original; }, 1400);
}

function loadAllTrips() {
  return new Promise((resolve) => {
    if (!State.db) { resolve([]); return; }
    const store = dbTransaction(STORE_TRIPS, "readonly");
    const req = store.getAll();
    req.onsuccess = () => {
      const custom = req.result.map(t => t.name);
      State.tripList = Array.from(new Set([...CONFIG.suggestedTrips, ...custom]));
      resolve(State.tripList);
    };
    req.onerror = () => resolve([]);
  });
}

function saveTripName(name) {
  return new Promise((resolve) => {
    if (!State.db) { resolve(); return; }
    const store = dbTransaction(STORE_TRIPS, "readwrite");
    store.put({ name });
    resolve();
  });
}

function loadAlbumPhotos() {
  return new Promise((resolve) => {
    if (!State.db) { resolve([]); return; }
    const store = dbTransaction(STORE_PHOTOS, "readonly");
    const req = store.getAll();
    req.onsuccess = () => {
      const photos = req.result.sort((a, b) => b.createdAt - a.createdAt); // newest first
      resolve(photos);
    };
    req.onerror = () => resolve([]);
  });
}

async function renderAlbum() {
  const grid = document.getElementById("albumGrid");
  const emptyMsg = document.getElementById("albumEmptyMsg");

  if (!State.db) {
    grid.innerHTML = "";
    emptyMsg.textContent = "photo storage isn't available in this browser.";
    emptyMsg.classList.remove("hidden");
    return;
  }

  State.albumPhotos = await loadAlbumPhotos();
  renderTripFilters();

  const filtered = State.currentAlbumFilter === "all"
    ? State.albumPhotos
    : State.albumPhotos.filter(p => p.trip === State.currentAlbumFilter);

  grid.innerHTML = "";
  if (filtered.length === 0) {
    emptyMsg.textContent = "no photos yet — go take some 📸";
    emptyMsg.classList.remove("hidden");
  } else {
    emptyMsg.classList.add("hidden");
    filtered.forEach(photo => {
      const thumb = document.createElement("div");
      thumb.className = "album-thumb";
      const img = document.createElement("img");
      img.src = photo.dataUrl;
      img.loading = "lazy";
      img.alt = photo.caption || "photobooth photo";
      thumb.appendChild(img);
      thumb.addEventListener("click", () => openPhotoViewer(photo.id));
      grid.appendChild(thumb);
    });
  }
}

function renderTripFilters() {
  const row = document.getElementById("tripFilterRow");
  row.innerHTML = `<button class="trip-chip ${State.currentAlbumFilter === "all" ? "active" : ""}" data-trip="all">all</button>`;
  State.tripList.forEach(trip => {
    const chip = document.createElement("button");
    chip.className = "trip-chip" + (State.currentAlbumFilter === trip ? " active" : "");
    chip.textContent = trip;
    chip.dataset.trip = trip;
    row.appendChild(chip);
  });
  row.querySelectorAll(".trip-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      State.currentAlbumFilter = chip.dataset.trip;
      renderAlbum();
    });
  });
}

document.getElementById("btnNewTrip")?.addEventListener("click", () => {
  document.getElementById("modalNewTrip").classList.remove("hidden");
});
document.getElementById("btnCancelTrip")?.addEventListener("click", () => {
  document.getElementById("modalNewTrip").classList.add("hidden");
});
document.getElementById("btnConfirmTrip")?.addEventListener("click", async () => {
  const input = document.getElementById("newTripName");
  const name = input.value.trim();
  if (name) {
    await saveTripName(name);
    await loadAllTrips();
    renderTripFilters();
  }
  input.value = "";
  document.getElementById("modalNewTrip").classList.add("hidden");
});

/* ---- Photo viewer (fullscreen) ---- */
async function openPhotoViewer(photoId) {
  const photo = State.albumPhotos.find(p => p.id === photoId);
  if (!photo) return;
  State.currentViewerPhotoId = photoId;

  document.getElementById("viewerImage").src = photo.dataUrl;
  document.getElementById("viewerCaption").value = photo.caption || "";
  document.getElementById("viewerDate").textContent = fmtDate(photo.createdAt);

  const tripSelect = document.getElementById("viewerTripSelect");
  tripSelect.innerHTML = `<option value="none">no trip</option>` +
    State.tripList.map(t => `<option value="${t}">${t}</option>`).join("");
  tripSelect.value = photo.trip || "none";

  goToScreen("screen-photo-viewer");
}

document.getElementById("viewerCaption")?.addEventListener("change", (e) => {
  updateCurrentPhoto({ caption: e.target.value.trim() });
});
document.getElementById("viewerTripSelect")?.addEventListener("change", (e) => {
  updateCurrentPhoto({ trip: e.target.value });
});

function updateCurrentPhoto(fields) {
  if (!State.db || !State.currentViewerPhotoId) return;
  const store = dbTransaction(STORE_PHOTOS, "readwrite");
  const getReq = store.get(State.currentViewerPhotoId);
  getReq.onsuccess = () => {
    const record = getReq.result;
    if (!record) return;
    Object.assign(record, fields);
    store.put(record);
  };
}

document.getElementById("btnViewerDownload")?.addEventListener("click", () => {
  const photo = State.albumPhotos.find(p => p.id === State.currentViewerPhotoId);
  if (!photo) return;
  const link = document.createElement("a");
  link.href = photo.dataUrl;
  link.download = `julie-album-${photo.id}.jpg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
});

document.getElementById("btnViewerPrint")?.addEventListener("click", () => {
  const photo = State.albumPhotos.find(p => p.id === State.currentViewerPhotoId);
  if (!photo) return;
  State.finalComposedDataUrl = photo.dataUrl;
  goToScreen("screen-print");
  buildPrintPreview("photo");
});

document.getElementById("btnViewerDelete")?.addEventListener("click", () => {
  if (!State.db || !State.currentViewerPhotoId) return;
  if (!confirm("delete this photo? this can't be undone.")) return;
  const store = dbTransaction(STORE_PHOTOS, "readwrite");
  store.delete(State.currentViewerPhotoId).onsuccess = () => {
    goToScreen("screen-album");
    renderAlbum();
  };
});

/* ================================================================
   22. APP INIT
   ================================================================ */
window.addEventListener("DOMContentLoaded", () => {
  initDatabase();

  // Global safety net: never let one uncaught error kill the whole app UI.
  window.addEventListener("error", (e) => {
    console.error("Uncaught error handled:", e.error || e.message);
  });
  window.addEventListener("unhandledrejection", (e) => {
    console.error("Unhandled promise rejection handled:", e.reason);
  });
});
