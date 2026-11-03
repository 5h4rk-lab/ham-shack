import { marked } from 'marked'

// The same markdown files that become the PDFs, split into one lesson per subelement.
const raw = import.meta.glob('../../../study-guides/*/*-guide.md', { query: '?raw', import: 'default', eager: true })
const byCert = {}
for (const [path, text] of Object.entries(raw)) byCert[path.split('/').at(-2)] = text

export function lessons(cert) {
  const text = (byCert[cert] || '').replace(/^---[\s\S]*?---\n/, '')
  const parts = text.split(/^# /m).filter((p) => p.trim())
  return parts.map((p) => {
    const nl = p.indexOf('\n')
    const heading = p.slice(0, nl).trim()
    const body = p.slice(nl + 1).replace(/\n---\s*$/, '')
    const m = heading.match(/^([TGE][0-9]) · (.*?)(?: \((\d+) exam questions?\))?$/)
    const id = m ? m[1] : /cram/i.test(heading) ? 'cram' : 'start'
    return { id, heading, title: m ? m[2] : heading, examQs: m?.[3] ? +m[3] : null, html: marked.parse(body) }
  })
}
