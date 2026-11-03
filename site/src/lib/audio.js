// A tiny software receiver: band noise plus whatever stations sit near the dial.
import { stationsBetween, level, ft8Tone } from './signals'

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

export class Receiver {
  constructor() { this.ctx = null; this.voices = new Map(); this.f = 28.35; this.vol = 0.8 }
  get on() { return !!this.ctx }

  async start() {
    if (this.ctx) return
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)())
    this.out = ctx.createGain(); this.out.gain.value = this.vol
    const comp = ctx.createDynamicsCompressor()
    this.out.connect(comp); comp.connect(ctx.destination)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    this.noise = ctx.createBufferSource(); this.noise.buffer = buf; this.noise.loop = true
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.4
    this.noiseGain = ctx.createGain(); this.noiseGain.gain.value = 0.1
    this.noise.connect(bp); bp.connect(this.noiseGain); this.noiseGain.connect(this.out)
    this.noise.start()
    this.noiseBuf = buf
    this.base = Date.now() / 1000 - ctx.currentTime
    this.timer = setInterval(() => this.tick(), 120)
    if (ctx.state === 'suspended') await ctx.resume()
  }
  stop() {
    clearInterval(this.timer)
    this.voices.forEach((v) => this.kill(v))
    this.voices.clear()
    this.ctx?.close(); this.ctx = null
  }
  tune(mhz) { this.f = mhz }
  setVolume(v) { this.vol = v; if (this.out) this.out.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02) }

  kill(v) { try { v.nodes.forEach((n) => { n.stop?.(); n.disconnect?.() }) } catch {} }

  voice(st) {
    const ctx = this.ctx
    const g = ctx.createGain(); g.gain.value = 0; g.connect(this.out)
    const nodes = [g]
    const v = { st, g, nodes, osc: null }
    if (st.kind === 'cw' || st.kind === 'ft8') {
      v.osc = ctx.createOscillator(); v.osc.type = 'sine'; v.osc.connect(g); v.osc.start(); nodes.push(v.osc)
    } else if (st.kind === 'ssb' || st.kind === 'fm') {
      const src = ctx.createBufferSource(); src.buffer = this.noiseBuf; src.loop = true
      src.loopStart = Math.random(); src.start()
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = st.kind === 'fm' ? 0.5 : 1.2
      src.connect(f); f.connect(g); v.filter = f; nodes.push(src, f)
    } else if (st.kind === 'bcast') {
      for (const hz of [220, 277.2, 329.6]) {
        const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = hz * (1 + (st.id % 3) * 0.12)
        const og = ctx.createGain(); og.gain.value = 0.33; o.connect(og); og.connect(g); o.start(); nodes.push(o, og)
      }
    } else if (st.kind === 'wwv') {
      v.osc = ctx.createOscillator(); v.osc.frequency.value = 1000; v.osc.connect(g); v.osc.start(); nodes.push(v.osc)
    }
    return v
  }

  tick() {
    const ctx = this.ctx; if (!ctx) return
    const ft = this.f, now = Date.now() / 1000
    const near = stationsBetween(ft - 0.0045, ft + 0.0045).filter((s) => {
      const off = (s.f - ft) * 1000
      if (s.kind === 'ssb') return off > -1.2 && off < 3.4
      if (s.kind === 'fm' || s.kind === 'bcast') return Math.abs(off) < 6
      return Math.abs(off) < 3
    })
    const ids = new Set(near.map((s) => s.id))
    for (const [id, v] of this.voices) if (!ids.has(id)) { v.g.gain.setTargetAtTime(0, ctx.currentTime, 0.03); setTimeout(() => this.kill(v), 200); this.voices.delete(id) }
    // band noise: louder lower down
    this.noiseGain.gain.setTargetAtTime(ft < 30 ? 0.16 : ft < 200 ? 0.07 : 0.03, ctx.currentTime, 0.05)

    for (const s of near) {
      let v = this.voices.get(s.id)
      if (!v) { v = this.voice(s); this.voices.set(s.id, v) }
      const off = (s.f - ft) * 1000
      const t0 = ctx.currentTime
      const span = 0.16, step = 0.01
      if (s.kind === 'cw') {
        v.osc.frequency.setTargetAtTime(clamp(700 + off * 1000, 200, 3000), t0, 0.02)
        for (let t = 0; t < span; t += step) v.g.gain.linearRampToValueAtTime(level(s, now + t) * 0.5 * s.amp, t0 + t + 0.006)
      } else if (s.kind === 'ft8') {
        for (let t = 0; t < span; t += 0.04) {
          v.osc.frequency.setValueAtTime(clamp(700 + off * 1000 + ft8Tone(s, now + t) * 18, 200, 3000), t0 + t)
          v.g.gain.setValueAtTime(level(s, now + t) * 0.18, t0 + t)
        }
      } else if (s.kind === 'ssb') {
        v.filter.frequency.setTargetAtTime(clamp(off * 1000 + 1500, 250, 3200), t0, 0.05)
        for (let t = 0; t < span; t += step) v.g.gain.linearRampToValueAtTime(level(s, now + t) * 1.1, t0 + t + 0.01)
      } else if (s.kind === 'fm') {
        v.filter.frequency.value = 1300
        for (let t = 0; t < span; t += step) v.g.gain.linearRampToValueAtTime(level(s, now + t) * 0.9, t0 + t + 0.01)
      } else if (s.kind === 'bcast') {
        v.g.gain.setTargetAtTime(0.12, t0, 0.05)
      } else if (s.kind === 'wwv') {
        for (let t = 0; t < span; t += step) { const sec = (now + t) % 1; v.g.gain.linearRampToValueAtTime(sec < 0.006 ? 0.5 : 0, t0 + t + 0.002) }
      }
    }
  }
}

// Morse sounds for the trainer.
export function playMorse(ctx, timeline, unit, pitch, vol = 0.4) {
  const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination)
  const o = ctx.createOscillator(); o.frequency.value = pitch; o.connect(g); o.start()
  let t = ctx.currentTime + 0.05
  for (const [on, len] of timeline) {
    if (on) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.004); g.gain.setValueAtTime(vol, t + len * unit - 0.004); g.gain.linearRampToValueAtTime(0, t + len * unit) }
    t += len * unit
  }
  o.stop(t + 0.1)
  return t - ctx.currentTime
}
