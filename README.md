# MICROMANIA

A WarioWare-style microgame collection — 53 fast microgames in a single
self-contained HTML file. Portrait, mobile-first, starring a pixel-art shiba inu.

## Play

Open `index.html` in any modern browser, or visit the deployed URL.

**Camera games** need a camera and only work over **HTTPS** or `localhost` —
not from a raw `file://` open. They fall back to touch if the camera is denied,
so they stay playable anywhere. The deployed Vercel URL is HTTPS.

The first run opens a **sensors screen**: ALLOW asks for camera and mic in one
popup (plus motion/tilt on iOS), up front, so no round ever stops for a
permission prompt; TOUCH ONLY plays every game on its touch fallback. It is
skipped when the browser says both are already granted. The speaker in the
middle of the top bar mutes sound, and the choice is remembered.

| game | what the camera reads | touch fallback |
|---|---|---|
| MOVE | how much you move — the shiba runs for the flag | tap fast |
| DRY | how much you move | tap fast |
| LEAN | which half you moved in | tap that side |
| FREEZE | the *absence* of movement — don't wake the sleeping shiba | don't tap |
| SWAT | where the movement is | move your finger, tap |
| HIDE | frame brightness — a hand over the lens | hold the screen |
| DANCE | movement in time with a beat | tap on the beat |
| SQUID | move on green, freeze on red (red-light/green-light) | hold on green, release on red |

While a camera game is on, the shelf at the bottom-left shows the **live
camera** (mirrored, with a blinking REC dot), so players can see themselves and
know it is watching. Flag a game with `cam: true` in its meta.

SWAT prefers the **gyro** where the device has one — tilting the phone aims far
more precisely than the camera's centre-of-motion can. Hold the swatter on the
fly to squash it (or tap). Whatever the phone was doing when the round starts
becomes centre, so any comfortable hold works.

The action games — MOVE, DRY OFF, LEAN, FREEZE, DANCE, SWAT, SQUID and the blow
games BLOW, CANDLES and PUFF — take an **action shot**, WarioWare *Snapped!*
style: no posing. While you play, the camera keeps the frame with the most
action in it (the biggest wave, shake, lean or dance move, the hardest blow, or
for FREEZE the stillest moment), and a win shows it as a polaroid. Stills are
the camera's whole frame, never cropped, and the lens is set to its widest zoom
where the browser allows. Touch games don't take photos. The last four action
shots of a run are laid out on the game-over screen, whose **SHARE** button
builds a picture of them with the score and opens the phone's share sheet (or
downloads it where there is none). Opt a game in with `photo: true` in its meta.

A game can stamp the still with a `stampPhoto(canvas)` method. Filters live in `PhotoFX`,
draw in the photo's own pixel space, and use the five palette colours so they
read as pixel art on a photograph rather than a grade over someone's face:

- `cake` — BLOW: a birthday cake with the candles just blown out
- `dodge` — LEAN: a brick hurtling past the ear you leaned away from
- `sleepy` — FREEZE: Zzz rising off you and a crescent moon — the shiba slept through it

**BLOW** is the only game that uses the **microphone** — it measures the
low-frequency energy of a puff, and falls back to fast tapping if the mic is
denied. It also opens the camera for its photo, but never waits on it: no
camera just means no picture.

**SHAKE** reads the **gyroscope**: `rotationRate` off `devicemotion`, taken as a
peak per step so the reading does not depend on how often the device fires the
event. Shaking a phone spins it as much as it slings it, and the gyro sees that
far more cleanly than the accelerometer. It is tuned to want a firm, sustained
shake — a gentle waggle barely moves the meter. Accelerometer energy and fast
pointer wiggling stand behind it, in that order. A short vibration re-fires every
0.05s while you shake, so the motor hums the whole time you do.

**Tilt games** (`deviceorientation`, via `Input.tiltX/tiltY`): BALANCE keeps a
ball on a see-saw, POUR fills a cup to a line then levels off, STEER drives the
runner down a lane. **More blow games**: CANDLES snuffs a birthday cake (reusing
the cake polaroid), PUFF clears a dandelion. **Touch**: STACK drops blocks on a
tower, SORT swipes treats to colour-matched bowls. Each falls back to touch
where its sensor is missing.

