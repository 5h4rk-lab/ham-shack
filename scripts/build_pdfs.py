#!/usr/bin/env python3
"""Build the three study-guide PDFs (Technician, General, Extra).

Pipeline: guide .md --pandoc--> HTML body  +  question-pool appendix generated
from data/*.json  --> one styled HTML file --chromium--> PDF.

Usage:  python3 scripts/build_pdfs.py [technician|general|extra ...]
Needs:  pandoc, chromium, and `npm install` run once inside site/ (for fonts).
"""
import html
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "site" / "node_modules" / "@fontsource"

CERTS = {
    "technician": dict(
        guide="study-guides/technician/technician-guide.md",
        pool="data/technician-2026-2030.json",
        out="study-guides/technician/Technician-Study-Guide.pdf",
        name="Technician",
        pool_label="2026–2030 pool",
        element="Element 2",
        exam="35 questions · 26 to pass",
        prefix="T",
        subs={
            "T1": "FCC Rules, descriptions and definitions",
            "T2": "Operating procedures",
            "T3": "Radio wave characteristics",
            "T4": "Amateur radio practices and station setup",
            "T5": "Electrical principles",
            "T6": "Electronic and electrical components",
            "T7": "Station equipment",
            "T8": "Modulation modes and operating activities",
            "T9": "Antennas and feed lines",
            "T0": "Safety",
        },
    ),
    "general": dict(
        guide="study-guides/general/general-guide.md",
        pool="data/general-2023-2027.json",
        out="study-guides/general/General-Study-Guide.pdf",
        name="General",
        pool_label="2023–2027 pool",
        element="Element 3",
        exam="35 questions · 26 to pass",
        prefix="G",
        subs={
            "G1": "Commission's rules",
            "G2": "Operating procedures",
            "G3": "Radio wave propagation",
            "G4": "Amateur practices",
            "G5": "Electrical principles",
            "G6": "Circuit components",
            "G7": "Practical circuits",
            "G8": "Signals and emissions",
            "G9": "Antennas and feed lines",
            "G0": "Electrical and RF safety",
        },
    ),
    "extra": dict(
        guide="study-guides/extra/extra-guide.md",
        pool="data/extra-2024-2028.json",
        out="study-guides/extra/Extra-Study-Guide.pdf",
        name="Amateur Extra",
        pool_label="2024–2028 pool",
        element="Element 4",
        exam="50 questions · 37 to pass",
        prefix="E",
        subs={
            "E1": "Commission's rules",
            "E2": "Operating procedures",
            "E3": "Radio wave propagation",
            "E4": "Amateur practices",
            "E5": "Electrical principles",
            "E6": "Circuit components",
            "E7": "Practical circuits",
            "E8": "Signals and emissions",
            "E9": "Antennas and transmission lines",
            "E0": "Safety",
        },
    ),
}

CERTS["antennas"] = dict(
    guide="study-guides/antennas/antenna-guide.md", pool=None, out="study-guides/antennas/Antenna-Handbook.pdf",
    name="Antenna", cover_title="Antenna<br>Handbook", cover_sub="Types, what each is good for, and three cheap builds",
    freq="14.200", meta=("All license classes", "12 antenna types · 3 builds"),
)

