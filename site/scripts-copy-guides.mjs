// Copies the built PDFs next to the site so the Learn page can offer downloads.
import { mkdirSync, copyFileSync, existsSync } from 'node:fs'
const out = new URL('./public/guides/', import.meta.url)
mkdirSync(out, { recursive: true })
for (const [d, f] of [['technician', 'Technician'], ['general', 'General'], ['extra', 'Extra']]) {
  const src = new URL(`../study-guides/${d}/${f}-Study-Guide.pdf`, import.meta.url)
  if (existsSync(src)) copyFileSync(src, new URL(`${f}-Study-Guide.pdf`, out))
  else console.warn(`missing ${f} PDF (run python3 scripts/build_pdfs.py)`)
}
