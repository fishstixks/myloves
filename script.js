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

  // ---- Music files (place in the same folder as index.html) ----
  // Set any value to null if you don't have that track yet — the
  // app will simply skip music for that section without crashing.
  music: {
    dessert:     "dessert.mp3",
    shopping:    "shopping.mp3",
    expensive:   "expensive.mp3",
    food:        "food.mp3",
    apple:       "apple.mp3",
    drive:       "drive.mp3",
    ending:      "ending.mp3"
  },

  // ---- Final video (place in the same folder as index.html) ----
  endingVideo: "apology.mp4",

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
    driveWin: "MALL PARKING LOT: CLEARED.",
    endingLines: [
      "You made it to the end.",
      "I know this doesn't fix what happened.",
      "But I wanted to make something just for you.",
      "I'm sorry, Julie."
    ]
  },

  // ---- Colors mirror style.css but exposed here for quick reference ----
  colors: {
    pink: "#ff8fb3",
    pinkDeep: "#ff5c8a",
    blush: "#ffe3ec",
    cream: "#fff8f3"
  },

  // ---- Sticker categories & emoji sets (swap for real images if desired) ----
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
  driveScore: 0,
  driveTimeLeft: 0,
  // Photobooth
  selectedLayoutCount: 1,
  capturedPhotos: [],   // dataURLs, one per shot in current session
  currentShotIndex: 0,
  cameraStream: null,
  currentFacingMode: "user",
  activeFilterCls: "filter-natural",
  activeFrameCls: "frame-none",
  placedStickers: [],   // {id, emoji, x, y, scale, rotation, z}
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
const SPARKLE_EMOJIS = ["✨", "🍂", "⭐", "🌿", "🍯"];
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
  { image: "shop1.jpg", name: "Good Girl Perfume", price: "$98", size: "tall" },
  { image: "shop2.jpg", name: "Terminator Model Kit", price: "$36", size: "med" },
  { image: "shop3.jpg", name: "Catkin Lipstick Set", price: "$64", size: "wide" },
  { image: "shop4.jpg", name: "Dior Lip Glow Balm", price: "$42", size: "small" },
  { image: "shop5.jpg", name: "One Piece Bracelet", price: "$29", size: "med" },
  { image: "shop6.jpg", name: "One Piece Cuff", price: "$29", size: "small" }
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
    card.className = "shop-item shop-item-" + item.size;
    card.innerHTML = `<img class="shop-image" src="${item.image}" alt="${item.name}">
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
  ["expensivePhaseA","expensivePhaseB","expensivePhaseC","expensivePhaseD","expensivePhaseE","expensivePhaseF","expensivePhaseG"]
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
  showPhase("expensivePhaseG");
});

document.getElementById("btnAfterTwist")?.addEventListener("click", () => {
  startLevelFood();
});

/* ================================================================
   11. LEVEL 4 — MALL RUN (point-and-tap story sequence)
   ================================================================ */
const MALL_SCENES = [
  { emoji: "🗺️", title: "the mall", text: "in through the front doors. food court's on level 4." },
  { emoji: "🚻", title: "quick stop", text: "detour to the bathroom first — priorities." },
  { emoji: "😤", title: "an obstacle", text: "an entitled auntie plants herself directly in the walkway and does not move." },
  { emoji: "🙄", title: "excuse me", text: "julie squeezes past anyway. no eye contact. no apology given or received." },
  { emoji: "🧋", title: "the order", text: "finally — the food court. bubble tea, wings, and kaya toast, all at once." },
  { emoji: "🥡", title: "mission complete", text: "haul secured. time to head back." }
];
let mallSceneIdx = 0;

function startLevelFood() {
  goToScreen("screen-level-food");
  MusicSystem.play("food");
  mallSceneIdx = 0;
  showMallScene();
}

function showMallScene() {
  const scene = MALL_SCENES[mallSceneIdx];
  const emojiEl = document.getElementById("mallSceneEmoji");
  const titleEl = document.getElementById("mallSceneTitle");
  const textEl = document.getElementById("mallSceneText");
  const btn = document.getElementById("btnMallNext");

  emojiEl.style.opacity = 0;
  titleEl.style.opacity = 0;
  textEl.style.opacity = 0;
  setTimeout(() => {
    emojiEl.textContent = scene.emoji;
    titleEl.textContent = scene.title;
    textEl.textContent = scene.text;
    emojiEl.style.transition = titleEl.style.transition = textEl.style.transition = "opacity 0.3s ease";
    emojiEl.style.opacity = 1;
    titleEl.style.opacity = 1;
    textEl.style.opacity = 1;
  }, 180);

  btn.textContent = (mallSceneIdx >= MALL_SCENES.length - 1) ? "next →" : "continue →";
}

document.getElementById("btnMallNext")?.addEventListener("click", () => {
  mallSceneIdx++;
  if (mallSceneIdx >= MALL_SCENES.length) {
    startLevelApple();
    return;
  }
  showMallScene();
});

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

// A fixed room layout — one furniture piece is randomly chosen each
// playthrough to hide Apple under. Positions are hand-placed (in %)
// so the room reads as an actual room rather than scattered emoji.
const ROOM_FURNITURE = [
  { id: "couch",   emoji: "🛋️", name: "the couch",         left: 8,  top: 46, size: 64 },
  { id: "curtain", emoji: "🪟", name: "behind the curtain", left: 68, top: 10, size: 52 },
  { id: "laundry", emoji: "🧺", name: "the laundry basket", left: 55, top: 62, size: 46 },
  { id: "plant",   emoji: "🪴", name: "the plant",          left: 4,  top: 8,  size: 48 },
  { id: "box",     emoji: "📦", name: "the box",            left: 30, top: 66, size: 46 },
  { id: "rug",     emoji: "🔲", name: "under the rug",      left: 34, top: 30, size: 60 }
];

function setupAppleFindStage() {
  const stage = document.getElementById("appleStage");
  stage.innerHTML = "";
  stage.classList.add("room-scene");

  const hidingSpotIdx = Math.floor(Math.random() * ROOM_FURNITURE.length);

  ROOM_FURNITURE.forEach((piece, idx) => {
    const el = document.createElement("button");
    el.className = "room-piece";
    el.style.left = piece.left + "%";
    el.style.top = piece.top + "%";
    el.style.fontSize = piece.size + "px";
    el.innerHTML = `<span class="room-piece-emoji">${piece.emoji}</span>`;

    if (idx === hidingSpotIdx) {
      // This piece hides Apple — a placeholder photo slot, swap
      // apple.jpg for a real photo any time.
      const applePhoto = document.createElement("img");
      applePhoto.className = "apple-photo hidden";
      applePhoto.src = "apple.jpg";
      applePhoto.alt = "Apple the corgi";
      applePhoto.onerror = () => { applePhoto.replaceWith(Object.assign(document.createElement("span"), { className: "apple-photo-fallback", textContent: "🐶" })); };
      el.appendChild(applePhoto);

      el.addEventListener("click", () => {
        el.classList.add("found");
        const photo = el.querySelector(".apple-photo, .apple-photo-fallback");
        if (photo) photo.classList.remove("hidden");
        document.getElementById("appleCaption").textContent = CONFIG.messages.appleLines[2]; // "there he is."
        setTimeout(() => {
          document.getElementById("appleCaption").textContent = CONFIG.messages.appleLines[3];
          setTimeout(() => startLevelHerGames(), 1700);
        }, 900);
      }, { once: true });
    } else {
      el.addEventListener("click", () => {
        el.classList.add("checked");
      });
    }

    stage.appendChild(el);
  });
}

/* ================================================================
   12b. LEVEL 6 — HER GAMES (Sims / Palworld / MLBB)
   ================================================================ */
const HERGAMES_SCENES = [
  { emoji: "🏠", title: "The Sims", text: "somewhere, a Sim's house is on fire and julie has already moved on to the next one." },
  { emoji: "🐾", title: "Palworld", text: "the pals are working overtime. she built an empire out of little guys with guns." },
  { emoji: "⚔️", title: "MLBB", text: "clutch play in the last thirty seconds. mvp, obviously." }
];
let herGamesIdx = 0;

function startLevelHerGames() {
  goToScreen("screen-level-hergames");
  MusicSystem.stop();
  herGamesIdx = 0;
  showHerGamesScene();
}

function showHerGamesScene() {
  const scene = HERGAMES_SCENES[herGamesIdx];
  document.getElementById("hergamesEmoji").textContent = scene.emoji;
  document.getElementById("hergamesTitle").textContent = scene.title;
  document.getElementById("hergamesText").textContent = scene.text;
  document.getElementById("btnHerGamesNext").textContent =
    (herGamesIdx >= HERGAMES_SCENES.length - 1) ? "let's go →" : "next →";
}

document.getElementById("btnHerGamesNext")?.addEventListener("click", () => {
  herGamesIdx++;
  if (herGamesIdx >= HERGAMES_SCENES.length) {
    startLevelDrive();
    return;
  }
  showHerGamesScene();
});

/* ================================================================
   13. LEVEL 7 — MINI COOPER MALL PARKING LOT (top-down arcade)
   ================================================================
   Property-only mayhem: signs, cones, shopping trolleys, pigeons,
   boxes, mall decorations. No people are ever placed as obstacles —
   that line is held regardless of the game's silly tone. Drag/touch
   to steer, "run over" obstacles for a combo + comic pop-up text,
   timed run with a GTA-style "wanted" meter that fills with chaos.
   ================================================================ */
const DRIVE_DURATION_MS = 16000;
const DRIVE_OBSTACLES = [
  { emoji: "🚧", label: "cone" },
  { emoji: "🛑", label: "sign" },
  { emoji: "🛒", label: "trolley" },
  { emoji: "🐦", label: "pigeon" },
  { emoji: "📦", label: "box" },
  { emoji: "🎄", label: "mall decoration" },
  { emoji: "🪧", label: "sign" }
];
const DRIVE_HIT_TEXTS = ["WHOOSH", "OOPS", "SCATTER!", "NICE ONE", "BOOM", "YEET", "CHAOS+1"];
let driveState = null; // { car:{x,y}, obstacles:[], raf, spawnTimer, endTimer, tickTimer, dragging }

function startLevelDrive() {
  goToScreen("screen-level-drive");
  MusicSystem.play("drive");

  const stage = document.getElementById("driveStage");
  stage.innerHTML = "";
  const car = document.createElement("div");
  car.className = "drive-car";
  car.id = "driveCar";
  car.textContent = "🚗";
  stage.appendChild(car);

  State.driveScore = 0;
  State.driveTimeLeft = DRIVE_DURATION_MS;
  setCaption("driveScore", "0");
  updateWantedMeter(0);

  const stageRect = stage.getBoundingClientRect();
  driveState = {
    car,
    stage,
    x: stageRect.width / 2,
    y: stageRect.height * 0.75,
    obstacles: [],
    dragging: false,
    lastFrame: performance.now()
  };
  positionCar();

  // Drag/touch steering — car follows the pointer within the stage
  const onPointerMove = (clientX, clientY) => {
    if (!driveState) return;
    const r = stage.getBoundingClientRect();
    driveState.x = clamp(clientX - r.left, 24, r.width - 24);
    driveState.y = clamp(clientY - r.top, 24, r.height - 24);
    positionCar();
    checkDriveCollisions();
  };
  stage.onpointerdown = (e) => { driveState.dragging = true; onPointerMove(e.clientX, e.clientY); };
  stage.onpointermove = (e) => { if (driveState && driveState.dragging) onPointerMove(e.clientX, e.clientY); };
  window.addEventListener("pointerup", () => { if (driveState) driveState.dragging = false; });

  // Spawn obstacles on an interval
  driveState.spawnTimer = setInterval(spawnDriveObstacle, 650);
  for (let i = 0; i < 5; i++) spawnDriveObstacle(); // seed a few immediately

  // Countdown tick
  driveState.tickTimer = setInterval(() => {
    State.driveTimeLeft -= 200;
    if (State.driveTimeLeft <= 0) finishDrive();
  }, 200);
}

function positionCar() {
  if (!driveState) return;
  driveState.car.style.left = driveState.x + "px";
  driveState.car.style.top = driveState.y + "px";
}

function spawnDriveObstacle() {
  if (!driveState) return;
  const stage = driveState.stage;
  const rect = stage.getBoundingClientRect();
  const kind = pick(DRIVE_OBSTACLES);
  const el = document.createElement("div");
  el.className = "drive-obstacle";
  el.textContent = kind.emoji;
  const x = rand(20, rect.width - 20);
  const y = rand(20, rect.height - 20);
  el.style.left = x + "px";
  el.style.top = y + "px";
  stage.appendChild(el);
  driveState.obstacles.push({ el, x, y, hit: false });

  // Obstacles that linger too long fade out to keep the stage readable
  setTimeout(() => {
    if (el.isConnected && !el.dataset.hit) {
      el.style.transition = "opacity 0.4s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }
  }, 3400);
}

function checkDriveCollisions() {
  if (!driveState) return;
  driveState.obstacles.forEach(ob => {
    if (ob.hit || !ob.el.isConnected) return;
    const dx = ob.x - driveState.x;
    const dy = ob.y - driveState.y;
    if (Math.sqrt(dx * dx + dy * dy) < 30) {
      ob.hit = true;
      ob.el.dataset.hit = "1";
      onDriveHit(ob);
    }
  });
}

function onDriveHit(ob) {
  State.driveScore++;
  setCaption("driveScore", String(State.driveScore));
  updateWantedMeter(State.driveScore);

  // scatter + fade the obstacle
  ob.el.classList.add("obstacle-hit");
  setTimeout(() => ob.el.remove(), 350);

  // comic pop-up text
  const pop = document.createElement("div");
  pop.className = "drive-pop-text";
  pop.textContent = pick(DRIVE_HIT_TEXTS);
  pop.style.left = ob.x + "px";
  pop.style.top = ob.y + "px";
  driveState.stage.appendChild(pop);
  setTimeout(() => pop.remove(), 700);
}

function updateWantedMeter(score) {
  const meter = document.getElementById("driveWantedMeter");
  if (!meter) return;
  const stars = Math.min(5, Math.floor(score / 4));
  meter.textContent = "🚨".repeat(Math.max(1, stars)) || "🚨";
}

function finishDrive() {
  clearInterval(driveState?.spawnTimer);
  clearInterval(driveState?.tickTimer);
  const stage = driveState?.stage;
  if (stage) { stage.onpointerdown = null; stage.onpointermove = null; }
  driveState = null;

  const wrap = document.querySelector("#screen-level-drive .center-wrap");
  const celebrate = document.createElement("h2");
  celebrate.className = "msg-title";
  celebrate.style.marginTop = "20px";
  celebrate.textContent = CONFIG.messages.driveWin;
  wrap.appendChild(celebrate);

  for (let i = 0; i < 14; i++) {
    setTimeout(() => spawnCelebrationConfetti(), i * 60);
  }

  setTimeout(() => beginEndingSequence(), 2600);
}

function spawnCelebrationConfetti() {
  const el = document.createElement("div");
  el.textContent = pick(["🎉","✨","🎊","🏁"]);
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
    tapOverlay.textContent = "video not found — check apology.mp4 was uploaded";
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
          // Auto-advance into the next shot's countdown so a 4-photo
          // layout actually captures all 4 without extra shutter taps.
          setTimeout(() => {
            if (!shutterBusy) runCaptureSequence();
          }, 900);
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
    img.style.height = count > 1 ? "150px" : "340px";
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
  document.querySelectorAll(".sticker-el").forEach(s => {
    s.classList.remove("active-sticker");
    const del = s.querySelector(".sticker-del-btn");
    if (del) del.remove();
  });
  el.classList.add("active-sticker");
  const delBtn = document.createElement("div");
  delBtn.className = "sticker-del-btn";
  delBtn.textContent = "✕";
  const doDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const id = el.id.replace("sticker-", "");
    State.placedStickers = State.placedStickers.filter(s => s.id !== id);
    el.remove();
  };
  // Intercept on mousedown/touchstart too, so the sticker's own drag
  // handler (which listens on the same element) never gets a chance
  // to start a drag before the tap registers as a delete.
  delBtn.addEventListener("mousedown", doDelete);
  delBtn.addEventListener("touchstart", doDelete, { passive: false });
  delBtn.addEventListener("click", doDelete);
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

    // Open the print window synchronously (inside the click gesture) so
    // popup blockers don't intercept it, then run the animation while
    // the print dialog itself doesn't pop up until onload fires below.
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      document.getElementById("printFallbackNote").textContent =
        "pop-up blocked — allow pop-ups for this site to print, or use save instead.";
      return;
    }

    // Quick "printer feeding a page" animation for visual feedback
    const animWrap = document.getElementById("printingAnim");
    const page = document.getElementById("printerPage");
    animWrap.classList.remove("hidden");
    page.style.animation = "none";
    void page.offsetWidth;
    page.style.animation = "printFeedOut 1.6s ease forwards";

    const dims = PRINT_FORMATS[State.printFormat];
    printWindow.document.write(`
      <html><head><title>Print</title>
      <style>
        @page { size: ${dims.w}in ${dims.h}in; margin: 0; }
        html,body { margin:0; padding:0; }
        img { width:100%; height:100%; object-fit:cover; display:block; }
      </style>
      </head><body><img src="${dataUrl}"></body></html>
    `);
    printWindow.document.close();

    setTimeout(() => {
      animWrap.classList.add("hidden");
      printWindow.print();
    }, 1500);
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
