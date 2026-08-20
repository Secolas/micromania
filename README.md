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

MOVE, DRY, LEAN, FREEZE, DANCE and BLOW snap a still off the camera on a win and
show it as a polaroid before the next round — in the camera's own colours, and
cover-cropped so a portrait selfie frame is never squeezed into the 4:3 print.
Opt a game in with `photo: true` in its meta.

A game can stamp the still before handing it over. Filters live in `PhotoFX`,
draw in the photo's own pixel space, and use the five palette colours so they
read as pixel art on a photograph rather than a grade over someone's face:

- `cake` — BLOW: a birthday cake with the candles just blown out
- `dodge` — LEAN: a brick hurtling past the ear you leaned away from
- `statue` — FREEZE: a marble plinth and a laurel over your head

**BLOW** is the only game that uses the **microphone** — it measures the
low-frequency energy of a puff, and falls back to fast tapping if the mic is
denied. It also opens the camera for its photo, but never waits on it: no
camera just means no picture.

**SHAKE** reads the **gyroscope**: `rotationRate` off `devicemotion`, taken as a
peak per step so the reading does not depend on how often the device fires the
event. Shaking a phone spins it as much as it slings it, and the gyro sees that
far more cleanly than the accelerometer. It is tuned to want a firm, sustained
shake — a gentle waggle barely moves the meter. Accelerometer energy and fast
pointer wiggling stand behind it, in that order.

## Develop

Everything lives in `index.html` — engine, all games, and the sprites
(base64-embedded). No build step, no dependencies.

- `const DEBUG = true` near the top enables the in-game **DEV** test menu
  (top-right). Flip to `false` to ship without it.
- The DEV menu lists every game, with a difficulty selector and a LOOP mode
  that replays one game without losing lives — for testing and tuning.

## Bosses

A boss every eight rounds, always at difficulty 3 and 1.6x the round length:
DODGE and SQUEEZE (drag to survive), JUGGLE (tap to keep every ball off the
floor) and RED LIGHT (the camera boss — move on green, hold still on red, and
you must sit through the reds, not just fill the bar).

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
so treat that as the reference when tuning a new game. With `DEBUG = true` the
sensor games print their live readings along the bottom of the screen: the
camera ones show motion, position, brightness and tilt, the shake and blow ones
show their levels and whether the gyro and mic are answering at all. That is
the only way to calibrate against a real device.

WHACK draws its hole and its mole separately. The sprite sheet bakes ground into
every frame but not the *same* ground — the popped frames sit the dog on a raised
mound low in the cell, the empty frame is a flat hole higher up — so stepping the
frames made the hole change shape and jump. The hole is always frame 8 now, and
the mole is frame 0 clipped to above the rim and slid up through it.
