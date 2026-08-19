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

SWAT prefers the **gyro** where the device has one — tilting the phone aims far
more precisely than the camera's centre-of-motion can. Hold the swatter on the
fly to squash it (or tap). Whatever the phone was doing when the round starts
becomes centre, so any comfortable hold works.

A win in most of them snaps a still off the camera and shows it as a polaroid
before the next round: cover-cropped to the frame (never stretched) and printed
as a six-tone duotone along the palette, so it sits with the pixel art.

**BLOW** is the only game that uses the **microphone** — it measures the
low-frequency energy of a puff, and falls back to fast tapping if the mic is
denied. SODA reads the accelerometer (shake), with pointer wiggling as its
fallback. Nothing else needs a sensor.

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
`Input.tiltX`/`tiltY` come from `deviceorientation` (`enableTilt`, zeroed per
round with `zeroTilt`), and `tiltReady` stays false where there is no sensor.

Motion thresholds are all on one scale — LEAN's `0.18` is "definitely leaning",
so treat that as the reference when tuning a new game. With `DEBUG = true` every
camera game prints its live readings along the bottom of the screen, which is
the only way to calibrate against a real lens.
