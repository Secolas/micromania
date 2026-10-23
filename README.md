# SHIBA MANIA

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
skipped when the browser says both are already granted.

**New games wait for you**: the first time you ever meet a game, its prompt
says NEW GAME! and waits for TAP WHEN READY instead of counting down. After
that it's remembered.

**iPhone (Safari)**: works on iOS 14.5 and later, over HTTPS (the Vercel link).
Sound starts on the first tap; it is unlocked on the finger lifting too, which
is when iOS allows it, and asks for the "playback" audio session so the ringer
switch on silent doesn't mute the game (Safari 16.4+). Tilt and shake ask for
motion permission inside a tap, as iOS requires. iPhones have no vibration for
websites, so the buzzes are skipped there; install is Share > Add to Home
Screen (the SETTINGS screen says so).

**Camera check**: before the first camera game of a session, a CAMERA CHECK
screen shows your live picture with an oval to put your face in, and three
readings: LIGHT (too dark?), YOU (anyone in the middle of the picture: a
skin-colour hint, not face recognition) and MOVEMENT (wave to test), each OK
or what to do. It never blocks: the button says PLAY ANYWAY until all three
pass, then LOOKS GOOD!, and the game's prompt carries on. SETTINGS > CAMERA
CHECK opens it any time.

**Replay**: camera games quietly record a short clip of you (about three
seconds, plus half a second of your reaction to the result). At GAME OVER,
WATCH REPLAY plays the last five back on a little TV, with numbered dots to
pick one and back / pause / forward buttons. Only camera games are recorded
(not the touch games, even with the camera on). The clip is the whole camera
picture, never cropped or stretched: the TV takes its shape, tall for a phone
held upright and wide for a laptop, drawn smooth like a photo. They stay in memory on the
phone only, and the next run starts with none.

**RUN's world map**: each RUN stage opens on a map of one countryside that
fits every kind of game: a band of meadow per world, a dirt path winding through
its stops, and a stream with a wooden bridge and a signpost (WORLD 2) where the
path climbs into the next world. The trees, pines, hedges and benches are
scattered from a seed per world, so each one looks a little different. The
shiba runs along the path from its doghouse, or the stop it just cleared, to
the next one, using the game's own runners at the size their games draw them:
STACK's gallop across the map, SQUEEZE's runner up it, and the head-first
runner down it (`Run.RUNNER`). The target
and your treats show below. Cleared stops turn gold, and a boss's crown sits on
the shiba's head when it gets there.
The worlds come from one list, `Run.WORLDS` in `index.html`. Each world has its
stages, and it can also have a `name` for its signpost, `games` and `bosses`
(the game ids it picks from; all games if left out) and a `ground` (one of
`Run.GROUNDS`; the meadow if left out). A stage can be a `boss`, set its own
`target`, `games` or place on the map (`x`, 0 to 1). Add a world or a stage
there and the map, the stage labels (2-3), the targets and the end of the run
follow. With more worlds than fit, the map scrolls to follow the shiba.

**Things to wear**: the DOGHOUSE keeps the hats, neck things and coats you
win. A game with a prize names it on its prompt only on HARD (WIN: COWBOY HAT).
Winning one, or reaching a milestone, brings up a YOU GOT card once the round
is over: the thing's name, and the shiba big in the middle wearing it,
cheering. The game holds still under it until a tap, or 3 seconds.

**Surprises**: once things get going, a prompt can start out normal and then
have a stamp slam down on the game's title:
- **REVERSE!** (drag and tilt games only): your touch lands where you press, but
  everything after moves the opposite way (swipes flip, tilt flips). Bosses
  after the first one (the DODGE and SQUEEZE drag bosses) flip half the time;
  ordinary drag/tilt games one time in five once the speed is up.
- **DOUBLE BONUS!** (RUN, any game): a win doubles that game's mult. One game
  in eight once it's warmed up, one in four on bosses.
