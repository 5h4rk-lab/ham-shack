// US amateur privileges (Part 97.301-97.305) as used by the dial.
// Frequencies in MHz. `min` is the lowest license class that may transmit there.
// kind drives the simulated signals: cw | ssb | fm | data
const T = 'T', G = 'G', E = 'E'
export const RANK = { T: 1, G: 2, E: 3 }

export const BANDS = [
  { name: '160 m', lo: 1.8, hi: 2.0, jump: 1.9 },
  { name: '80 m', lo: 3.5, hi: 4.0, jump: 3.573 },
  { name: '60 m', lo: 5.33, hi: 5.41, jump: 5.3585 },
  { name: '40 m', lo: 7.0, hi: 7.3, jump: 7.074 },
  { name: '30 m', lo: 10.1, hi: 10.15, jump: 10.136 },
  { name: '20 m', lo: 14.0, hi: 14.35, jump: 14.074 },
  { name: '17 m', lo: 18.068, hi: 18.168, jump: 18.1 },
  { name: '15 m', lo: 21.0, hi: 21.45, jump: 21.074 },
  { name: '12 m', lo: 24.89, hi: 24.99, jump: 24.915 },
  { name: '10 m', lo: 28.0, hi: 29.7, jump: 28.4 },
  { name: '6 m', lo: 50.0, hi: 54.0, jump: 50.313 },
  { name: '2 m', lo: 144.0, hi: 148.0, jump: 146.52 },
  { name: '1.25 m', lo: 222.0, hi: 225.0, jump: 223.5 },
  { name: '70 cm', lo: 420.0, hi: 450.0, jump: 446.0 },
]

// [lo, hi, min class, mode text, kind, technician-specific text]
const S = [
  [1.8, 2.0, G, 'CW · phone · data', 'ssb'],
  [3.5, 3.525, E, 'CW · data', 'cw'],
  [3.525, 3.6, T, 'CW · data', 'cw', 'CW only'],
  [3.6, 3.8, E, 'Phone', 'ssb'],
  [3.8, 4.0, G, 'Phone', 'ssb'],
  [5.3305, 5.3335, G, '60 m channel 1 (USB)', 'ssb'],
  [5.3465, 5.3495, G, '60 m channel 2 (USB)', 'ssb'],
  [5.357, 5.36, G, '60 m channel 3 (USB)', 'ssb'],
  [5.3715, 5.3745, G, '60 m channel 4 (USB)', 'ssb'],
  [5.4035, 5.4065, G, '60 m channel 5 (USB)', 'ssb'],
  [7.0, 7.025, E, 'CW · data', 'cw'],
  [7.025, 7.125, T, 'CW · data', 'cw', 'CW only'],
  [7.125, 7.175, E, 'Phone', 'ssb'],
  [7.175, 7.3, G, 'Phone', 'ssb'],
  [10.1, 10.15, G, 'CW · data only (no phone)', 'cw'],
  [14.0, 14.025, E, 'CW · data', 'cw'],
  [14.025, 14.15, G, 'CW · data', 'cw'],
  [14.15, 14.225, E, 'Phone', 'ssb'],
  [14.225, 14.35, G, 'Phone', 'ssb'],
  [18.068, 18.11, G, 'CW · data', 'cw'],
  [18.11, 18.168, G, 'Phone', 'ssb'],
  [21.0, 21.025, E, 'CW · data', 'cw'],
  [21.025, 21.2, T, 'CW · data', 'cw', 'CW only'],
  [21.2, 21.275, E, 'Phone', 'ssb'],
  [21.275, 21.45, G, 'Phone', 'ssb'],
  [24.89, 24.93, G, 'CW · data', 'cw'],
  [24.93, 24.99, G, 'Phone', 'ssb'],
  [28.0, 28.3, T, 'CW · data', 'cw'],
  [28.3, 28.5, T, 'Phone (SSB)', 'ssb'],
  [28.5, 29.5, G, 'Phone', 'ssb'],
  [29.5, 29.7, G, 'Phone · FM repeaters', 'fm'],
  [50.0, 50.1, T, 'CW only', 'cw'],
  [50.1, 50.5, T, 'SSB · digital', 'ssb'],
  [50.5, 54.0, T, 'FM · repeaters · all modes', 'fm'],
  [144.0, 144.1, T, 'CW only', 'cw'],
  [144.1, 144.5, T, 'SSB · weak signal', 'ssb'],
  [144.5, 148.0, T, 'FM · repeaters · simplex', 'fm'],
  [222.0, 225.0, T, 'All modes', 'fm'],
  [420.0, 450.0, T, 'All modes · repeaters', 'fm'],
]
export const SEGMENTS = S.map(([lo, hi, min, mode, kind, tech]) => ({ lo, hi, min, mode, kind, tech }))

