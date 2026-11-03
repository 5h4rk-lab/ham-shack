# Question pools

| File | Pool | Questions | Valid for exams |
|---|---|---|---|
| `technician-2026-2030.json` | Element 2 | 409 | Jul 1 2026 to Jun 30 2030 (includes the Feb 19 2026 errata) |
| `general-2023-2027.json` | Element 3 | 423 | Jul 1 2023 to Jun 30 2027 |
| `extra-2024-2028.json` | Element 4 | 599 | Jul 1 2024 to Jun 30 2028 |

Each entry:

```json
{ "id": "T1A01", "correct": 2, "correct_letter": "C", "refs": "[97.1]",
  "question": "...", "answers": ["...", "...", "...", "..."], "figure": "" }
```

`correct` is a **zero-based** index into `answers`. `figure` is a file in `figures/` when the question refers to a diagram.

Source: NCVEC, converted by russolsen/ham_radio_question_pool (Apache-2.0). When a new pool is released, drop the new JSON here, update `site/src/lib/pool.js` and `site/src/lib/certs.js`, and re-run `scripts/build_pdfs.py`.