Every prompt card says **how to play** under the pictogram ("MOVE YOUR BODY IN
FRONT OF THE CAMERA", "SHAKE YOUR PHONE HARD!"), worded for the input the player
actually has — a camera game on touch says "TAP FAST". The first time a game
comes up in a session the card stays up an extra second so it can be read.
Set it with `how` in a game's meta.

## Between games

Each round's clock is a **lit fuse** burning along the bottom toward a bomb in
the corner; the last quarter the bomb flashes red, and if time runs out on a
game you had to finish, it goes off. Between games the screen slowly closes down to
a **shiba-head-shaped window** (`Wipe`), holds a beat on black, then opens on
the next game — whose scene shows, dimmed, behind its
instructions. The verdict (GOOD! / FAIL!) is drawn over the game you just
played, so the wipe closes on that place rather than a blank screen.

## Photo album

Every action shot you win is saved on the phone (`Album`, in localStorage as
small JPEGs, up to 30, oldest dropped first). **ALBUM** on the title screen
shows them six to a page, newest first; tap one to see it big with its caption,
game and date, **SHARE** it on its own card, or **DELETE** it (tap twice).
Nothing leaves the phone unless you share it.

## Scenery

Games play in a place, not on black: a game names a backdrop with `env` in its
meta — `lawn`, `sky`, `bath`, `snow`, `field@Y` (horizon/ground at Y), `room@Y`
or `wall@Y` (floor at Y), and four bright ones: `sunny@Y` (PUFF), `beach@Y`
(FETCH), `park@Y` (LEAP) and `nature@Y` (SWAT — the sunny day with far mountains
and a pine forest, so the winged shiba buzzes around open sky). DANCE has a
`disco@Y` club with a mirror ball and floor tiles that flash on the beat, and
HIDE plays `night@Y` — moon, stars, a fence and a house with one lit window. FREEZE's shiba sleeps
in a dog bed in `bedroom@Y`, the room after dark with the moon in the window. They use a small set of dark, muted scenery colours
(`SCENE`) so the sprites and play colours stay on top; each is painted once and
cached. Every game has a scene now; the live camera view sits in the black shelf below it.

## Fake-outs and sounds

Once you have met PAT! or TAP!, about one time in seven it comes back as
**DON'T PAT!** / **DON'T TAP!** — the same scene, won by keeping your hands off.
A game opts in with `this.fakeOut(chance, prompt, how)` in `init()`.

`Sfx` has a small kit beyond the blips — `bark`, `growl`, `boop`, `squeak`,
`crunch`, `chomp`, `splash`, `whoosh`, `thud`, `fizz`, `roll`, `sniff`,
`heart`, `poof`, `step` (a rising scale for progress) and the SPEED UP
fanfare — all synthesised, no samples. Every game makes a sound while you play:
the sensor games say what is happening (the soda fizzes harder, the sleeping
shiba snores and goes "huh?" when you twitch, the shiba sniffing for you while HIDE's lens
is uncovered).

`Beat` is the backing loop — kick, snare, hats and a bass line, scheduled
ahead on the audio clock. It starts on GO, speeds up with `Engine.speed`, is
off on menus and in the shop, follows mute, and drops out while a mic game is
listening so the speaker can't count as a blow.

Props are drawn in code in the five palette colours (`g.bone`, `g.choc`,
`g.paw`, `g.doghouse`, `g.tennis`, `g.pot`, `g.car`, `g.fence`), so new scenes
don't need generated art.

## Develop

Everything lives in `index.html` — engine, all games, and the sprites
(base64-embedded). No build step, no dependencies.

- Add **`?dev`** to the address (e.g. `…/index.html?dev`) for the in-game **DEV**
  test menu (top-right) and the live sensor readouts. Players never see it.
- The DEV menu lists every game, with a difficulty selector and a LOOP mode
  that replays one game without losing lives — for testing and tuning.

## RUN mode

The title offers **RUN** (the roguelike) and **CLASSIC** (the original endless
lives run). RUN is Balatro-style scoring over the same microgames:

- A run is worlds of three stages. Each stage gives you **5 games** to reach a
  **score target** (150 / 220 / 320 in world 1, x1.6 per world). Miss it and
  the run is over. The third stage opens on a boss.
- A win scores **chips x mult**: 30 chips (80 for a boss) plus a speed bonus
  for finishing early, times a mult that grows with your streak. A fail scores
  nothing and breaks the streak.
- Clearing a stage pays **bones**: 3 (5 for a boss stage), +1 per unused game,
  and interest of 1 per 5 saved (max 5).
- Between stages the **treat shop** sells perks (5 slots) that bend the sum:
  QUICK PAWS, ZOOMIES, CAMERA STAR, BIG LUNGS, WIGGLE BUTT, HOT STREAK,
  GOOD BOY, SPEEDY, GOLDEN BONE, CHONK. Tap to buy; REROLL costs 2 and goes up each time. Tap one of
  **your** treats (in the shop or on the stage intro) to read what it does;
  in the shop its card has a SELL button for half its price, which is how a
  full row makes room.
- Every game belongs to one **group**, by what you do with the phone
  (`Run.group`), and five treats each boost one group:

  | group | games | treat |
  |---|---|---|
  | TAP (17) | TAP, PAT, CHARGE, SHH, LEAP, IN ORDER, ODD ONE, BOOP, PUMP, GRAB 3, FLAP, CROSS, PAWS, JUMP, STACK, RED LIGHT, JUGGLE | QUICK PAWS +15 chips |
  | DRAG (17) | CATCH, RUB, PULL DOWN, SWIPE, LASER, FEED, CUT, WALK, FETCH, HOP, KNOCK IT, SORT, DIG, WALKIES, SLICE, DODGE, SQUEEZE | ZOOMIES +20 chips |
  | CAMERA (8) | MOVE, DRY OFF, LEAN, FREEZE, HIDE, DANCE, YES OR NO, RUN & FREEZE | CAMERA STAR x2 chips |
  | BLOW (5) | BLOW (bubble), CANDLES, PUFF, BARK TO JUMP, WAKE UP | BIG LUNGS +4 mult |
  | SHAKE (6) | SHAKE, SWAT, BALANCE, POUR, SLED, BATH TIME | WIGGLE BUTT +4 mult |

  In RUN mode each game's card says its group, lit up with the treat's name
  when one you own boosts it.
- Games are only dealt if you can play them (`Engine.playable`): block the mic
  and no BLOW games come up at all (rather than turning into tapping), block
  the camera and no CAMERA games, and on a device with no motion sensor (a
  desktop) no SHAKE games. The shop leaves out treats for groups that can't
  come up. The `?dev` menu can still force any game.
- Inside a stage it is the same game-after-game rush; all the choosing happens
  between stages. Everything lives in the `Run` object in `index.html`.

## Bosses

A boss every eight rounds, always at difficulty 3 and 1.6x the round length:
DODGE and SQUEEZE (drag to survive), JUGGLE (tap to keep every ball off the
floor), RED LIGHT (the tap boss — mash on green to fill the bar, stop the
instant it turns red or you're caught, and sit through the reds), and SQUID
(its camera twin — move your head to run to the goal while the doll's back is
turned, freeze the instant it faces you), WAKE UP! (a giant shiba asleep in its
bed — shout into the mic to wake it before time's up; quiet lets it drift back
off; with no mic, tap as fast as you can) and BATH TIME! (shake the phone to
fling the suds off a soapy shiba in the tub; stop and the bubble bath foams
back up).

BEACH DIG is a regular game on the beach: swipe again and again to dig where
the X is until the bone turns up. WALKIES! is a pocket one-line path puzzle:
drag one route from 1 through every square, fetching the numbered treat bones in order (the
last number has to be the last square), and the shiba walks it, facing the way
it's heading. 3x3 on easy, 4x4 after, with two walls on hard; each board is
built from a random route that covers it, so there is always an answer.
BARK TO JUMP! is a voice-controlled runner: shout to jump the hurdles, and keep
shouting for a moment to carry higher — a yelp clears the low ones, the tall
flagged ones need a real shout (no mic: tap to jump). SLICE! tosses bones and
chocolate up the screen: swipe through the bones, never the chocolate.
YES OR NO? is a camera game: the shiba asks (TREAT? BATH TIME?) and you nod
for yes or shake your head for no — read from which way the camera's centre
of motion travels, so waving in circles answers nothing. With no camera it
shows YES / NO buttons.

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
