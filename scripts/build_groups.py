#!/usr/bin/env python3
"""Generate data/groups.json: for every question group, its official syllabus title (when known),
how many questions it has, and the FCC rule sections its questions cite.
Run after updating data/*.json or data/syllabus-*.json."""
import json, re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
POOLS = {"technician": "technician-2026-2030", "general": "general-2023-2027", "extra": "extra-2024-2028"}
rules = json.loads((ROOT / "data/part97-sections.json").read_text())

def sections(refs):
    out = []
    for r in re.findall(r"[^,\[\]]+", refs):
        r = r.strip()
        m = re.match(r"(?:FCC )?(97\.\d+|1\.\d+|PRB-1)", r)
        if m and m.group(1) not in out:
            out.append(m.group(1))
    return out

result = {}
for cert, name in POOLS.items():
    pool = json.loads((ROOT / f"data/{name}.json").read_text())
    syl_path = ROOT / f"data/syllabus-{cert}.json"
    syl = json.loads(syl_path.read_text()) if syl_path.exists() else {"groups": {}, "subelements": {}}
    groups = {}
    for q in pool:
        g = q["id"][:3]
        e = groups.setdefault(g, {"n": 0, "refs": [], "official": syl["groups"].get(g, "")})
        e["n"] += 1
        for s in sections(q["refs"]):
            if s not in e["refs"]:
                e["refs"].append(s)
    for e in groups.values():
        e["refs"].sort(key=lambda s: [int(x) if x.isdigit() else 0 for x in re.split(r"[.]", s)])
        unknown = [s for s in e["refs"] if s not in rules]
        if unknown:
            print("no title for", unknown)
    result[cert] = dict(sorted(groups.items()))
(ROOT / "data/groups.json").write_text(json.dumps(result, indent=1, ensure_ascii=False))
print({c: len(g) for c, g in result.items()})