// Things you will hear that are NOT amateur radio. Don't transmit here.
export const OTHER = [
  [0.53, 1.705, 'AM broadcast'], [2.495, 2.505, 'WWV time signal'], [4.995, 5.005, 'WWV time signal'],
  [5.9, 6.2, 'Shortwave broadcast'], [9.4, 9.9, 'Shortwave broadcast'], [9.995, 10.005, 'WWV time signal'],
  [11.6, 12.1, 'Shortwave broadcast'], [13.57, 13.87, 'Shortwave broadcast'], [14.995, 15.005, 'WWV time signal'],
  [15.1, 15.8, 'Shortwave broadcast'], [17.48, 17.9, 'Shortwave broadcast'], [21.45, 21.85, 'Shortwave broadcast'],
  [25.67, 26.1, 'Shortwave broadcast'], [26.965, 27.405, 'CB radio'], [87.5, 108, 'FM broadcast'],
  [108, 118, 'Aircraft navigation'], [118, 137, 'Aircraft voice (AM)'], [156, 162, 'Marine VHF'],
  [162.4, 162.55, 'NOAA weather radio'], [150, 174, 'Public safety and business'], [174, 216, 'TV channels 7–13'],
  [462.5, 467.75, 'FRS / GMRS'], [470, 608, 'UHF TV'],
]

export function describe(mhz, cls) {
  const band = BANDS.find((b) => mhz >= b.lo - 1e-9 && mhz <= b.hi + 1e-9)
  const seg = SEGMENTS.find((s) => mhz >= s.lo - 1e-9 && mhz < s.hi + 1e-9)
  const can = (c) => !!seg && RANK[c] >= RANK[seg.min]
  const allowed = { T: can(T), G: can(G), E: can(E) }
  let note = ''
  if (!band) {
    const o = OTHER.find(([lo, hi]) => mhz >= lo && mhz <= hi)
    note = o ? `${o[2]}. Not an amateur band.` : 'Outside every amateur band.'
  } else if (!seg) {
    note = 'Inside the band edges, but not a legal amateur segment (60 m is channelized).'
  } else if (!allowed[cls]) {
    const who = seg.min === E ? 'Amateur Extra only' : 'General and Extra'
    note = `${who} here. You can listen, but not transmit.`
  } else if (cls === T && seg.tech) {
    note = `Technician: ${seg.tech}.`
  } else {
    note = 'You may transmit here with your license class.'
  }
  const edge = band && seg ? Math.min(mhz - seg.lo, seg.hi - mhz) : null
  return { band, seg, allowed, note, nearEdge: edge !== null && edge < 0.002 }
}
export const modeAt = (mhz) => SEGMENTS.find((s) => mhz >= s.lo && mhz < s.hi)?.kind || null
export const isFT8 = (mhz) => FT8.some((f) => mhz >= f && mhz < f + 0.003)
export const FT8 = [1.84, 3.573, 7.074, 10.136, 14.074, 18.1, 21.074, 24.915, 28.074, 50.313, 144.174]
