#!/usr/bin/env python3
"""Coverage audit: does the study guide actually teach what each exam question tests?

For every pool question, take the content words of the correct answer (or of the question, when
the answer is "All these choices are correct") and check they appear in the guide section for that
subelement. This is a heuristic: it catches omissions, it cannot prove understanding.

Usage: python3 scripts/audit_coverage.py technician [--list] [--threshold 0.75]
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POOLS = {"technician": ("data/technician-2026-2030.json", "study-guides/technician/technician-guide.md"),
         "general": ("data/general-2023-2027.json", "study-guides/general/general-guide.md"),
         "extra": ("data/extra-2024-2028.json", "study-guides/extra/extra-guide.md")}
STOP = set("""a an the of to in on for and or is are be it its as at by with from that this these those which what when
where who whom whose how why can may must should would will shall do does did not no any all each than then also into
onto over under about between during after before only other such one two your you their they them there here
have has had been being was were if but so use used using type""".split())
NORM = {"hertz": "hz", "kilohertz": "khz", "megahertz": "mhz", "gigahertz": "ghz", "amperes": "ampere", "amps": "ampere",
        "volts": "volt", "watts": "watt", "ohms": "ohm", "meters": "meter", "feet": "foot", "minutes": "minute",
        "years": "year", "inches": "inch", "amperes": "ampere", "milliamperes": "milliampere", "days": "day", "operators": "operator", "stations": "station", "signals": "signal"}


def toks(s):
    s = s.lower().replace("’", "'").replace("ω", " ohm ").replace("-", " ").replace("±", " plus minus ")
    for a, b in (("ten", "10"), ("one thousand", "1000"), ("thousand", "1000"), ("two", "2"), ("one", "1"), ("three", "3"), ("four", "4"), ("five", "5"), ("eight", "8")):
        s = re.sub(rf"\b{a}\b", b, s)
    out = []
    for w in re.findall(r"[a-z0-9][a-z0-9.\-/']*", s):
        w = w.strip(".-/'")
        if not w or w in STOP:
            continue
        w = NORM.get(w, w)
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            w = w[:-1]
        out.append(w)
    return out


def sections(md):
    md = re.sub(r"^---[\s\S]*?---\n", "", md)
    parts = re.split(r"^# ", md, flags=re.M)
    out = {}
    for p in parts:
        head = p.split("\n", 1)[0]
        m = re.match(r"([TGE][0-9]) ·", head)
        if m:
            out[m.group(1)] = p
        elif head.strip():
            out.setdefault("_other", "")
            out["_other"] += p
    return out


def main():
    cert = sys.argv[1]
    thr = 0.75
    if "--threshold" in sys.argv:
        thr = float(sys.argv[sys.argv.index("--threshold") + 1])
    pool = json.loads((ROOT / POOLS[cert][0]).read_text())
    secs = sections((ROOT / POOLS[cert][1]).read_text())
    sec_tok = {k: set(toks(v)) for k, v in secs.items()}
    allt = set().union(*sec_tok.values())
    weak = []
    for q in pool:
        ans = q["answers"][q["correct"]]
        pos = bool(re.search(r"all these choices|none of", ans, re.I))
        want = toks(q["question"] if pos else ans)
        if not want:
            continue
        have = sec_tok.get(q["id"][:2], set())
        hit = sum(1 for w in want if w in have) / len(want)
        if hit < thr:
            weak.append((hit, q["id"], q["question"], ans, [w for w in want if w not in have]))
    print(f"{cert}: {len(pool) - len(weak)}/{len(pool)} questions have their answer content in the right section (threshold {thr})")
    if "--list" in sys.argv:
        for h, i, qq, a, miss in sorted(weak, key=lambda x: x[1]):
            print(f"{i} {h:.2f} | {qq[:80]} => {a[:70]} | missing: {' '.join(miss[:8])}")
    return weak


if __name__ == "__main__":
    main()
