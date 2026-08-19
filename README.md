# MICROMANIA

A WarioWare-style microgame collection — 36 fast microgames in a single
self-contained HTML file. Portrait, mobile-first, starring a pixel-art shiba inu.

## Play

Open `index.html` in any modern browser, or visit the deployed URL.

**Camera games** need a camera and only work over **HTTPS** or `localhost` —
not from a raw `file://` open. They fall back to touch if the camera is denied,
so they stay playable anywhere. The deployed Vercel URL is HTTPS.

| game | what the camera reads | touch fallback |
|---|---|---|
| MOVE | how much you move | tap fast |
| DRY | how much you move | tap fast |
| LEAN | which half you moved in | tap that side |
| FREEZE | the *absence* of movement | don't tap |
| SWAT | where the movement is | move your finger, tap |
| HIDE | frame brightness — a hand over the lens | hold the screen |
| DANCE | movement in time with a beat | tap on the beat |

A win in most of them snaps a still off the camera and shows it as a polaroid
before the next round.

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

Camera signals all come out of one downscaled frame diff in
`Input._sampleMotion`: `motion`, `motionL`/`motionR`, `motionX`/`motionY`
(where the movement is) and `bright`. `Input.beginStep` fills the same fields
from touch when there is no camera, so no game has to special-case it.
