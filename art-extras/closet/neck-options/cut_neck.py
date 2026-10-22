# Cuts what PixelLab put on the closet shiba (fullshiba frame 0) into a 64x48
# cell for art/worn.png: the edited dog's eye line on cell row 32, its eyes'
# middle on column 32 (the game sets it by each shiba's eyes).
#   mode 'band': the whole top of the head above the eyes, hat and ears together
#                (extra: rows of the hat that come down onto the eye line)
#   mode 'diff': only what's new (pixels that differ from the original dog,
#                lined up on the face), so each shiba keeps its own head
import sys
from PIL import Image
edited, out, mode = sys.argv[1], sys.argv[2], sys.argv[3]
extra = int(sys.argv[4]) if len(sys.argv) > 4 else 0
ORIG = sys.argv[5] if len(sys.argv) > 5 else 'fs0.png'
ROWS = (int(sys.argv[6]), int(sys.argv[7])) if len(sys.argv) > 7 else (0, 48)   # cell rows kept (diff mode)
ANCHOR = int(sys.argv[8]) if len(sys.argv) > 8 else 32   # the cell row the eye line goes on
e = Image.open(edited).convert('RGBA'); o = Image.open(ORIG).convert('RGBA'); ep, op = e.load(), o.load()
best = None
for dy in range(-10, 6):
    for dx in range(-4, 5):
        cost = 0
        for y in range(26, 36):           # below the eyes: muzzle, mouth (unchanged by sunglasses too)
            for x in range(6, 30):
                a = op[x, y]; yy, xx = y + dy, x + dx
                b = ep[xx, yy] if 0 <= xx < 48 and 0 <= yy < 64 else (0, 0, 0, 0)
                cost += 900 if (a[3] > 40) != (b[3] > 40) else (sum(abs(a[i] - b[i]) for i in range(3)) if a[3] > 40 else 0)
        if best is None or cost < best[0]: best = (cost, dx, dy)
_, dx, dy = best
EYE_TOP, EX = 23, 16.5
eline = EYE_TOP + dy + extra          # the edited row that goes on the shiba's eye line
cell = Image.new('RGBA', (64, 48)); cp = cell.load()
cx0 = 32 - round(EX + 0.5 + dx)
for y in range(64):
    for x in range(48):
        c = ep[x, y]
        if c[3] <= 40: continue
        if mode == 'band' and y >= eline: continue
        if mode == 'keep' and c[0] > 140 and c[0] - c[2] > 60: continue   # sunglasses: everything but the fur in their rows
        if mode == 'diff':
            oy, ox = y - dy, x - dx
            a = op[ox, oy] if 0 <= ox < 48 and 0 <= oy < 64 else (0, 0, 0, 0)
            if a[3] > 40 and sum(abs(a[i] - c[i]) for i in range(3)) < 60: continue
        X, Y = x + cx0, y - eline + ANCHOR
        if 0 <= X < 64 and 0 <= Y < 48: cp[X, Y] = c
if mode in ('diff', 'keep'):   # only the item: the rows it's in, and no specks (bits under 4 pixels)
    for Y in range(48):
        for X in range(64):
            if not ROWS[0] <= Y < ROWS[1]: cp[X, Y] = (0, 0, 0, 0)
    seen = set()
    for Y in range(48):
        for X in range(64):
            if cp[X, Y][3] and (X, Y) not in seen:
                st, comp = [(X, Y)], []; seen.add((X, Y))
                while st:
                    a, b = st.pop(); comp.append((a, b))
                    for u in (-1, 0, 1):
                        for v in (-1, 0, 1):
                            n = (a + u, b + v)
                            if 0 <= n[0] < 64 and 0 <= n[1] < 48 and n not in seen and cp[n][3]: seen.add(n); st.append(n)
                if len(comp) < 4:
                    for q in comp: cp[q] = (0, 0, 0, 0)
print(edited, 'offset', dx, dy, 'bbox', cell.getbbox())
cell.save(out)
