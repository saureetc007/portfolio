#!/usr/bin/env python3
"""
Renders the hero artwork: an original, procedural cinematic scene.

A low-angle view down a corridor of dark monoliths toward a narrow blade of light,
with volumetric shafts, a glossy floor, depth-blurred decision-tree filaments
(a nod to DecisionTrace) and drifting dust. No stock imagery, no people.

Usage (needs numpy, scipy, opencv-python, pillow):
    python3 scripts/render-hero-art.py

Writes public/assets/hero/hero-wide.webp and hero-tall.webp.
"""
import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

NAVY = np.array([7, 11, 24], np.float32) / 255
NAVY2 = np.array([11, 16, 32], np.float32) / 255
BLUE = np.array([59, 130, 246], np.float32) / 255
BRIGHT = np.array([96, 165, 250], np.float32) / 255
CYAN = np.array([34, 211, 238], np.float32) / 255
HAZE = np.array([22, 52, 118], np.float32) / 255
WHITE_CYAN = np.array([0.78, 0.96, 1.0], np.float32)

OUT = Path(__file__).resolve().parent.parent / "public" / "assets" / "hero"


def blur(a, s):
    """Gaussian blur that stays fast for large sigmas by working at reduced size."""
    if s < 0.4:
        return a
    if s <= 6:
        return cv2.GaussianBlur(a, (0, 0), s)
    f = max(2, int(s / 3))
    h, w = a.shape[:2]
    small = cv2.resize(a, (max(1, w // f), max(1, h // f)), interpolation=cv2.INTER_AREA)
    small = cv2.GaussianBlur(small, (0, 0), s / f)
    return cv2.resize(small, (w, h), interpolation=cv2.INTER_CUBIC)


def render(W, H, fx_frac, ym_frac, core_dy, seed, wide):
    rng = np.random.default_rng(seed)
    R = min(H, 1.3 * W)  # reference length for vertical sizes
    S = R / 1440.0  # pixel scale for blur radii, line widths etc.
    fx = fx_frac * W
    ym = ym_frac * H  # horizon / floor line
    fy = ym - core_dy * R  # centre of the light blade
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

    # ---- 1. Atmosphere: base grade, haze pool, volumetric shafts -------------------
    t = (yy / H)[..., None]
    img = (NAVY * (1 - t) * 0.5 + NAVY2 * t * 0.8).astype(np.float32)

    d = np.sqrt(((xx - fx) / (0.62 * R)) ** 2 + ((yy - fy) / (0.5 * R)) ** 2)
    img += np.exp(-(d ** 1.6) * 1.9)[..., None] * HAZE * 1.35

    dx, dy = xx - fx, yy - fy
    r = np.sqrt(dx * dx + dy * dy) + 1
    th = np.arctan2(dx, -dy)  # 0 = straight up
    n = np.zeros_like(th)
    for k, amp in [(6, 1.0), (11, 0.9), (19, 0.8), (31, 0.6), (47, 0.4)]:
        n += amp * np.sin(k * th + rng.uniform(0, 6.28))
    n = np.clip(n * 0.34 + 0.22, 0, 1) ** 2.0
    up = np.clip(1.15 - np.abs(th) / 2.0, 0.15, 1)
    shafts = blur((n * np.exp(-r / (0.62 * R)) * up).astype(np.float32), 3 * S)
    img += shafts[..., None] * (CYAN * 0.5 + BRIGHT * 0.5) * 0.55

    # ---- 2. Monolith corridor (painted far to near, fog from what is behind) ------
    E = np.zeros((H, W, 3), np.float32)  # emissive layer, bloomed later
    mask = np.zeros((H, W), np.uint8)

    slabs = []
    for side in (-1, 1):
        z = 1.0 + rng.uniform(0, 0.25)
        while z < 17:
            length = z * rng.uniform(0.5, 0.85)
            slabs.append(dict(side=side, z=z, len=length, xin=0.5 + rng.uniform(-0.03, 0.09),
                              w=rng.uniform(0.35, 0.95), hs=rng.uniform(1.6, 2.7)))
            z += length + z * rng.uniform(0.06, 0.3)
    slabs.sort(key=lambda s: -s["z"])

    def glow_at(x, y):
        return np.exp(-np.sqrt((x - fx) ** 2 + (y - fy) ** 2) / (0.3 * R))

    def pxx(side, xo, z):
        return fx + side * xo / z * W

    for s in slabs:
        z, z2, side = s["z"], s["z"] + s["len"], s["side"]
        xin, xout, hs = s["xin"], s["xin"] + s["w"], s["hs"]
        hb = 0.02
        fog = 1 - math.exp(-0.06 * z)
        xn, xf, xo = pxx(side, xin, z), pxx(side, xin, z2), pxx(side, xout, z)
        tn, tf = ym - hs / z * R, ym - hs / z2 * R
        bn, bf = ym + hb / z * R, ym + hb / z2 * R
        inner = np.array([[xn, tn], [xf, tf], [xf, bf], [xn, bn]], np.float32)
        front = np.array([[xn, tn], [xo, tn], [xo, bn], [xn, bn]], np.float32)

        for poly, kind in ((inner, "inner"), (front, "front")):
            pts = np.round(poly * 16).astype(np.int32)  # sub-pixel precision
            mask[:] = 0
            cv2.fillPoly(mask, [pts], 255, lineType=cv2.LINE_AA, shift=4)
            x0 = int(max(0, math.floor(poly[:, 0].min()) - 1))
            x1 = int(min(W, math.ceil(poly[:, 0].max()) + 2))
            y0 = int(max(0, math.floor(poly[:, 1].min()) - 1))
            y1 = int(min(H, math.ceil(poly[:, 1].max()) + 2))
            if x1 <= x0 or y1 <= y0:
                continue
            m = (mask[y0:y1, x0:x1].astype(np.float32) / 255)[..., None]
            behind = img[y0:y1, x0:x1]
            if kind == "inner":
                g = glow_at(xx[y0:y1, x0:x1], yy[y0:y1, x0:x1])[..., None]
                dark = NAVY * 0.55 + BLUE * 0.02
                lit = (CYAN * 0.35 + BRIGHT * 0.45 + WHITE_CYAN * 0.2) * g ** 2.2 * 0.8
                # slow vertical falloff so the base of the wall catches more floor bounce
                vv = np.clip((yy[y0:y1, x0:x1] - tn) / max(1.0, bn - tn), 0, 1)[..., None]
                col = dark * (1 - fog) + behind * fog * 0.5 + lit * (0.55 + 0.6 * vv)
            else:
                col = (NAVY * 0.38) * (1 - fog) + behind * fog * 0.55
            E[y0:y1, x0:x1] *= 1 - m
            img[y0:y1, x0:x1] = behind * (1 - m) + col * m

        # emissive details on the lit inner face
        gm = float(glow_at((xn + xf) / 2, (tn + bn) / 2))
        vis = (1 - 0.55 * fog)
        thick = max(1, int(round(2.6 * S / z ** 0.5)))
        # bright rim on the leading vertical edge
        rim = (0.1 + 2.6 * gm) * vis
        cv2.line(E, (int(xn), int(tn)), (int(xn), int(bn)), tuple(float(c) for c in (CYAN * 0.6 + BRIGHT * 0.4) * rim), thick, cv2.LINE_AA)
        # panel lines converging on the vanishing point
        for hf in (0.12, 0.27, 0.43, 0.6, 0.78):
            ya, yb = ym - hf * hs / z * R, ym - hf * hs / z2 * R
            gl = float(glow_at((xn + xf) / 2, (ya + yb) / 2))
            v = (0.035 + 0.5 * gl) * vis
            cv2.line(E, (int(xn), int(ya)), (int(xf), int(yb)), tuple(float(c) for c in BRIGHT * v), 1, cv2.LINE_AA)
        # sparse LEDs in columns, like a server wall seen at distance
        for u in (0.22, 0.5, 0.78):
            zd = z + u * s["len"]
            xd = pxx(side, xin, zd)
            for k in range(int(0.04 * 100), 92, 4):
                if rng.random() > 0.2:
                    continue
                yd = ym - (k / 100) * hs / zd * R
                col = CYAN if rng.random() < 0.55 else BRIGHT
                inten = rng.uniform(0.5, 1.4) * (0.35 + gm) * vis * 1.3
                cv2.circle(E, (int(xd), int(yd)), max(1, int(round(1.6 * S / zd ** 0.4))), tuple(float(c) for c in col * inten), -1, cv2.LINE_AA)

    # drifting haze strata in front of the walls: depth without more objects
    for _ in range(7):
        cx = fx + rng.uniform(-0.45, 0.45) * W
        cy = ym - rng.uniform(0.0, 0.3) * R
        sx, sy = rng.uniform(0.22, 0.4) * W, rng.uniform(0.02, 0.045) * R
        band = np.exp(-(((xx - cx) / sx) ** 2 + ((yy - cy) / sy) ** 2))
        img += band[..., None] * HAZE * rng.uniform(0.25, 0.45)
    # front fog pooled around the light so the nearest walls soften toward it
    front_fog = np.exp(-(d ** 1.3) * 1.1)
    img += front_fog[..., None] * HAZE * 0.35

    # ---- 3. Light blade ------------------------------------------------------------
    blade = np.exp(-((xx - fx) / (0.0032 * W + 1.5)) ** 2) * np.exp(-(((yy - fy) / (0.095 * R)) ** 4))
    E += blade[..., None] * WHITE_CYAN * 7.5
    E += (np.exp(-((xx - fx) / (0.012 * W)) ** 2) * np.exp(-(((yy - fy) / (0.1 * R)) ** 2)))[..., None] * CYAN * 1.1

    # ---- 4. Decision-tree filaments, depth-of-field ---------------------------------
    levels = {}

    def layer(sig):
        k = round(sig * 2) / 2
        if k not in levels:
            levels[k] = np.zeros((H, W, 3), np.float32)
        return levels[k]

    def sigma_for(Z, scale=1.0):
        return (0.6 * S + 0.5 * S * abs(Z - 13.0)) * scale

    nodes = [dict(X=0.0, Y=1.5, Z=15.5, p=None, depth=0)]
    q = [0]
    while q and len(nodes) < 120:
        i = q.pop(0)
        nd = nodes[i]
        kids = 3 if nd["depth"] == 0 else int(rng.choice([2, 2, 3, 3]))
        for _ in range(kids):
            Z = nd["Z"] - rng.uniform(1.3, 2.8) * (nd["Z"] / 9) ** 0.7
            if Z < 2.4:
                continue
            X = float(np.clip(nd["X"] + rng.normal(0, 0.2) * (nd["Z"] / 5) ** 0.5, -0.44, 0.44))
            Y = float(np.clip(nd["Y"] + rng.normal(0, 0.34), 0.25, 0.7 + 0.2 * Z))
            nodes.append(dict(X=X, Y=Y, Z=Z, p=i, depth=nd["depth"] + 1))
            q.append(len(nodes) - 1)

    def proj(nd):
        return fx + nd["X"] / nd["Z"] * W, ym - nd["Y"] / nd["Z"] * R

    near = [i for i, nd in enumerate(nodes) if nd["Z"] < 5]
    path = set()
    if near:
        i = max(near, key=lambda j: nodes[j]["depth"])
        while i is not None:
            path.add(i)
            i = nodes[i]["p"]

    for i, nd in enumerate(nodes):
        if nd["p"] is None:
            continue
        a, b = proj(nodes[nd["p"]]), proj(nd)
        act = i in path
        Z = nd["Z"]
        col = (CYAN * 0.8 + WHITE_CYAN * 0.2) * 1.5 if act else BLUE * 0.8
        th_ = max(1, int(round((2.6 if act else 1.6) * S * 3 / Z ** 0.7)))
        cv2.line(layer(sigma_for(Z, 0.5)), (int(a[0]), int(a[1])), (int(b[0]), int(b[1])), tuple(float(c) for c in col), th_, cv2.LINE_AA)

    for i, nd in enumerate(nodes):
        x, y = proj(nd)
        act = i in path
        Z = nd["Z"]
        sg = sigma_for(Z)
        rad = max(1.0, 14 * S / Z ** 0.9) * (1.5 if act else 1.0)
        boost = min(6.0, 1 + 0.5 * (sg / rad) ** 2)
        col = (CYAN * 0.7 + WHITE_CYAN * 0.3) * 2.4 if act else (BRIGHT * 0.9 if rng.random() < 0.7 else CYAN * 0.9)
        cv2.circle(layer(sg), (int(x), int(y)), int(round(rad)), tuple(float(c) for c in col * boost), -1, cv2.LINE_AA)

    # dust motes, brighter where they catch the shafts
    for _ in range(380):
        x, y = rng.uniform(0, W), rng.uniform(0.02 * H, ym + 0.05 * H)
        Z = rng.uniform(1.6, 14)
        lit = float(shafts[int(y), int(x)]) / (float(shafts.max()) + 1e-6)
        inten = rng.random() ** 2.4 * (0.2 + 1.5 * lit) * 1.1
        sg = sigma_for(Z, 0.8)
        col = CYAN if rng.random() < 0.5 else BRIGHT
        cv2.circle(layer(sg), (int(x), int(y)), max(1, int(round(1.3 * S + 1.8 * S / Z ** 0.5))), tuple(float(c) for c in col * inten * (1 + 0.5 * (sg / (1.4 * S)) ** 2)), -1, cv2.LINE_AA)

    for sg, lay in levels.items():
        img += blur(lay, sg) * 1.7

    # ---- 5. Bloom on all emissive parts, then the glossy floor ----------------------
    bl = E * 0.9
    for s_, w_ in [(1.6, 0.9), (5, 0.75), (16, 0.6), (48, 0.5), (140, 0.4)]:
        bl += blur(E, s_ * S) * w_
    scene = img + bl

    yi = int(ym + 0.012 * R)
    rows = np.arange(yi, H)
    src = np.clip(2 * yi - rows, 0, H - 1)
    refl = scene[src].copy()
    rs, rb = blur(refl, 2.2 * S), blur(refl, 14 * S)
    tt = np.clip((rows - yi) / (0.35 * H), 0, 1)[:, None, None]
    refl = (1 - tt) * rs + tt * rb
    streak = rng.normal(size=(len(rows), 1, 1)).astype(np.float32)
    streak = cv2.GaussianBlur(streak.reshape(-1, 1), (0, 0), 1.2 * S).reshape(-1, 1, 1)
    refl *= 1 + 0.08 * np.clip(streak / (np.abs(streak).max() + 1e-6) * 3, -1, 1)
    atten = (0.46 * np.exp(-(rows - yi) / (0.26 * H)))[:, None, None]
    floor_base = (NAVY * 0.75 * (1 - np.clip((rows - yi) / (H - yi), 0, 1) * 0.8))[:, :, None] if False else \
        (NAVY * 0.7)[None, None, :] * (1 - 0.75 * np.clip((rows - yi) / (H - yi), 0, 1))[:, None, None]
    floor = floor_base + refl * atten
    edge = np.clip((rows - yi) / (4 * S + 1), 0, 1)[:, None, None]  # soft seam at the horizon
    scene[yi:] = scene[yi:] * (1 - edge) + floor * edge

    # thin horizon glow and anamorphic flare on top
    scene += (np.exp(-((yy - ym) / (0.0065 * R)) ** 2) * np.exp(-np.abs(xx - fx) / (0.11 * W)))[..., None] * CYAN * 0.35
    flare = np.exp(-((yy - fy) / (0.0028 * R + 1)) ** 2) * np.exp(-np.abs(xx - fx) / (0.16 * W))
    scene += flare[..., None] * (CYAN * 0.55 + WHITE_CYAN * 0.45) * 0.95

    # ---- 6. Grade: filmic curve, cool shadows, vignette, grain -----------------------
    out = 1 - np.exp(-scene * 1.18)
    out = out + NAVY * 0.7 * (1 - out)  # lift blacks to the brand navy
    lum = out.mean(axis=2, keepdims=True)
    out *= 1 + (1 - np.clip(lum * 3, 0, 1)) * np.array([-0.04, 0.0, 0.07], np.float32)  # cool shadows
    vig = ((xx - W / 2) / (0.78 * W)) ** 2 + ((yy - H * 0.48) / (0.85 * H)) ** 2
    out *= (1 - 0.55 * np.clip(vig, 0, 1) ** 1.3)[..., None]
    grain = rng.normal(0, 0.011, (H, W, 1)).astype(np.float32) + rng.normal(0, 0.003, (H, W, 3)).astype(np.float32)
    out += grain * (0.55 + 0.45 * out)
    return (np.clip(out, 0, 1) * 255 + 0.5).astype(np.uint8)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    jobs = [
        ("hero-wide", 2400, 1350, 0.70, 0.64, 0.105, 11, 84),
        ("hero-tall", 1080, 1900, 0.50, 0.40, 0.105, 23, 84),
    ]
    for name, W, H, fxf, ymf, cdy, seed, q in jobs:
        arr = render(W, H, fxf, ymf, cdy, seed, W > H)
        path = OUT / f"{name}.webp"
        Image.fromarray(arr).save(path, "WEBP", quality=q, method=6)
        print(name, arr.shape, f"{path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
