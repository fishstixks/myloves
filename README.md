# for Julie Ann ❤️

A personal apology game + photobooth, made to be hosted for free on GitHub Pages.

No backend, no build step, no database — just HTML, CSS, and vanilla JavaScript. Photos are stored only in the browser (IndexedDB) on Julie's own device and never uploaded anywhere.

---

## 1. What's inside

```
/
├── index.html          the whole app (all screens live in one page)
├── style.css            all styling
├── script.js             all behavior — game levels, camera, editor, album
├── README.md            this file
└── assets/
    ├── music/            mp3s for each game level + ending
    ├── video/             the final apology video
    ├── images/            (optional — reserved for future use)
    ├── frames/            (optional — reserved if you add custom frame images)
    └── stickers/          (optional — reserved if you add custom sticker images)
```

The game and photobooth both work immediately with placeholder/emoji-based content. You only need to add your own MP3s and the final video for the full experience — everything else (games, camera, filters, stickers, album) already works out of the box.

---

## 2. Deploying to GitHub Pages (step by step)

### Step 1 — Create a repository
1. Go to [github.com](https://github.com) and log in (or create a free account).
2. Click **New repository**.
3. Name it something like `for-julie` (the name doesn't matter).
4. Set it to **Public** (GitHub Pages on a free account requires a public repo, unless you have GitHub Pro).
5. Click **Create repository**.

### Step 2 — Upload the files
1. On your new repository page, click **Add file → Upload files**.
2. Drag in `index.html`, `style.css`, `script.js`, `README.md`, and the entire `assets` folder (with its subfolders).
3. Scroll down and click **Commit changes**.

*(If you're comfortable with git, you can instead clone the repo locally, copy these files in, and `git push` — same result.)*

### Step 3 — Add your MP3s
Upload your music files into `assets/music/` using these exact filenames (or change the filenames in the configuration — see Step 6):

```
assets/music/dessert.mp3
assets/music/shopping.mp3
assets/music/expensive.mp3
assets/music/food.mp3
assets/music/apple.mp3
assets/music/billionaire.mp3
assets/music/ending.mp3
```

If a file is missing, that level will just play silently — the app will never crash because of a missing song.

### Step 4 — Add the final video
Upload your video as:

```
assets/video/apology.mp4
```

Keep the video reasonably compressed (under ~50MB is safest for smooth playback on mobile data). MP4 (H.264) has the best iPhone Safari compatibility.

### Step 5 — (Optional) Add custom stickers/frames
The app ships with emoji-based stickers and CSS-drawn frames that already work fully. If you'd like to swap in your own image assets later, drop them into `assets/stickers/` or `assets/frames/` and reference them in the configuration section described below — this is optional.

### Step 6 — Change configuration
Open `script.js` in GitHub's web editor (click the pencil icon on the file) and look for the `CONFIG` object at the very top. Everything you'd want to personalize lives there in one place:

- `JULIE_NAME` — the name shown on the home screen
- `music` — filenames for each level's song
- `endingVideo` — filename of the final video
- `messages` — every line of dialogue in the game
- `stickerCategories`, `filters`, `frames` — content for the photobooth editor

Edit, then commit the change.

### Step 7 — Enable GitHub Pages
1. In your repository, go to **Settings → Pages**.
2. Under "Build and deployment", set **Source** to `Deploy from a branch`.
3. Set **Branch** to `main` (or `master`) and folder to `/ (root)`.
4. Click **Save**.
5. GitHub will give you a URL like `https://yourusername.github.io/for-julie/`. It can take a minute or two to go live.

### Step 8 — Open on iPhone
Send Julie the link (or open it yourself first to test). For the best experience:
- Open it in **Safari** (not an in-app browser like Instagram/Messenger's built-in browser — those sometimes block camera access).
- She can add it to her home screen (Share → Add to Home Screen) so it opens like a real app.

### Step 9 — Allow camera access
The first time she taps "Take Photos," Safari will ask for camera permission. She needs to tap **Allow** for the photobooth to work. If it's accidentally denied, it can be re-enabled in iPhone **Settings → Safari → Camera** (or **Settings → [Site Name] → Camera** if added to the home screen).

### Step 10 — Enjoy
That's it — no server, no ongoing cost, no account needed.

---

## 3. Browser limitations to know about

**Camera access** requires HTTPS. GitHub Pages serves everything over HTTPS automatically, so this isn't something you need to configure — but if you ever test locally, `file://` URLs won't allow camera access. Use a local server (e.g. `python3 -m http.server`) or just test on the live GitHub Pages link.

**Autoplay restrictions**: iOS Safari blocks audio/video from playing automatically without a user tap first. This app is built around that — music will politely wait for the next tap if autoplay is blocked, and the final video shows a "tap to watch ❤️" button if it can't autoplay. This is expected behavior, not a bug.

**Storage limits**: Photos are stored in the browser's IndexedDB, which typically allows tens to hundreds of megabytes depending on the device and available storage. If storage ever fills up, the app will show a message rather than silently failing — Julie can delete old photos from the album to free space, or use "Save" to download important ones first.

**Printing**: Mobile Safari doesn't let a website talk directly to an AirPrint printer or control printer settings. Instead, tapping "Print" prepares a correctly-sized image and opens the browser's native print/share sheet, where she can choose AirPrint, save as PDF, or share it elsewhere. If printing isn't available at all, the app suggests saving the photo and printing from the Photos app instead.

**Private/Incognito browsing**: If Julie ever opens the site in a private browsing tab, IndexedDB storage may not persist between sessions. Regular browsing mode is recommended for the album to work as expected.

---

## 4. A note on the content

This app was built to be personal, not to be a generic template — the game levels, jokes, and configuration are meant to be edited to reflect the specific person it's for. Everything in `CONFIG` at the top of `script.js` is there so it can be tuned without touching the rest of the code.

Made with care. 🎀
