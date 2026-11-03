#!/usr/bin/env python3
"""Regenerate assets/banner.svg (animated; fonts embedded so it renders inside a GitHub README)."""
import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "site/node_modules/@fontsource/barlow-condensed/files"
b64 = lambda w: base64.b64encode((FONTS / f"barlow-condensed-latin-{w}-normal.woff2").read_bytes()).decode()
MORSE = {'C': '-.-.', 'Q': '--.-', 'D': '-..', 'E': '.', 'S': '...', 'H': '....', 'A': '.-', 'K': '-.-'}
MSG = 'CQ DE SHACK'

x, y, unit, rects, i = 72, 206, 7, [], 0
for ch in MSG:
    if ch == ' ':
        x += unit * 4
        continue
    for s in MORSE[ch]:
        w = unit if s == '.' else unit * 3
        rects.append(f'<rect class="k" style="animation-delay:{i * 0.16:.2f}s" x="{x}" y="{y}" width="{w}" height="8" rx="2"/>')
        x += w + unit
        i += 1
    x += unit * 2
total = i * 0.16 + 1.5

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" width="1200" height="300" role="img" aria-label="The Shack: learn ham radio">
<defs>
<style>
@font-face{{font-family:B;font-weight:700;src:url(data:font/woff2;base64,{b64(700)}) format("woff2")}}
@font-face{{font-family:B;font-weight:500;src:url(data:font/woff2;base64,{b64(500)}) format("woff2")}}
.t{{font-family:B,'Arial Narrow',sans-serif;font-weight:700}}
.s{{font-family:B,'Arial Narrow',sans-serif;font-weight:500}}
.k{{fill:#ffb43a;opacity:.14;animation:key {total:.2f}s steps(1,end) infinite}}
@keyframes key{{0%{{opacity:1}}3%{{opacity:.14}}100%{{opacity:.14}}}}
.n{{animation:sweep 6s ease-in-out infinite alternate}}
@keyframes sweep{{from{{transform:translateX(-120px)}}to{{transform:translateX(120px)}}}}
.w{{animation:flick 1.3s steps(2,end) infinite}}
@keyframes flick{{50%{{opacity:.7}}}}
@media (prefers-reduced-motion:reduce){{.k,.n,.w{{animation:none;opacity:1}}}}
</style>
<linearGradient id="p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34453d"/><stop offset=".25" stop-color="#27332f"/><stop offset="1" stop-color="#1a231f"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0e1411"/><stop offset=".5" stop-color="#2a1d07"/><stop offset="1" stop-color="#0e1411"/></linearGradient>
<radialGradient id="kb" cx="38%" cy="32%" r="80%"><stop offset="0" stop-color="#3b342c"/><stop offset=".6" stop-color="#1a1612"/><stop offset="1" stop-color="#0c0a08"/></radialGradient>
</defs>
<rect width="1200" height="300" rx="10" fill="url(#p)" stroke="#0b100e" stroke-width="3"/>
<g fill="#8fa398" stroke="#202926"><circle cx="16" cy="16" r="5"/><circle cx="1184" cy="16" r="5"/><circle cx="16" cy="284" r="5"/><circle cx="1184" cy="284" r="5"/></g>
<text class="t" x="68" y="132" font-size="104" fill="#e9efe8">The Shack</text>
<text class="s" x="72" y="180" font-size="30" fill="#a5b3aa">learn ham radio. build things. pass the exam.</text>
<g>{''.join(rects)}</g>
<rect x="650" y="46" width="500" height="150" rx="6" fill="#0d1210" stroke="#050807" stroke-width="3"/>
<rect x="660" y="56" width="480" height="40" fill="#0e1411"/>
<text class="t" x="1140" y="88" text-anchor="end" font-size="44" fill="#ffb43a">14.074.00</text>
<rect x="660" y="104" width="480" height="82" fill="url(#g)"/>
<g class="w" stroke="#ffb43a" stroke-width="3" opacity=".85"><path d="M700 106v78M722 106v78M760 106v78M790 112v72M846 106v78M880 106v78M906 108v76M954 106v78M1010 106v78M1060 112v72M1096 106v78"/></g>
<rect class="n" x="878" y="104" width="3" height="82" fill="#e5432d"/>
<circle cx="700" cy="250" r="34" fill="url(#kb)" stroke="#51473a" stroke-width="2"/><rect x="697" y="222" width="6" height="16" rx="2" fill="#ffb43a"/>
<text class="s" x="756" y="244" font-size="22" fill="#a5b3aa">Technician · General · Extra</text><text class="s" x="756" y="270" font-size="22" fill="#a5b3aa">409 + 423 + 599 questions, all in the box</text>
</svg>'''
(ROOT / "assets/banner.svg").write_text(svg)
print("wrote assets/banner.svg", len(svg) // 1024, "KB")
