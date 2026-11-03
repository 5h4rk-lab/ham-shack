import sections from '../../../data/part97-sections.json'
import groups from '../../../data/groups.json'

export const groupInfo = (cert, id) => groups[cert]?.[id]
export function ruleInfo(ref) {
  const s = sections[ref]
  return { ref, title: s?.title || 'FCC rule', url: s?.url || `https://www.ecfr.gov/current/title-47/section-${ref}` }
}
// "[97.305, 97.307(b)]" -> [{ref:'97.305', sub:'', ...}, ...]
export function parseRefs(raw = '') {
  const out = []
  for (const part of raw.replace(/[[\]]/g, '').split(',')) {
    const m = part.trim().match(/^(?:FCC )?(97\.\d+|1\.\d+|PRB-1)(\(.*\))?/)
    if (m && !out.some((o) => o.ref === m[1])) out.push({ ...ruleInfo(m[1]), sub: m[2] || '' })
  }
  return out
}
