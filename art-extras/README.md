# Spare art

Art we made but don't use right now, kept to reuse later. The game never loads
anything in this folder and it isn't in `sw.js`. To use a piece, copy it into
`art/`, add it to `Assets` in `index.html` and to CORE in `sw.js`.

Every sheet is a row of 64×64 frames on transparency, from PixelLab.

## watcher/ (RUN & FREEZE's shiba, 2026-10-21)

| File | Frames | What it is |
| --- | --- | --- |
| `front-side-back.png` | 3 | The `art/doll.png` poses, padded to 64×64. Everything below starts from these. |
| `turn-grumpy.png` | 9 | Back → side → front, ends on the grumpy face (looks a bit sad on the way). |
| `stare-grumpy.png` | 6 | Grumpy front stare: leans in, squints, settles back. Loops. |
| `stare-drift.png` | 7 | First stare try: drifts into a different-looking dog (pointy ears, no paw). |
| `suspicious.png` | 9 | Sly side-eye and smirk: 0-3 end of the turn, 4-8 the stare. |
| `alert-turn-end.png` | 4 | Alert face (ears up, wide eyes) for the end of the turn. **In use.** |
| `alert-scan.png` | 8 | Alert stare scanning side to side for movement. Loops. **In use.** |
| `tail-wag.png` | 5 | From behind, tail wagging. **In use.** |
| `preview-*.gif` | | The full loop for each face (grumpy, suspicious, alert), 4× on grass. |

The sheet the game uses is `art/watcher.png`: frames 0-4 from `turn-grumpy`,
then `alert-turn-end`, `alert-scan` and `tail-wag`.

## sled/ (SLED!'s rider, 2026-10-21)

| File | Frames | What it is |
| --- | --- | --- |
| `sled-bounce.png` | 4 | 40×40. The whole sled hops over bumps. Not used: PixelLab redrew the dog and sled a little differently each frame, so it wobbled sideways. |
| `sled-still-try.png` | 4 | 40×40. A second try asking for only the tail and ears to move; the body still drifted. |

The game's `art/sledmove.png` is `art/sledder.png` padded to 40×40 with only
the tail swapped in from `sled-bounce` (lined up on the head and back), so the
dog and sled never move.

## stickers/ (selfie stickers and RUN treat icons, 2026-10-21)

| File | Size | What it is |
| --- | --- | --- |
| `bubble-solid.png` | 32×32 | First bubble: a solid blue marble, would hide your face. |
| `bubble-filled.png` | 32×32 | Second bubble, filled pale. `art/photobubble.png` is this with its middle made see-through. |
| `zzz-first.png` | 48×40 | First Zzz; the first letter came out as a hook. |
| `treat-paws-first.png` | 32×32 | First QUICK PAWS icon, read as a brown claw. |
| `treat-lungs-face.png` | 32×32 | First BIG LUNGS: a happy shiba face, no blowing. |
| `treat-lungs-side.png` | 32×32 | Second BIG LUNGS, side view. The one in `art/treats.png` is this moved 3px left with pixel gust lines added. |
