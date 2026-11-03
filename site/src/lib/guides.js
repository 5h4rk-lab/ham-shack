import { marked } from 'marked'

// The same markdown files that become the PDFs, split into one lesson per subelement.
// Markers in the markdown (<!-- lab:x -->, <!-- img:x -->) become React widgets in the Learn page.
const raw = import.meta.glob('../../../study-guides/*/*-guide.md', { query: '?raw', import: 'default', eager: true })
const byCert = {}
for (const [path, text] of Object.entries(raw)) byCert[path.split('/').at(-2)] = text

function decorate(html) {
  return html
    // group headings get an id and a marker where the GroupBar goes
    .replace(/<h2>([TGE][0-9][A-F]) · (.*?)<\/h2>/g, '<h2 id="$1">$1 · $2</h2><!-- group:$1 -->')
    .replace(/<blockquote>\s*<p><strong>Elmer/g, '<blockquote class="elmer"><p><strong>Elmer')
}

export function lessons(cert) {
  const text = (byCert[cert] || '').replace(/^---[\s\S]*?---\n/, '')
  const parts = text.split(/^# /m).filter((p) => p.trim())
  return parts.map((p) => {
    const nl = p.indexOf('\n')
    const heading = p.slice(0, nl).trim()
    const body = p.slice(nl + 1).replace(/\n---\s*$/, '')
    const m = heading.match(/^([TGE][0-9]) · (.*?)(?: \((\d+) exam questions?\))?$/)
    const id = m ? m[1] : /cram/i.test(heading) ? 'cram' : 'start'
    const html = decorate(marked.parse(body))
    const groupIds = [...html.matchAll(/<!-- group:([TGE][0-9][A-F]) -->/g)].map((x) => x[1])
    return { id, heading, title: m ? m[2] : heading, examQs: m?.[3] ? +m[3] : null, html, groupIds }
  })
}

// The antenna handbook: same markdown pipeline, headings carry their own ids ({#id}).
export function antennaLessons() {
  const text = (byCert.antennas || '').replace(/^---[\s\S]*?---\n/, '')
  return text.split(/^# /m).filter((p) => p.trim()).map((p, i) => {
    const nl = p.indexOf('\n')
    const heading = p.slice(0, nl).trim()
    const m = heading.match(/^(.*?)\s*\{#([\w-]+)\}$/)
    const body = p.slice(nl + 1).replace(/\n---\s*$/, '')
    const html = marked.parse(body)
      .replace(/<h2>(.*?)\s*\{#([\w-]+)\}<\/h2>/g, '<h2 id="$2">$1</h2>')
      .replace(/<blockquote>\s*<p><strong>Elmer/g, '<blockquote class="elmer"><p><strong>Elmer')
    const title = m ? m[1] : heading
    return { id: m ? m[2] : title.toLowerCase().replace(/\W+/g, '-'), title, html, groupIds: [], badge: String(i + 1) }
  })
}
