import credits from '../../../data/image-credits.json'
export const imageInfo = (key) => credits[key]
export const imageUrl = (key) => (credits[key] ? `${import.meta.env.BASE_URL}${credits[key].file}` : '')
export const allCredits = () => Object.entries(credits).map(([key, v]) => ({ key, ...v }))
