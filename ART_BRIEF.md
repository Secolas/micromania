# Art pass brief (PixelLab)

The goal is to make the art look like one artist made it. Today the shibas are
PixelLab sprite sheets (shaded, dark outline), but most props are drawn in code
as flat blocks with no outline. This pass replaces the big code-drawn props
with PixelLab art in the same style as the shibas, without changing gameplay.

## Style rules (every asset)

- **Pixel art at 1:1.** Generate at the exact size it is drawn on screen. The
  canvas is 180x320 virtual pixels, so a prop that is 40 px wide in game is a
  40 px wide sprite. Never scale a sprite by a fraction (it blurs the pixels).
- **Outline:** a 1 px dark outline, the same as the shibas.
- **Light:** from the top-left. Shading in 2–3 tones per colour, no dithering
  noise.
- **Background:** transparent.
- **Colours:** keep each game's existing look. The scene colours live in
  `SCENE` in `index.html` (for example the couch is `#b8332a` shade and
  `#ff8a7a` shine). The UI colours are `PAL`: `#101010` background, `#f0f0f0`
  ink, `#6b6b6b` mid, plus the accent yellow and the red. Props should not use
  the UI yellow or red unless the object really is that colour.
- **Style reference:** make the first prop, check it next to the shiba sprites
  in game, and when it looks right, use it (and the shiba `catcher` sheet) as
  the style reference for every later asset.

## How art goes into the game

- Sprite sheets are **horizontal frame strips** (frame 0 on the left).
- Put new files in `art/` as PNGs, for example `art/couch.png`.
- Register each in `Assets.manifest` in `index.html`:
  `couch: { src: 'art/couch.png', fw: 64, fh: 32, frames: 1, fps: 1 },`
  (`fw`/`fh` are one frame's size).
- Draw it with `g.sprite('couch', x, y, { frame, flip })`, centred on `x, y`,
  in place of the code that drew the prop. Keep the same position and size,
  so the hitboxes and the floor line stay where they are.
- Add each new file to `CORE` in `sw.js` so the game still works offline.
- Feet and bases sit **on the floor line**. Check every swap in a screenshot.

## Priority list (do in this order)

1. **CHARGE** (`hold`): the red couch. It is drawn by the couch code near
   "A plump red couch seen from the side". The seat height must stay the same.
2. **KNOCK IT** (`knock`): the wooden crates (`crate(w, h)`) and the Y-shaped
   slingshot.
3. **SQUEEZE** (`squeeze`) and **DODGE** (`dodge`), both bosses: the fence
   (`g.fence`) and the falling flower pots (`g.pot`).
4. **BATH TIME** (`bath`): the tub.
5. **CATCH** (`catch`): the treats and coins.
6. **Shared props in `g`:** `bone`, `choc`, `tennis`, `doghouse`, `car`, `paw`.
   These appear in several games, so one swap fixes many.

Leave tiny bits (particles, sparks, UI icons, the how-to animations) as code.
Leave the backgrounds (`Env`) alone for now; they should stay simple.

## Checking each swap

1. Screenshot the game's prompt and a frame of play, before and after (a small
   Playwright script, like the ones the tests use, can call
   `Engine.startRound(GameClass, 1)` and draw a frame).
2. Check: same size, sitting on the floor, outline matches the shibas, still
   readable at phone size.
3. Run `npm test` (all suites must pass).
4. Commit one game at a time.

## Prompt to paste into your local Claude

> Read ART_BRIEF.md. Using PixelLab, do step 1 of the priority list (the CHARGE
> couch): measure the current couch's size in game from a screenshot, generate
> it in the style rules, add it to `art/`, register it, draw it in place of the
> code couch, then show me before and after screenshots and run `npm test`.
> Don't commit until I say it looks right.