CSS = """
@font-face{font-family:'Atkinson';font-weight:400;src:url('file://%(f)s/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-normal.woff2')}
@font-face{font-family:'Atkinson';font-weight:400;font-style:italic;src:url('file://%(f)s/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-400-italic.woff2')}
@font-face{font-family:'Atkinson';font-weight:700;src:url('file://%(f)s/atkinson-hyperlegible/files/atkinson-hyperlegible-latin-700-normal.woff2')}
@font-face{font-family:'Barlow';font-weight:500;src:url('file://%(f)s/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2')}
@font-face{font-family:'Barlow';font-weight:600;src:url('file://%(f)s/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2')}
@font-face{font-family:'Barlow';font-weight:700;src:url('file://%(f)s/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2')}
@font-face{font-family:'Plex Mono';font-weight:400;src:url('file://%(f)s/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2')}
@font-face{font-family:'Plex Mono';font-weight:500;src:url('file://%(f)s/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}

:root{--panel:#26332e;--panel2:#31423b;--amber:#f2a516;--amber-d:#b97800;--ink:#1d2421;--paper:#fbfaf6;--rule:#cfd6cf;--ok:#1f6b45;}
@page{size:Letter;margin:0.8in 0.75in 0.85in}
@page:first{margin:0}
@page{@bottom-center{content:counter(page);font:500 9pt 'Barlow',sans-serif;color:#6b776f}}
*{box-sizing:border-box}
html{font:10.5pt/1.55 'Atkinson',sans-serif;color:var(--ink);background:var(--paper)}
body{margin:0}

.cover{height:11in;width:8.5in;background:var(--panel);color:#e9efe9;padding:0.8in;position:relative;page-break-after:always;overflow:hidden;
  background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 1px,transparent 1px 7px)}
.cover .band{position:absolute;left:0;right:0;top:3.1in;height:1.9in;background:#0f1512;border-top:3px solid #0a0e0c;border-bottom:3px solid #43544c}
.cover .freq{position:absolute;left:0.8in;top:3.35in;font:700 82pt/1 'Plex Mono',monospace;color:var(--amber);letter-spacing:.04em;text-shadow:0 0 18px rgba(242,165,22,.55)}
.cover .freq small{font:500 18pt 'Barlow';color:#a9792a;margin-left:12px;letter-spacing:.1em}
.cover .tick{position:absolute;left:0.8in;right:0.8in;top:4.62in;height:14px;
  background:repeating-linear-gradient(90deg,#8a6a2a 0 2px,transparent 2px 14px)}
.cover .needle{position:absolute;left:4.9in;top:4.42in;width:3px;height:44px;background:#e0432b}
.cover h1{font:700 62pt/0.95 'Barlow',sans-serif;color:#f1f5f1;margin:0;padding:0;border:0;break-before:auto;letter-spacing:.01em;position:absolute;left:0.8in;top:0.85in;text-transform:uppercase}
.cover .sub{position:absolute;left:0.8in;top:2.62in;font:500 17pt 'Barlow';letter-spacing:.06em;color:#b8c4bb}
.cover .meta{position:absolute;left:0.8in;right:0.8in;bottom:0.85in;display:flex;justify-content:space-between;align-items:flex-end;font:500 13pt 'Barlow';letter-spacing:.04em;color:#b8c4bb}
.cover .meta b{color:var(--amber);font-weight:700}
.cover .seventy3{font:700 70pt 'Barlow';color:#3b4d45;line-height:1}

h1,h2,h3,h4{font-family:'Barlow',sans-serif;color:var(--panel);line-height:1.15}
h1{font-size:30pt;font-weight:700;margin:0 0 .35em;padding-top:.1em;break-before:page;text-transform:none;border-bottom:4px solid var(--amber);padding-bottom:.18em}
h1:first-of-type{break-before:auto}
h2{font-size:17pt;font-weight:700;margin:1.4em 0 .4em;padding-left:.55em;border-left:6px solid var(--panel2)}
h3{font-size:13pt;font-weight:600;margin:1.1em 0 .3em}
p{margin:.55em 0;max-width:64ch}
ul,ol{margin:.5em 0;padding-left:1.3em}
li{margin:.22em 0;max-width:68ch}
li::marker{color:var(--amber-d)}
strong{color:#12201a}
a{color:var(--ok)}
code{font-family:'Plex Mono',monospace;font-size:.88em;background:#e8ede8;padding:.05em .3em;border-radius:3px}
pre{font:400 9.5pt/1.35 'Plex Mono',monospace;background:var(--panel);color:#dce8de;padding:.7em 1em;border-radius:4px;break-inside:avoid}
pre code{background:none;padding:0;color:inherit}
blockquote{margin:.9em 0;padding:.6em 1em;border-left:6px solid var(--amber);background:#f3ecd9;break-inside:avoid}
blockquote p{margin:.2em 0}
hr{border:0;border-top:1px dashed var(--rule);margin:1.5em 0}
table{border-collapse:collapse;width:100%;margin:.8em 0;font-size:9.6pt;break-inside:avoid}
th{background:var(--panel);color:#eef3ee;font:600 10pt 'Barlow',sans-serif;text-align:left;letter-spacing:.03em}
th,td{padding:.35em .6em;border:1px solid var(--rule);vertical-align:top}
tr:nth-child(even) td{background:#f1f4ef}

.groupbar{margin:.2em 0 .9em;padding:.5em .8em;background:#eef2ee;border-left:5px solid var(--amber-d);font-size:9pt;color:#33403a;break-inside:avoid}
.groupbar p{margin:.15em 0;max-width:none}
.groupbar b{color:var(--panel)}
blockquote.elmer{background:#e4efe3;border-left-color:#4a7c3a}
blockquote.elmer p:first-child strong:first-child{font-family:'Barlow',sans-serif;font-size:11.5pt;color:#2f5a14}
figure.photo{margin:.9em 0;break-inside:avoid;max-width:4.6in}
figure.photo img{width:100%;max-height:2.6in;object-fit:cover;border:1px solid var(--rule)}
figure.photo.diagram img{object-fit:contain;max-height:none;background:#fff}
figure.photo figcaption{font-size:8.5pt;color:#44514a}
figure.photo .credit{display:block;font-size:7pt;color:#7a867e}
.labnote{margin:.8em 0;padding:.5em .8em;background:#f3ecd9;border-left:5px solid var(--amber);font-size:9.5pt;break-inside:avoid}
.appendix-title{break-before:page}
.sub-head{break-before:page;margin-top:0}
.q{break-inside:avoid;margin:.55em 0 .75em;padding-bottom:.5em;border-bottom:1px dotted var(--rule)}
.q .id{font:600 10pt 'Plex Mono',monospace;color:var(--panel);background:#e8ede8;padding:.05em .4em;border-radius:3px;margin-right:.5em}
.q .refs{font:400 8.5pt 'Plex Mono',monospace;color:#7a867e;float:right}
.q .t{font-weight:700;margin:.15em 0 .3em}
.q ol{list-style:upper-alpha;margin:.2em 0;padding-left:1.5em}
.q li{margin:.12em 0;max-width:none}
.q li.ok{color:var(--ok);font-weight:700}
.q li.ok::after{content:"  ✓";}
.q li.ok::marker{color:var(--ok);font-weight:700}
.figs{display:grid;grid-template-columns:1fr 1fr;gap:.4in}
.figs figure{margin:0;break-inside:avoid}
.figs img{width:100%;border:1px solid var(--rule);background:#fff}
.figs figcaption{font:600 10pt 'Barlow';color:var(--panel);margin-top:.2em}
.fig-one img{width:3.2in;border:1px solid var(--rule);display:block;margin:.3em 0}
"""


