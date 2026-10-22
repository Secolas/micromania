# Paw masks from PixelLab's green-paw frames: for each of our frames, where its
# front legs and paws are (lined up on our frame, since PixelLab can shift it),
# less the legs as they rest in frame 0 for a sitting sheet, grown by a pixel to
# take in their outline. White on clear, one strip per sheet, frames as ours.
import sys
from PIL import Image
S, name, fw, fh, n, out, sitting = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), int(sys.argv[5]), sys.argv[6], sys.argv[7] == '1'
D = f'{S}/paw/{name}'
green = lambda c: c[3] > 40 and c[1] > 180 and c[0] < 140 and c[2] < 140
def mask(f):
    o = Image.open(f'{D}/f{f:02d}.png').convert('RGBA'); g = Image.open(f'{D}/g_{f}.png').convert('RGBA')
    op, gp = o.load(), g.load(); best = None
    for dy in range(-4, 5):
        for dx in range(-4, 5):
            cost = 0
            for y in range(fh):
                for x in range(fw):
                    a = op[x, y]; X, Y = x + dx, y + dy
                    b = gp[X, Y] if 0 <= X < fw and 0 <= Y < fh else (0, 0, 0, 0)
                    if green(b): continue
                    cost += 1 if (a[3] > 40) != (b[3] > 40) else 0
            if best is None or cost < best[0]: best = (cost, dx, dy)
    _, dx, dy = best
    m = set()
    for y in range(fh):
        for x in range(fw):
            X, Y = x + dx, y + dy
            if 0 <= X < fw and 0 <= Y < fh and green(gp[X, Y]) and op[x, y][3] > 40: m.add((x, y))
    return m, (dx, dy)
masks = [mask(f) for f in range(n)]
rest = masks[0][0] if sitting else set()
sheet = Image.new('RGBA', (fw * n, fh)); sp = sheet.load()
for f, (m, off) in enumerate(masks):
    paw = m - rest
    paw = {(x, y) for (x, y) in paw if sum((x + u, y + v) in paw for u in (-1, 0, 1) for v in (-1, 0, 1)) >= 3}   # no specks
    grown = {(x + u, y + v) for (x, y) in paw for u in (-1, 0, 1) for v in (-1, 0, 1)}
    for (x, y) in grown:
        if 0 <= x < fw and 0 <= y < fh: sp[f * fw + x, y] = (255, 255, 255, 255)
    print(f, 'offset', off, 'paw px', len(paw))
sheet.save(out)
