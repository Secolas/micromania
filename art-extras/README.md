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
| `sled-no-beanie.png` | 4 | 40×40. The rider before it got its beanie (PixelLab drew it on the base frame; the tails were swapped back in). |

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

## ui/ (menus, prompt and how-to art, 2026-10-21)

| File | Size | What it is |
| --- | --- | --- |
| `walkstone-single.png` | 36×36 | A one-slab stepping stone; flat, missing its top and left outline. WALKIES uses the paving patch in `art/walkstone.png` instead. |
| `demo-blowface-fire.png` | 32×32 | The blowing face as generated, puffing an orange flame; `art/demo.png` has it recoloured to white air. |

| `demo-gloves.png` | 32×40 cells | The first how-to set: phone, white WarioWare gloves (pointing, open palm, fist) and a kid's face blowing and shouting. Swapped for the shiba: the pointing glove showed every finger instead of touching the screen, and the fist under the phone read as a punch. |
| `paw-tap-whole-dog.png`, `paw-grip-whole-dog.png` | 32×32 | PixelLab asked for a lone paw and drew a whole shiba. The demo paws in `art/demo.png` are hand-pixelled instead. |

`art/demo.png` (32×40 cells): phone, tapping paw, open paw, shiba head blowing
(the BIG LUNGS icon), barking (the same head with its jaw opened by hand),
gripping paw, and the game's calm shiba face; each at its cell's top-left (see `g.demoArt`).

## closet/ (the toy room's things to wear, 2026-10-21)

| File | Size | What it is |
| --- | --- | --- |
| `halo-ring.png` | 32×32 | PixelLab's halo, a ring seen face-on; it looked like a hoop on a head. The halo in `art/hats.png` is a flat ellipse pixelled by hand. |
| `viking-helmet.png`, `headphones.png` | 32×32 | Taken out of the closet (the user's call). |
| `chef-hat.png` | 32×32 | Taken out of the closet, kept for a future cooking game. |
| `chef-hat-small.png` | 32×32 | PixelLab's redraw of it shrunk, muddy and mushroom-shaped. COOK!'s chef hat (`art/hats.png` frame 14) is pixelled by hand. |
| `hats-big.png` | 32×32 cells | The first, head-sized hats. `art/hats.png` now has small ones (PixelLab redrew each shrunk to about 12-17px) that sit between the ears, except the wizard hat, halo and cowboy hat, which are these big ones again (the user's call). |

`art/hats.png` (32×32 cells, each on its cell's bottom middle): party hat,
bow (small, by an ear), beanie, cowboy hat, wizard hat, halo, propeller cap,
flower (small, by an ear), sunglasses (worn on the eyes), and the mini beanie
SLED's rider wears. The crown reuses `art/crown.png`. See `Closet.ITEMS`.

## cook/ (COOK!, 2026-10-22)

| File | Size | What it is |
| --- | --- | --- |
| `burger-icon.png` | 32×32 | PixelLab was asked for a top bun and drew a whole burger. The game's top bun is a hand-pixelled layer in `art/cooklayers.png`. |
| `plate-topdown.png` | 44×26 | The plate seen from above. The burger is drawn from the side, so `art/plate.png` is a side-on plate pixelled by hand. |

COOK!'s art: `art/kitchen.png` (PixelLab backdrop), `art/cookfood.png` (the
bins' and ticket's pictures: bun, patty, cheese, lettuce, tomato),
`art/cooklayers.png` (the burger's layers from the side), `art/plate.png`,
`art/chefmove.png` (the chef turned to the customer: RUN & FREEZE's watcher
frame 4 flipped, then PixelLab's `animate_image` from it for a sitting loop and
a paw reaching out to put the food down),
`art/custidle.png` / `art/custfull.png` (the black-and-tan customer: the
shiba's own sheets recoloured), and the chef hat at `art/hats.png` frame 14
(pixelled by hand; beat COOK! and it's yours in the closet).

### closet/options/ (2026-10-22)

PixelLab's versions of every closet item, each drawn on the closet shiba itself
(`fullshiba.png` frame 0, `edit_image`): `<item>_<n>.png`. The ones in the
game, cut into `art/worn.png` (64×48 cells, the shiba's eye line on row 32,
its eyes' middle on column 32) by `cut_worn.py`:

| Item | Pick | Cut |
| --- | --- | --- |
| cowboy | 1 | band (hat and ears, down to the eyes; its brim's outline on the eye line) |
| party | 2 | diff (only what's new) |
| bow | 2 | diff |
| beanie | 2 | band |
| shades | 2 | keep (their rows, minus the fur) |
| wizard | 1 | band |
| halo | 1 | diff |
| propeller | 2 | band |
| flower | 2 | diff |
| crown | 2 | diff |
| chef | 1 | band |

To swap one: `python cut_worn.py <item>_<n>.png cell.png <mode> <extra> fs0.png [row0 row1]`
and paste the cell into its column of `art/worn.png` (`band:` in `Closet.ITEMS`).

`cook/chefmove-nohat.png` is COOK!'s chef before its hat. `art/chefmove.png`
has PixelLab's chef hat drawn on every frame (`edit_image` on all 11 at once),
grafted onto our own frames above the eyes so the body never moves, and
recoloured to the closet chef hat's whites (version A). `chefmove-hat-a.png`
is A as PixelLab coloured it (cream); `chefmove-hat-b.png` is the other
version, a smaller toque between the ears.
