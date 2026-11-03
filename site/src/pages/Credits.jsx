import { allCredits } from '../lib/images'
export default function Credits() {
  return (
    <div className="page">
      <header className="pagehead"><h1>Photo credits</h1>
        <p>Every photo on this site is public domain or Creative Commons licensed. Thanks to the photographers. Click a license to see the original and its terms.</p></header>
      <ul className="credits">
        {allCredits().map((c) => (
          <li key={c.key}><img src={`${import.meta.env.BASE_URL}${c.file}`} alt="" loading="lazy" width="96" height="64" />
            <span><b>{c.title.replace(/^File:/, '')}</b><br />{c.author || 'Unknown'} · <a href={c.source} target="_blank" rel="noopener noreferrer">{c.license}</a> · Wikimedia Commons</span></li>))}
      </ul>
      <p className="small">Schematic figures T-1 to T-3, E-series and G-series are from the NCVEC question pools. Photos were fetched with <code>scripts/fetch_images.py</code>, which refuses anything that is not freely licensed.</p>
    </div>
  )
}