def render_question(q):
    opts = []
    for i, a in enumerate(q["answers"]):
        cls = ' class="ok"' if i == q["correct"] else ""
        opts.append(f"<li{cls}>{html.escape(a)}</li>")
    fig = ""
    if q["figure"]:
        fig = f'<div class="fig-one"><img src="file://{ROOT}/data/figures/{q["figure"]}"></div>'
    refs = html.escape(q["refs"]) if q["refs"] else ""
    return (
        f'<div class="q"><span class="refs">{refs}</span>'
        f'<span class="id">{q["id"]}</span>'
        f'<div class="t">{html.escape(q["question"])}</div>{fig}'
        f'<ol>{"".join(opts)}</ol></div>'
    )


def sub_key(qid, prefix):
    return qid[:2]


def build_appendix(cfg):
    pool = json.loads((ROOT / cfg["pool"]).read_text())
    by_sub = {}
    for q in pool:
        by_sub.setdefault(sub_key(q["id"], cfg["prefix"]), []).append(q)
    order = [f"{cfg['prefix']}{n}" for n in (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)]
    out = [
        '<h1 class="appendix-title">Appendix · The full question pool</h1>',
        f"<p>Every question in the {cfg['pool_label']}, with the correct answer marked <b>✓</b> and the "
        "CFR / syllabus reference at right. Questions are grouped the way the exam is built. "
        "The exam draws <b>one question from each group</b> (T1A, T1B, …), so the group letter is a good unit "
        "to study.</p>",
    ]
    figs = sorted({q["figure"] for q in pool if q["figure"]})
    for sub in order:
        qs = by_sub.get(sub, [])
        if not qs:
            continue
        out.append(f'<h2 class="sub-head">{sub} · {html.escape(cfg["subs"][sub])} ({len(qs)} questions)</h2>')
        cur = None
        for q in qs:
            g = q["id"][:3]
            if g != cur:
                cur = g
                out.append(f"<h3>{g}</h3>")
            out.append(render_question(q))
    _ = figs
    return "\n".join(out)