- **+1 LIFE!** (CLASSIC, any game, only when you've lost a life): win it and a
  life comes back (never above 4). The score stays a plain count of wins.
  One game in seven once it's warmed up, about one in three on bosses.

A tag stays on screen while you play. A game you're meeting for the first time
never gets a surprise. For testing, `?reverse` makes every round a reversed
drag/tilt game and `?double` gives every round the mode's bonus (DOUBLE BONUS in RUN, +1 LIFE in CLASSIC).

**First time**: the first RUN or CLASSIC starts with a short tutorial that
explains the five kinds of game, one card each: TAP, DRAG, CAMERA, SOUND and
TILT/SHAKE. Each card plays a short animation of the move (a finger tapping or dragging,
a hand waving at the camera, a face blowing into the mic, a hand tilting and
shaking the phone), says what to do, and shows the tag you'll see before those
games, then a practice game where nothing is lost and a miss gets one more go.
If a sensor is off, its card says those games are skipped and where to turn it
on. Then YOU'RE READY! and the mode you picked. SKIP is always there, and
SETTINGS > HOW TO PLAY replays it. Every prompt shows its kind ("DRAG GAME",
"CAMERA GAME"...) and plays the same animation, so you know how to play before the clock
starts (a camera, mic or motion game that fell back to touch shows the touch).

**Pause**: leaving the app (a call, a message, the home button) pauses any
screen with a clock running, and so does the pause button in the middle of the
top bar. PAUSED offers RESUME, which counts 3-2-1 back into a game with its
clock where it was, and QUIT to the title.

**SETTINGS** (on the title menu) has switches for SOUND, MUSIC (the backing
beat) and VIBRATION, and for each sensor: CAMERA, MICROPHONE and MOTION. Turning
a sensor on asks the browser right there; turning it off stops it now and keeps
it off, and the games that need it are skipped (as when it's refused). A sensor
refused at the browser level reads BLOCKED, with a note to allow it in the
browser's site settings; one the device doesn't have reads NONE. Every switch is
remembered on that phone. There is no mute icon in the top bar any more.

The menu-style screens (SETTINGS, ALBUM, the sensors screen and GAME OVER) share
one look: black with faint paw prints drifting by, the content in a pixel frame
with notched corners, and no mascot in the corner.

| game | what the camera reads | touch fallback |
|---|---|---|
| MOVE | how much you move — the shiba runs for the flag | tap fast |
| DRY | how much you move | tap fast |
| LEAN | which half you moved in | tap that side |
| FREEZE | the *absence* of movement — don't wake the sleeping shiba | don't tap |
| SWAT | where the movement is | move your finger, tap |
| HIDE | frame brightness — a hand over the lens | hold the screen |
| HEADBANG | nod your head hard, up and down, to fill the ROCK meter, to a hard-rock riff | tap fast |
| SQUID | move on green, freeze on red (red-light/green-light) | hold on green, release on red |

While a camera game is on, the shelf at the bottom-left shows the **live
camera** (mirrored, with a blinking REC dot), so players can see themselves and
know it is watching. Flag a game with `cam: true` in its meta.

Where the browser allows it (Chrome, Android), camera frames are read straight
off the camera track (`MediaStreamTrackProcessor`), so the picture keeps coming
even if the phone stops feeding the page's hidden video. Elsewhere (Safari) the
video is used. Either way, a watchdog gets a fresh camera stream if pictures
stop arriving for a few seconds.

SWAT prefers the **gyro** where the device has one — tilting the phone aims far
more precisely than the camera's centre-of-motion can. Hold the swatter on the
fly to squash it (or tap). Whatever the phone was doing when the round starts
becomes centre, so any comfortable hold works.

The action games — MOVE, DRY OFF, LEAN, FREEZE, HEADBANG, SWAT, SQUID and the blow
games BLOW, CANDLES and PLUCK — take an **action shot**, WarioWare *Snapped!*
style: no posing. While you play, the camera keeps the frame with the most
action in it (the biggest wave, shake, lean or headbang, the hardest blow, or
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
the cake polaroid). **Touch**: PLUCK (`puff`) has you drag every seed off a
dandelion, one by one, STACK builds a shiba tower, SORT swipes treats to colour-matched bowls. Each falls back to touch
where its sensor is missing.

Every prompt card says **how to play** under the pictogram ("MOVE YOUR BODY IN
FRONT OF THE CAMERA", "SHAKE YOUR PHONE HARD!"), worded for the input the player
actually has — a camera game on touch says "TAP FAST". The first time a game
comes up in a session the card stays up an extra second so it can be read.
Set it with `how` in a game's meta.

## Between games

Each round's clock is a **lit fuse**: a plain cord along the bottom, a small
spark at its tip, burning back toward a bomb sitting in the corner of the shelf; the last quarter the bomb flashes red, and if time runs out on a
game you had to finish, it goes off. Between games the screen slowly closes down to
a **shiba-head-shaped window** (`Wipe`), holds a beat on black, then opens on
the next game — whose scene shows, dimmed, behind its
instructions. The verdict (GOOD! / FAIL!) is drawn over the game you just
played, so the wipe closes on that place rather than a blank screen.

Every verdict, in every game and both modes, goes through one place (`Juice`),
so wins and fails always feel the same:

- **Win:** a short hit-stop with a white flash and a ring where you tapped (or the
  centre, for tilt, camera, blow and shake games). Then **GOOD!** slams in,
  tilted, with confetti from the top corners. From two wins in a row a
  **xN STREAK!** badge pops under the stamp. (The mascot cheers but never
  moves: its art is cut flat at the feet, which only the shelf hides.)
- **Fail:** **FAIL!** slams in on the red screen, with no flash and no confetti.
- **Stage clear** (RUN) adds a bigger burst of confetti.

## Title screen

The title is full-bleed (sky to the top edge, meadow to the bottom) and a
little side-scroller. **SHIBA** and **MANIA** drop in letter by
letter, and the menu slides up: RUN, CLASSIC, ALBUM and SETTINGS as alike white
outlined words, like Super Mario's title menu. The shiba runs in and
keeps running: far blue mountains, the hills and the meadow scroll past at
their own speeds, bushes and all. It jumps for the bones floating about, low,
mid-air or high, whenever one comes. Now and then a cowboy hat floats by: grab
it and the shiba wears it, as JUMP!'s runner does. A tap skips the intro. Coming back
from the album shows the settled screen straight away.

## Photo album

Every action shot you win is saved on the phone (`Album`, in localStorage as
small JPEGs, up to 30, oldest dropped first). **ALBUM** on the title screen
shows them six to a page, newest first; tap one to see it big with its caption,
game and date, **SHARE** it on its own card, or **DELETE** it (tap twice).
Nothing leaves the phone unless you share it.

## Scenery

Games play in a place, not on black: a game names a backdrop with `env` in its
meta — `lawn`, `sky`, `bath`, `snow`, `field@Y` (horizon/ground at Y), `room@Y`
or `wall@Y` (floor at Y), and four bright ones: `sunny@Y` (PLUCK), `beach@Y`
(FETCH), `park@Y` (LEAP) and `nature@Y` (SWAT — the sunny day with far mountains
and a pine forest, so the winged shiba buzzes around open sky). HEADBANG has a
`disco@Y` stage with a mirror ball and floor tiles that flash on the beat, and
HIDE plays `night@Y` — moon, stars, a fence and a house with one lit window. FREEZE's shiba sleeps
in a dog bed in `bedroom@Y`, the room after dark with the moon in the window. They use a small set of dark, muted scenery colours
(`SCENE`) so the sprites and play colours stay on top; each is painted once and
cached. Every game has a scene now; the live camera view sits in the black shelf below it.

Every shiba stands on something. In a side-view scene its paws sit a few pixels
into the grass or floor below the horizon, not on the line or up in the sky; a
head-only face is used only where it peeks out of something (a tub, a hedge, a
dog bed). Otherwise the whole sitting shiba is used, since its art is cut flat
at the paws. The bathroom tiles stop at the play field's edge, the day clouds
drift below the instruction line, and CROSS has a tarmac road. KNOCK IT is drawn like Angry Birds: a wooden Y slingshot on a mound with two rubber bands and a pouch (the back band behind the shiba, the front one in front), a dotted aim and trail, and wooden crates on a stone slab with simple physics: they fall, bounce, slide, roll over to land flat and stack on each other, so a crate shot out of the middle drops the ones above it.

More games run on real physics (gravity and momentum) rather than canned
animations:

- **CUT** is Cut the Rope: the bone swings on its rope as a pendulum, and a cut
  sends it off with the swing's speed, so you time it to drop into the mouth.
- **STACK** is Tower Bloxx: every tap drops a shiba that falls and lands; more
  than half off the one below and it tips off, a tower leaning too far
  topples, and it sways as it grows (dead centre gets a PERFECT!).
- **DODGE**: the pots speed up as they fall, tumble, and smash into shards.
- **CATCH**: the treats speed up as they fall and bounce off the edge of the
  dog's head when you're just off (and can still be caught).
- **FETCH**: the ball is lobbed (its height and shadow are simulated), lands,
  bounces lower each time and rolls; the shiba grabs it when it's low.
- **CHARGE**: a real jump: the charge is the height, the run-up is the same,
  so too low hits the couch's arm and too high flies into the backrest. The
  yellow band is computed from that flight, so it's exactly where it lands. A game never puts
a second shiba right above the shelf mascot (PLUCK and BLOW just have the mascot
watching). STACK is a shiba tower: shibas run in from either side and you tap to
drop each one; it freezes mid-run on the back of the one below.

## Fake-outs and sounds

Once you have met PAT! or TAP!, about one time in seven it comes back as
**DON'T PAT!** / **DON'T TAP!** — the same scene, won by keeping your hands off.
A game opts in with `this.fakeOut(chance, prompt, how)` in `init()`.

`Sfx` has a small kit beyond the blips — `bark`, `growl`, `boop`, `squeak`,
`crunch`, `chomp`, `splash`, `whoosh`, `thud`, `fizz`, `roll`, `sniff`,
`heart`, `poof`, `step` (a rising scale for progress), `smack`, `clap`,
`tissue`, `boing`, `clunk`, `bonk`, `fly`, `hum`, `creak`, `foot`, `goal` and
the SPEED UP fanfare — all synthesised, no samples. HEADBANG plays its own
hard-rock band instead of the game music: a distorted power-chord guitar
(`chug`), bass, kick, snare and hi-hat (`hat`), louder and brighter the harder
you rock. A browser plays no sound before the first tap, so on a fresh visit
the title says TAP FOR SOUND, and that first tap replays the intro with the
title tune and the shiba's bark. Every game makes a sound while you play:
the sensor games say what is happening (the soda fizzes harder, the sleeping
shiba snores and goes "huh?" when you twitch, the shiba sniffing for you while HIDE's lens
is uncovered). RUN & FREEZE has footsteps while you run, a creak as the dog
turns, a heartbeat while it watches and a growl when it catches you; SWAT's fly
buzzes and the swat smacks; the counting games (IN ORDER, GRAB, SWIPE, LEAN)
climb a scale with each right one and clunk on a wrong one.

Sound is synthesised live (no audio files), WarioWare Touched-style:

- **Effects** (`Sfx`) are proper synth voices (envelopes, pitch slides,
  vibrato, filters) through one mix bus with a compressor and a little room
  reverb: the bark is two buzzy "wuf"s through a mouth-shaped filter, a win is
  "ding-ding-DING!" up the chord, a fail is the "bwom-bwom" buzzer.
- **Stings** mark each beat of the loop: a get-ready lick before every
  microgame (a low "dun-dun-dun-DUN" for a boss), GO! after the countdown, a
  siren-and-fanfare SPEED UP, a STAGE CLEAR fanfare and the GAME OVER slide.
- **Music** (`Music`) is a small chiptune sequencer playing four songs written
  as 16th-note steps: a bouncy title tune (menus), a funky groove under the
  microgames that speeds up with every SPEED UP, a darker boss theme, and a
  laid-back shop tune. It follows the SOUND and MUSIC switches and drops out
  while a mic game is listening, so the speaker can't count as a blow.

`tests/audio.test.mjs` renders every sound and song offline and checks none is
silent or clipping.

Props are drawn in code in the five palette colours (`g.bone`, `g.choc`,
`g.paw`, `g.doghouse`, `g.tennis`, `g.pot`, `g.car`, `g.fence`), so new scenes
don't need generated art.

## Develop

The game is `index.html`: engine, all games, and the sprites (base64-embedded).
No build step. Around it: `manifest.webmanifest`, `sw.js` and `icons/` make it
installable and playable offline, and `tests/` checks it.

- Add **`?dev`** to the address (e.g. `…/index.html?dev`) for the in-game **DEV**
  test menu (a yellow DEV button in the window's top-right corner) and the live
  sensor readouts. Players never see it. `#dev` works too, and once turned on it
  stays on in that browser (some in-app browsers drop the query on reload);
  `?nodev` turns it off.
- The DEV menu lists every game, with a difficulty selector and a LOOP mode
  that replays one game without losing lives — for testing and tuning.

### Tests

`npm install`, then `npm test` runs every `tests/*.test.mjs` in headless
Chromium against the real page (served over http by `tests/run.mjs`).
`npm test -- games text` runs only the files whose names match. GitHub Actions
(`.github/workflows/test.yml`) runs them on every push and pull request.

| test | checks |
|---|---|
| `games` | every game at every difficulty ends without throwing; a scripted player can win the skill games; fake-outs behave |
| `text` | no text under 8px, none grey, none off the screen or out of a menu frame, on every screen and in every game |
| `runwin` | the stage targets; beating the world-3 boss wins the run; KEEP GOING goes ENDLESS through the shop to world 4; DONE; wins counted |
| `classic`, `run` | both modes from the title through GAME OVER (RUN: stage card, clear, shop, next stage) |
| `title` | the intro skip and the four menu options with real clicks; the GOOD!/FAIL! juice |
| `album`, `settings` | saving, paging, opening, sharing and deleting photos; every switch, saved across a reload |
| `camera` | live frames from a fake camera, and recovery when the feed stalls |
| `pwa` | manifest, icons, the service worker, and starting with the network off |
| `camcheck` | the first camera game of a session opens the check; the three readings; the button returns to the prompt with its clock; not twice a session; SETTINGS opens it |
| `replay` | camera games keep a clip, WATCH REPLAY plays them back, forward / pause / DONE work, a new run starts with no clips |
| `reverse` | REVERSE mirrors a drag about where it went down and only applies to drag/tilt games; a new game's prompt waits for READY, then remembers |
| `tutorial`, `pause` | the first-time tutorial (practice costs nothing, a miss replays, SKIP, replay from SETTINGS); pausing on leaving the app, RESUME's 3-2-1 with the clock intact, QUIT |
| `audio` | every effect, sting and song renders audibly without clipping; the right song plays on each screen |

To use a browser that's already installed instead of Playwright's own, set
`CHROMIUM_PATH=/path/to/chromium`.

### Text

`g.text` never draws smaller than 8px, and grey text (`PAL.mid` / `TEXT_MID`)
comes out white: grey is for bars and lines. Long labels use `g.wrap` (the shop
cards do).

## Install and offline

SHIBA MANIA is a Progressive Web App: on Android, SETTINGS has an **ADD TO HOME
SCREEN** button (or Chrome's menu > Install app); on iPhone it's Share > Add to
Home Screen, which SETTINGS spells out. Installed, it opens full screen like an
app. `sw.js` caches the page on the first visit: online it always fetches the
latest version first, offline it serves the cached copy, so the game works with
no signal. Camera and mic still need the permission to have been granted.

## RUN mode

The title offers **RUN** (the roguelike) and **CLASSIC** (the original endless
lives run). RUN is Balatro-style scoring over the same microgames:

- A run is **3 worlds** of three stages. Each stage gives you **5 games** to
  reach a **score target** (120 / 190 / 280 in world 1, x1.4 per world, so 550
  for the last boss). Miss it and the run is over. The third stage opens on a boss.
- Beat the world-3 boss and the run is **won**: RUN COMPLETE! with your time,
  your best time and how many runs you've won (kept on the phone), plus
  WATCH REPLAY and SHARE. **KEEP GOING** carries on in **ENDLESS** from the
  shop with your bones and treats, the targets still climbing, until a stage
  beats you; DONE goes back to the title.
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
  | DRAG (18) | CATCH, RUB, PULL DOWN, SWIPE, LASER, FEED, CUT, WALK, FETCH, HOP, KNOCK IT, SORT, DIG, WALKIES, SLICE, PLUCK, DODGE, SQUEEZE | ZOOMIES +20 chips |
  | CAMERA (8) | MOVE, DRY OFF, LEAN, FREEZE, HIDE, HEADBANG, YES OR NO, RUN & FREEZE | CAMERA STAR x2 chips |
  | BLOW (4) | BLOW (bubble), CANDLES, BARK TO JUMP, WAKE UP | BIG LUNGS +4 mult |
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
