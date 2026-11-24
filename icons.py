"""Génère les icônes de Topé (calendrier souriant + feuille subtile en fond)."""
from PIL import Image, ImageDraw, ImageFilter
import math, os
SS = 4
BG = (47, 106, 63)
LEAF = (64, 128, 81)   # vert à peine plus clair que le fond

def leaf(d, cx, cy, size, rot, color):
    """Feuille à 7 folioles dentelées, base en (cx, cy), taille = longueur de la foliole centrale."""
    specs = [(0, 1.0), (-34, .86), (34, .86), (-66, .64), (66, .64), (-100, .36), (100, .36)]
    for ang, ln in specs:
        a = math.radians(rot + ang - 90)
        L, W = size * ln, size * ln * 0.105
        pts_l, pts_r = [], []
        n = 22
        for i in range(n + 1):
            t = i / n
            w = W * math.sin(math.pi * t) ** 0.9 * (1 - 0.25 * t)
            if 0.12 < t < 0.95 and i % 2 == 1: w *= 1.28      # dents
            x, y = L * t, w
            pts_l.append((x, y)); pts_r.append((x, -y))
        poly = pts_l + pts_r[::-1]
        ca, sa = math.cos(a), math.sin(a)
        d.polygon([(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in poly], fill=color)
    # stem
    a = math.radians(rot + 90)
    d.line([(cx, cy), (cx + size * .32 * math.cos(a), cy + size * .32 * math.sin(a))], fill=color, width=max(1, int(size * .035)))

def face(d, ox, oy, scale, colors, discret=False):
    def R(x0, y0, x1, y1): return [ox + (x0 - 50) * scale, oy + (y0 - 50) * scale, ox + (x1 - 50) * scale, oy + (y1 - 50) * scale]
    page, head, ink = colors
    d.rounded_rectangle(R(18, 20, 82, 86), radius=14 * scale, fill=page)
    if discret:
        d.rounded_rectangle(R(18, 20, 30, 86), radius=6 * scale, fill=head)
        for y in (38, 50, 62, 74): d.rounded_rectangle(R(38, y - 2.5, 72, y + 2.5), radius=2.5 * scale, fill=ink)
        return
    d.rounded_rectangle(R(18, 20, 82, 40), radius=14 * scale, fill=head)
    d.rectangle(R(18, 32, 82, 40), fill=head)
    d.rounded_rectangle(R(31, 12, 39, 28), radius=4 * scale, fill=ink)
    d.rounded_rectangle(R(61, 12, 69, 28), radius=4 * scale, fill=ink)
    for cx in (39, 61): d.ellipse(R(cx - 4.5, 49.5, cx + 4.5, 58.5), fill=ink)
    d.arc(R(36, 52, 64, 76), start=20, end=160, fill=ink, width=int(5 * scale))

def leaf_layer(S, crop=1.0):
    """Une feuille centrée derrière le calendrier : seules les pointes dépassent."""
    im = Image.new('RGBA', (S, S), BG + (255,))
    leaf(ImageDraw.Draw(im), S * .5, S * (.5 + .36 * crop), S * .64 * crop, 0, LEAF)
    return im.filter(ImageFilter.GaussianBlur(S * 0.0015))

COLS = ((236, 248, 232), (178, 241, 187), (10, 40, 18))
DCOLS = ((240, 243, 245), (190, 200, 206), (110, 122, 130))
dens = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
for name, f in dens.items():
    os.makedirs(f'res/mipmap-{name}', exist_ok=True)
    # adaptive background 108dp: big tilted leaf, cropped by the edges
    S = int(108 * f) * SS
    leaf_layer(S).resize((S // SS,) * 2, Image.LANCZOS).convert('RGB').save(f'res/mipmap-{name}/ic_bg.png')
    # foregrounds
    for kind, cols, disc in (('', COLS, False), ('_discret', DCOLS, True)):
        im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); face(ImageDraw.Draw(im), S / 2, S / 2, S * .6 / 100, cols, disc)
        im.resize((S // SS,) * 2, Image.LANCZOS).save(f'res/mipmap-{name}/ic_fg{kind}.png')
    # legacy 48dp icons (Android < 8)
    S = int(48 * f) * SS
    mask = Image.new('L', (S, S), 0); ImageDraw.Draw(mask).rounded_rectangle([S * .04, S * .04, S * .96, S * .96], radius=S * .26, fill=255)
    base = leaf_layer(S, crop=1.35)
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); out.paste(base, (0, 0), mask)
    face(ImageDraw.Draw(out), S / 2, S / 2, S * .72 / 100, COLS)
    out.resize((S // SS,) * 2, Image.LANCZOS).save(f'res/mipmap-{name}/ic_launcher.png')
    out = Image.new('RGBA', (S, S), (0, 0, 0, 0)); dd = ImageDraw.Draw(out)
    dd.rounded_rectangle([S * .04, S * .04, S * .96, S * .96], radius=S * .26, fill=(94, 106, 114)); face(dd, S / 2, S / 2, S * .72 / 100, DCOLS, True)
    out.resize((S // SS,) * 2, Image.LANCZOS).save(f'res/mipmap-{name}/ic_discret.png')

# preview: adaptive render (circle and squircle masks) + legacy
bg = Image.open('res/mipmap-xxxhdpi/ic_bg.png').convert('RGBA'); fg = Image.open('res/mipmap-xxxhdpi/ic_fg.png')
full = bg.copy(); full.alpha_composite(fg)
prev = Image.new('RGBA', (3 * 330, 340), (250, 250, 250, 255))
for i, shape in enumerate(('circle', 'squircle')):
    m = Image.new('L', full.size, 0); dm = ImageDraw.Draw(m); a, b = full.size[0] * (18 / 108), full.size[0] * (90 / 108)
    (dm.ellipse if shape == 'circle' else lambda r, fill: dm.rounded_rectangle(r, radius=(b - a) * .3, fill=fill))([a, a, b, b], fill=255)
    tile = Image.new('RGBA', full.size, (0, 0, 0, 0)); tile.paste(full, (0, 0), m)
    tile = tile.crop((int(a), int(a), int(b), int(b))).resize((300, 300), Image.LANCZOS)
    prev.alpha_composite(tile, (15 + i * 330, 20))
leg = Image.open('res/mipmap-xxxhdpi/ic_launcher.png').resize((300, 300), Image.LANCZOS); prev.alpha_composite(leg, (15 + 660, 20))
prev.save('icons-preview.png')