def enhance(body, key):
    """Bring the site's extras into the PDF: group bars, photos with credits, Elmer notes, lab pointers."""
    groups = json.loads((ROOT / "data/groups.json").read_text()).get(key, {})
    rules = json.loads((ROOT / "data/part97-sections.json").read_text())
    credits = json.loads((ROOT / "data/image-credits.json").read_text())

    def bar(m):
        gid = m.group(2)
        g = groups.get(gid)
        if not g:
            return m.group(0)
        parts = []
        if g["official"]:
            parts.append(f"<p><b>Official syllabus:</b> {html.escape(g['official'])}</p>")
        if g["refs"]:
            rs = "; ".join(f"{('§' + r) if r.startswith('97.') else r} {html.escape(rules.get(r, {}).get('title', ''))}" for r in g["refs"])
            parts.append(f"<p><b>Rules behind these questions:</b> {rs}</p>")
        parts.append(f"<p><b>{g['n']} questions</b> in the pool for {gid}; the full list is in the appendix.</p>")
        return m.group(0) + '<div class="groupbar">' + "".join(parts) + "</div>"

    body = re.sub(r"(<h2 id=\"[^\"]*\">([TGE][0-9][A-F]) · .*?</h2>)", bar, body)
    body = body.replace("<blockquote>\n<p><strong>Elmer", '<blockquote class="elmer">\n<p><strong>Elmer')

    def fig(m):
        c = credits.get(m.group(1))
        if not c:
            return ""
        cap = f'<span>{html.escape(m.group(2) or "")}</span>' if m.group(2) else ""
        return (f'<figure class="photo{" diagram" if c["file"].endswith((".png", ".gif")) else ""}"><img src="file://{ROOT}/site/public/{c["file"]}">'
                f'<figcaption>{cap}<span class="credit">Photo: {html.escape(c["author"] or "unknown")} · {html.escape(c["license"])} · {html.escape(c["source"])}</span></figcaption></figure>')

    body = re.sub(r"<!--\s*img:(\w+)(?:\s+(.*?))?\s*-->", fig, body, flags=re.S)
    body = re.sub(r"<!--\s*lab:(\w+)\s*-->",
                  r'<p class="labnote"><b>Hands-on:</b> there is an interactive version of this on <b>The Shack</b> website (Learn or Antennas section).</p>', body)
    return body


def build_one(key):
    cfg = CERTS[key]
    md = ROOT / cfg["guide"]
    body = subprocess.run(
        ["pandoc", "-f", "markdown+pipe_tables-yaml_metadata_block", "-t", "html5", "--wrap=none", str(md)],
        check=True, capture_output=True, text=True,
    ).stdout
    body = enhance(body, key)
    # strip the YAML header pandoc would otherwise print as a paragraph
    body = re.sub(r"^<hr />.*?<hr />", "", body, flags=re.S) if body.startswith("<hr") else body
    appendix = build_appendix(cfg) if cfg["pool"] else ""
    pool = json.loads((ROOT / cfg["pool"]).read_text()) if cfg["pool"] else []
    cover = f"""
    <section class="cover">
      <h1>{cfg.get('cover_title') or html.escape(cfg['name']) + '<br>Class'}</h1>
      <div class="sub">{html.escape(cfg['cover_sub']) if cfg.get('cover_sub') else 'Study guide &amp; full question pool · ' + html.escape(cfg['element'])}</div>
      <div class="band"></div>
      <div class="freq">{ cfg.get('freq') or {'technician':'146.520','general':'14.074','extra':'1296.100'}[key] }<small>MHz</small></div>
      <div class="tick"></div><div class="needle"></div>
      <div class="meta">
        <div>{('<b>' + html.escape(cfg['meta'][0]) + '</b><br>' + html.escape(cfg['meta'][1])) if cfg.get('meta') else '<b>' + html.escape(cfg['pool_label']) + '</b><br>' + str(len(pool)) + '-question pool · ' + html.escape(cfg['exam'])}</div>
        <div class="seventy3">73</div>
      </div>
    </section>"""
    doc = f"""<!doctype html><html><head><meta charset="utf-8"><title>{cfg['name']} Study Guide</title>
<style>{CSS.replace('%(f)s', str(FONTS))}</style></head><body>{cover}{body}{appendix}</body></html>"""
    with tempfile.TemporaryDirectory() as td:
        h = Path(td) / f"{key}.html"
        h.write_text(doc, encoding="utf-8")
        out = ROOT / cfg["out"]
        subprocess.run(
            ["chromium", "--headless=new", "--no-sandbox", "--disable-gpu",
             "--no-pdf-header-footer", f"--print-to-pdf={out}", "--virtual-time-budget=20000",
             f"file://{h}"],
            check=True, capture_output=True,
        )
    print(f"built {out.relative_to(ROOT)}  ({out.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    keys = sys.argv[1:] or list(CERTS)
    for k in keys:
        build_one(k)
