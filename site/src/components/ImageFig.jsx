import { imageInfo, imageUrl } from '../lib/images'

// A photo with a small credit line linking to its source and license.
export default function ImageFig({ name, caption, wide }) {
  const info = imageInfo(name)
  if (!info) return null
  return (
    <figure className={`photo ${wide ? 'wide' : ''}`}>
      <img src={imageUrl(name)} alt={caption || info.title.replace(/^File:|\.\w+$/g, '')} loading="lazy" />
      <figcaption>
        {caption && <span className="cap">{caption}</span>}
        <span className="credit">
          Photo: {info.author || 'unknown'} · <a href={info.source} target="_blank" rel="noopener noreferrer">{info.license}</a>
        </span>
      </figcaption>
    </figure>
  )
}
