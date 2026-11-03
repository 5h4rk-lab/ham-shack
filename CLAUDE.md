# ham-radio (The Shack)

All ham radio work for this user lives in this repo: exam prep, the interactive site, and hobby projects.

## Layout
- `data/` question pools (JSON, zero-based `correct` index; `correct_letter` is the safe field) and `figures/`.
- `study-guides/<class>/<class>-guide.md` guide sources. PDFs sit beside them and are generated.
- `site/` React + Vite app. Reads `../data` and `../study-guides` directly (single source of truth).
- `scripts/build_pdfs.py` builds the 3 PDFs (needs pandoc, chromium, and `npm install` in `site/` for fonts).
- `projects/` one folder per build, start from `_template/`.

## Rules for this repo
- Pools rotate: Technician 2026-2030, General 2023-2027, Extra 2024-2028. When one changes, update `data/`, `site/src/lib/certs.js`, `site/src/lib/pool.js`, the `CERTS` dict in `scripts/build_pdfs.py`, and the README table.
- Study-guide facts must match the pool answers. Verify against `data/*.json` (use `correct_letter`) before changing a fact. The guides were audited once; do not "fix" a number from memory.
- Band privileges in `site/src/lib/bandplan.js` mirror Part 97.301-305. Treat edits there as legal-accuracy changes.
- Site design language: Heathkit-style front panel. Barlow Condensed (display), Atkinson Hyperlegible (body), amber on green-gray steel. Keep rack units, lamps, push-buttons. No cream/terracotta, no neon-on-black.
- Any new transmit-capable project README must state the license class required.

## Guide markers
In `study-guides/<class>/*.md`: `<!-- lab:ohm -->` (see `site/src/components/labs.jsx` LABS), `<!-- img:key caption -->` (key from data/image-credits.json), and blockquotes starting `> **Elmer says:**` render as mentor notes. `<!-- group:ID -->` is added by the site automatically. The PDF builder turns the same markers into photos, group bars and "hands-on" pointers.

## Commands
- `cd site && npm run dev` / `npm run build`
- `python3 scripts/build_pdfs.py [technician|general|extra]`
- `python3 scripts/make_banner.py`
- `python3 scripts/build_groups.py` after any pool/syllabus change (writes data/groups.json used by lessons and PDFs)
- `python3 scripts/audit_coverage.py technician --list` to find questions the guide does not teach
- `python3 scripts/fetch_images.py search "query"` / `get key "File:Name.jpg"` for photos. Only freely-licensed Commons images; credits land in data/image-credits.json. Never hotlink or paste unlicensed images, even though the site is personal: it is public on Vercel.
