// Exam facts and subelement titles for the three US license classes.
export const CERTS = {
  technician: {
    key: 'technician', name: 'Technician', short: 'Tech', cls: 'T', prefix: 'T',
    element: 2, exam: 35, pass: 26, pool: '2026–2030',
    blurb: 'Your first license. VHF/UHF voice, digital, satellites, and some HF.',
    subs: {
      T1: 'FCC rules and definitions', T2: 'Operating procedures', T3: 'Radio wave characteristics',
      T4: 'Station setup and practices', T5: 'Electrical principles', T6: 'Components and schematics',
      T7: 'Station equipment', T8: 'Modes and activities', T9: 'Antennas and feed lines', T0: 'Safety',
    },
  },
  general: {
    key: 'general', name: 'General', short: 'General', cls: 'G', prefix: 'G',
    element: 3, exam: 35, pass: 26, pool: '2023–2027',
    blurb: 'Most of every HF band. Worldwide voice and digital.',
    subs: {
      G1: "Commission's rules", G2: 'Operating procedures', G3: 'Radio wave propagation',
      G4: 'Amateur practices', G5: 'Electrical principles', G6: 'Circuit components',
      G7: 'Practical circuits', G8: 'Signals and emissions', G9: 'Antennas and feed lines',
      G0: 'Electrical and RF safety',
    },
  },
  extra: {
    key: 'extra', name: 'Amateur Extra', short: 'Extra', cls: 'E', prefix: 'E',
    element: 4, exam: 50, pass: 37, pool: '2024–2028',
    blurb: 'Every privilege on every band. The engineering exam.',
    subs: {
      E1: "Commission's rules", E2: 'Operating procedures', E3: 'Radio wave propagation',
      E4: 'Amateur practices', E5: 'Electrical principles', E6: 'Circuit components',
      E7: 'Practical circuits', E8: 'Signals and emissions', E9: 'Antennas and transmission lines',
      E0: 'Safety',
    },
  },
}
export const CERT_LIST = Object.values(CERTS)
export const SUB_ORDER = (c) => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => `${CERTS[c].prefix}${n}`)
