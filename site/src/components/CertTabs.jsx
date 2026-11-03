import { CERT_LIST } from '../lib/certs'
import { useStore, setCert } from '../lib/store'
export default function CertTabs() {
  const { cert } = useStore()
  return (
    <div className="certtabs" role="tablist" aria-label="License class">
      {CERT_LIST.map((c) => (
        <button key={c.key} role="tab" aria-selected={cert === c.key} className={`pb ${cert === c.key ? 'on' : ''}`} onClick={() => setCert(c.key)}>
          {c.name}
        </button>
      ))}
    </div>
  )
}
