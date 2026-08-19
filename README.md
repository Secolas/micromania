# MICROMANIA

A WarioWare-style microgame collection — 32 fast microgames in a single
self-contained HTML file. Portrait, mobile-first, starring a pixel-art shiba inu.

## Play

Open `index.html` in any modern browser, or visit the deployed URL.

**Camera games** (MOVE, DRY, LEAN) need a camera and only work over **HTTPS**
or `localhost` — not from a raw `file://` open. They fall back to tapping if the
camera is denied. The deployed Vercel URL is HTTPS, so they work there.

## Develop

Everything lives in `index.html` — engine, all games, and the sprites
(base64-embedded). No build step, no dependencies.

- `const DEBUG = true` near the top enables the in-game **DEV** test menu
  (top-right). Flip to `false` to ship without it.
- The DEV menu lists every game, with a difficulty selector and a LOOP mode
  that replays one game without losing lives — for testing and tuning.

## Structure

- `index.html` — the whole game
- `vercel.json` — static hosting config
