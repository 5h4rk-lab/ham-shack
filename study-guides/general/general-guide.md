---
title: "General Class Study Guide"
subtitle: "FCC Element 3 · Question pool 2023–2027 (valid July 1, 2023 – June 30, 2027)"
---

# Start here

General is where the HF bands open up. You get big chunks of every HF band, which means worldwide voice, FT8 from your couch, and DX on 20 m at lunch. The exam is also the first one that expects you to *understand* radio rather than recite it.

| Fact | Detail |
|---|---|
| Questions on exam | 35 |
| Passing score | 26 correct (74%) |
| Pool size | 423 questions, 10 subelements |
| Prerequisite | A Technician license (or credit for Element 2) |
| Structure | Same trick as Technician: one question is drawn from each question group (G1A, G1B, …, G0C) |

**Pool date check.** This pool runs through **June 30, 2027**. A new General pool will replace it. Always confirm the pool date with your VE team or at ncvec.org before you study from any book.

**How to use this guide.** It is a companion, not a replacement for practice. Read a subelement, then drill its questions in the web app, then come back for the topics you missed. The appendix has every pool question with the answer and the CFR reference.

---

# G1 · Commission's Rules (5 exam questions)

## Where General operators can transmit

Memorize this table. Frequencies in MHz. "Phone" means voice (SSB).

| Band | CW / data | Phone (voice) | Notes |
|---|---|---|---|
| 160 m | 1.800–2.000 | 1.800–2.000 | all modes, whole band |
| 80 m | 3.525–3.600 | 3.800–4.000 | |
| 60 m | five channels only | USB | channelized, see below |
| 40 m | 7.025–7.125 | 7.175–7.300 | General **cannot** use 7.125–7.175 |
| 30 m | 10.100–10.150 | **no phone** | CW and data only, **200 W PEP max** |
| 20 m | 14.025–14.150 | 14.225–14.350 | |
| 17 m | 18.068–18.110 | 18.110–18.168 | |
| 15 m | 21.025–21.200 | 21.275–21.450 | |
| 12 m | 24.890–24.930 | 24.930–24.990 | |
| 10 m | 28.000–28.300 | 28.300–29.700 | **entire band**; repeaters above 29.5 |

* **Image (SSTV/fax) transmissions are prohibited on 30 m**, and phone is prohibited there too.
* Amateur Extra gets exclusive segments on **80, 40, 20 and 15 m** (the pool answer to "which bands have exclusive Extra segments").
* If a band's voice segment is only partly open to General, you get **the upper frequency portion.**
* **60 m:** five channels, USB (CW and data are allowed on the channel center frequency), max bandwidth **2.8 kHz**. If you use an antenna other than a dipole, you must keep a record of the antenna gain.

## Power

* **1500 W PEP** is the legal limit on every band that does not have a lower limit.
* **200 W PEP** on **30 m** (10.100–10.150 MHz).
* **60 m** is limited by ERP, not output power.
* **PEP output from the transmitter** is the measurement the rules use for maximum power.
* Use only the power necessary to carry out the desired communication (good practice, and a rule).

## Beacons, one-way transmissions, antennas

* **Beacon:** observation of propagation and reception. Max **100 W PEP.** Only **one beacon per band from the same station location.** HF beacons: **28.20 to 28.30 MHz**.
* **Beacon frequencies to avoid transmitting on:** **14.100, 18.110, 21.150, 24.930, 28.200 MHz** (the International Beacon Project).
* Permitted one-way transmissions: **code practice**, bulletins, beacons, and occasional **weather and propagation forecast** retransmissions.
* **Abbreviations and procedural signals** are allowed if they do not obscure meaning.
* **Antenna height:** no FAA notification needed for structures **under 200 feet** that are not near a public use airport. Local governments must **reasonably accommodate** amateur service communications (**PRB-1**).
* **Good engineering and good amateur practice** is determined by **the FCC.**
* **Digital protocols:** you must **publicly document the technical characteristics** of a new protocol before using it on the air.
* **Spread spectrum:** max **10 W PEP.** **ITU Region 2** covers North and South America.
* **Wi-Fi sharing on 2.4 GHz:** no part of the band is available to talk to unlicensed Wi-Fi.

## VE rules and licensing

* **VEC (Volunteer Examiner Coordinator)** accredits VEs.
* **VE minimum age: 18.** A General VE may give **Technician** exams only. **Three VEs, General or higher**, must observe a Technician exam.
* A **CSCE** (Certificate of Successful Completion of Examination) is valid for **365 days**.
* Until an upgrade shows in the FCC database, a Technician who has passed the General exam must **identify with the added indicator the FCC specifies whenever they operate using General class frequency privileges** (the pool's answer). Once the upgrade shows in the database, that requirement ends.
* **Remote control from outside the country:** you need a **US operator/primary station license.** If you remote a station in **another country**, **only that country's regulations** apply.
* **Third-party traffic:** a third party with a revoked license cannot participate. Third-party messages with a country that has a third-party agreement are limited to **amateur radio topics and remarks of a personal character.**

---

# G2 · Operating Procedures (5 exam questions)

## Sidebands and modes

* **Below 10 MHz: LSB.** **Above 10 MHz: USB.** The only exception: **60 m uses USB.**
* **CW** is narrowest and cuts through noise best.
* **Voice break-in (VOX)** keys the transmitter by sensing your voice.
* **Split operation:** transmit on one frequency, receive on another. Common during a DX pile-up when the DX station says "listening up 5."
* **Speech processing (compression)** raises average power. Too much causes distortion and splatter.
* **RIT / clarifier** shifts receive frequency only.
* **FT8 dial frequencies (USB, MHz):** 160 m 1.840 · 80 m 3.573 · 40 m 7.074 · 30 m 10.136 · 20 m 14.074 · 17 m 18.100 · 15 m 21.074 · 12 m 24.915 · 10 m 28.074 · 6 m 50.313. Look for them. They are the hot spots.
* **PSK31** on 20 m: around 14.070. **RTTY** sits above CW.
* **FT8 needs your computer's clock accurate to within about a second.** Sync with an internet time source.

## Procedure

* **QSO flow:** CQ → reply → exchange (name, QTH, signal report) → sign off with call signs.
* **Signal report RST:** Readability (1–5), Strength (1–9), Tone (1–9, CW only). A phone report is usually just "5 and 9" or "59."
* **S-meter:** each S-unit is **6 dB**. Above S9, readings are in **10 dB** steps ("S9 plus 20").
* **Calling DX:** listen first. Give your call sign phonetically once or twice, not a long chant. Don't call on the DX station's transmit frequency if they are working split.
* **Contest etiquette:** exchange only what the contest requires. Know the sponsor's rules.
* **Prosigns:** AR (end of message), SK (end of contact), BT (pause/break), K (go ahead), KN (go ahead only named station).
* **Frequency courtesy:** ask "Is the frequency in use?" before settling in. If someone says yes, move.
* **Emergency:** Any frequency may be used for emergency communication, as long as FCC rules about the immediate safety of life and property are met. Never call "MAYDAY" casually.

---

# G3 · Radio Wave Propagation (3 exam questions)

## The ionosphere

| Layer | Day/night | Effect on HF |
|---|---|---|
| **D** | daytime only | **absorbs** HF, mostly **below ~10 MHz.** Disappears at night. This is why 80 and 160 m open up after sunset. |
| **E** | mostly daytime | refracts some HF. **Sporadic E** gives surprise VHF openings. |
| **F** (F1, F2) | day and night; F1 and F2 merge at night | **the** long-distance layer. F2 is highest. |

* **Critical frequency:** the highest frequency a signal sent straight up will still return from the ionosphere.
* **MUF (maximum usable frequency):** the highest frequency that works between two specific points. **LUF (lowest usable frequency)** is set by D-layer absorption and noise.
* **Skip zone:** the area between where the ground wave dies and where the sky wave lands.
* **Gray line:** the twilight band around the Earth. Propagation along it can be **unusually strong, even on bands not normally open.**
* **NVIS:** Near-Vertical Incidence Skywave, using **high-angle radiation** on 80/40 m for regional coverage (up to a few hundred miles).

## The sun

* **Sunspot cycle:** about **11 years**. More sunspots = more ionization = **higher MUF**, so 10, 12, 15, and 17 m open worldwide near the peak.
* **Solar flux index (SFI):** the 10.7 cm radio flux. A higher SFI is good for HF, especially 20 m and up. SFI above ~100 is "good", above ~150 is "great."
* **A-index** (daily, 0–400) and **K-index** (3-hour, 0–9) measure geomagnetic activity. **Low is good.** K=0–1 is quiet. High K or A means disturbance and poorer high-latitude paths.
* **Solar flares** cause a **sudden ionospheric disturbance (SID) / radio blackout** on the sunlit side in minutes, lasting minutes to hours. They impact **lower HF the hardest.**
* **Geomagnetic storms** hit **polar paths** first.
* **Time of day cheat:**
  * 160, 80, 40 m: **night**
  * 30, 20 m: day and night, 20 m is the DX workhorse
  * 17, 15, 12, 10 m: **daytime**, and only when solar activity is up

---

# G4 · Amateur Practices (5 exam questions)

## Transceiver controls

* **ALC (automatic level control):** prevents overdriving the amplifier. Watching ALC on SSB/digital keeps the signal clean. Too much audio drive → distortion and wide, ugly signal.
* **Noise blanker:** reduces **short, repetitive pulse noise** (car ignition). **Noise reduction (DSP)** helps with steady noise. **Notch filter** removes a single carrier or tone.
* **IF shift / passband tuning** moves the filter without moving the displayed frequency.
* **AGC** sets receiver gain automatically. **Fast AGC** for CW, **slow AGC** for SSB.
* **Filter bandwidths:** CW **~250–500 Hz**, SSB **~2.4–2.8 kHz**, digital modes follow the mode.

## Digital stations

* **Sound-card modes** (FT8, PSK31) use the computer's audio. Set the audio level so ALC stays barely moving.
* **VARA, Winlink, Pactor, ARQ** retransmit corrupted data. **FEC** (forward error correction) sends extra data so the receiver can fix errors without a request. Know the difference.
* **Grid square** and **callsign** exchange is the structure of FT8.

## Station safety

* **RF burn and shock:** ground the station, bond equipment to a single-point ground.
* **Lightning:** disconnect antennas during storms and use a lightning arrester at the feed-line entry.
* **Ferrite chokes** on feed lines and cables reduce common-mode RF.
* **Never** leave a transmitter on a dummy load of the wrong power rating.
* **Ground loops** cause hum; fix with a single-point ground and isolation.

---

# G5 · Electrical Principles (3 exam questions)

## Waveform measures

| For a sine wave | Relationship |
|---|---|
| **RMS** | 0.707 × peak |
| **Peak** | 1.414 × RMS |
| **Peak-to-peak** | 2 × peak |
| **PEP** | (0.707 × V peak)² / R |

**Example.** 100 V RMS across 50 Ω → P = 100² / 50 = **200 W.**

## Resistors, capacitors and inductors

* **Resistors in series:** add. **Resistors in parallel:** 1/R = 1/R1 + 1/R2 + … **Two equal resistors in parallel** = half of one. Two resistors: R = (R1 × R2) / (R1 + R2).
* **Capacitors:** parallel add. Series: **reciprocal** like parallel resistors.
* **Inductors:** series add. Parallel: reciprocal.
* **Power:** P = E × I = I² × R = E² / R.
* **Reactance:**
  * **X_L = 2πfL** (rises with frequency)
  * **X_C = 1 / (2πfC)** (falls with frequency)
* **Resonance:** X_L = X_C at **f = 1 / (2π√(LC))**. In a series LC circuit impedance is **lowest** at resonance; in a parallel LC it is **highest.**
* **Q** = X / R (how sharp the resonance is). **Bandwidth = f / Q.**
* **RC time constant:** τ = R × C. After **one τ** a charging capacitor reaches **63.2%** of the supply voltage. A discharging one falls to **36.8%.** After about **5 τ** it's essentially done.
* **RL time constant:** τ = L / R.
* **Impedance** is the total opposition to AC (R plus reactance).
* **Phase angle** between voltage and current tells you how reactive a load is. A **purely resistive** load has 0° phase angle. **Inductive:** voltage leads current. **Capacitive:** current leads voltage. (ELI the ICE man: **E**lectromotive force leads **I** in an inductor **L**; in a **C**apacitor **I** leads **E**.)
* **Power factor** = cosine of the phase angle.
* **Transformers:** Vp / Vs = Np / Ns. **Impedance ratio = (turns ratio)².** So a 4:1 turns ratio transforms impedance **16:1**.
* **Decibels** (power): dB = 10 log(P2 / P1). +3 dB ≈ ×2, +6 dB ≈ ×4, +10 dB = ×10.

---

# G6 · Circuit Components (3 exam questions)

* **Diodes:**
  * **Zener:** conducts in reverse above its rated voltage → voltage regulation.
  * **Varactor (varicap):** capacitance varies with reverse voltage → tuning.
  * **PIN:** RF switching and attenuators.
  * **Schottky:** low forward drop, fast switching.
  * **LED:** emits light on forward current.
* **Transistors:**
  * **Bipolar (NPN/PNP):** emitter, base, collector. A small base current controls a larger collector current.
  * **JFET and MOSFET:** gate, drain, source. High input impedance. MOSFETs need static precautions.
* **Integrated circuits:** op-amp, logic gates, microcontrollers, DSP, voltage regulators. A **MMIC** is a small RF amplifier chip.
* **Crystals** give very stable frequency. A **crystal oscillator** is far more stable than an LC oscillator.
* **Toroidal inductors** keep their magnetic field mostly **inside the core**, so they cause less coupling to nearby circuits and are compact.
* **Capacitor types:** **electrolytic** (polarized, big values, power supplies), **ceramic** (RF bypass), **tantalum** (polarized).
* **Analog meters:** **D'Arsonval** movement. **Digital meters** show a numeric value.
* **Batteries:** primary vs secondary; **Li-ion** and **LiFePO4** are common for portable ham gear.

---

# G7 · Practical Circuits (3 exam questions)

## Power supplies

* **Chain:** transformer → rectifier → filter → regulator.
* **Half-wave rectifier:** one diode, conducts for half the AC cycle. **Full-wave** uses both halves. **Bridge rectifier:** four diodes.
* **Filter:** large **capacitor** smooths the ripple. **Regulator** holds output voltage constant under load changes.
* **Ripple frequency:** half-wave = line frequency (60 Hz); **full-wave = 120 Hz**.
* A **linear regulator** wastes the difference as heat. A **switching** supply is more efficient but can radiate noise.

## Amplifiers and filters

| Class | Conduction angle | Efficiency | Linear? |
|---|---|---|---|
| **A** | 360° | lowest (about 25–30%) | yes |
| **AB** | between | middle | yes (SSB) |
| **B** | 180° | higher | pushed-pull |
| **C** | < 180° | highest | **no**. FM and CW only |

* **Pi-network** in a transmitter output **matches impedance and attenuates harmonics.**
* **Low-pass filter** after the amplifier reduces harmonics. **High-pass** on a TV receiver blocks HF. **Band-pass** passes one range. **Notch** removes one frequency.
* **Receiver block parts:** RF amp → mixer → IF filter → detector → audio.
* **Mixer** creates sum and difference frequencies. A **product detector** demodulates SSB and CW. A **balanced modulator** makes SSB (it suppresses the carrier).
* **VFO:** variable-frequency oscillator. **PLL (phase-locked loop):** a stable, programmable oscillator from a crystal reference. **DDS:** digital synthesis.
* **SDR:** software-defined radio does the mixing and filtering digitally.
* **Discriminator / quadrature detector:** FM demodulators.
* **Op-amp:** very high gain, uses feedback. Closed-loop gain of an inverting amp = −Rf / Rin.

---

# G8 · Signals and Emissions (2 exam questions)

* **AM:** carrier plus two sidebands. Bandwidth ≈ **2 × highest audio**. **SSB:** one sideband, carrier suppressed. About **2.4–3 kHz**. SSB uses its power far more efficiently than AM.
* **FM:** frequency of the carrier changes with audio. **Deviation** is how far it swings. **Narrow FM** is about **5 kHz deviation, 15 kHz bandwidth.** Carson's rule: BW ≈ 2 × (deviation + highest audio frequency).
* **Modulation index (FM)** = deviation / modulating frequency.
* **Phase modulation** and FM are closely related.
* **Over-modulation:** splatter, wide bandwidth. **Over-deviation:** same in FM.
* **Typical bandwidths:**

| Mode | Approx. bandwidth |
|---|---|
| CW | ~150 Hz |
| PSK31 | ~31 Hz |
| FT8 | ~50 Hz |
| RTTY (170 Hz shift) | ~250 to 300 Hz |
| SSB | 2.4–3 kHz |
| AM | ~6 kHz |
| NFM voice | 15 kHz |

* **Baud rate** is symbols per second. **Bit rate** = baud × bits per symbol. They are not always equal.
* **FSK:** frequency-shift keying. **PSK:** phase-shift keying. **BPSK31:** 31.25 baud.
* **FEC / ARQ** as in G4.
* **Duty cycle** of the mode matters for RF exposure and amplifier heating. Constant-carrier digital modes (FT8, RTTY) run a much higher duty cycle than SSB voice, so back the power down.
* **Spread spectrum** spreads the signal over a wide bandwidth. The maximum is **10 W PEP**, and it is permitted only on amateur frequencies above **222 MHz** (the Extra pool, question E1F01, asks this directly).
* **Key click and splatter:** a CW key click is caused by too-fast rise and fall time. Soften with a filter / rise-time control.

---

# G9 · Antennas and Feed Lines (4 exam questions)

## Length formulas (feet, f in MHz)

| Antenna | Formula |
|---|---|
| **Half-wave dipole** | **468 / f** |
| **Quarter-wave vertical** | **234 / f** |
| **Full-wave loop** | **1005 / f** (total wire length) |
| **Quarter-wave** matching transformer (impedance) | **Z = √(Z₁ × Z₂)** |

**Example.** 7.15 MHz dipole → 468 / 7.15 ≈ **65.5 ft** total, 32.7 ft per leg.

## Characteristics

* **Dipole feed-point impedance:** about **50 to 75 Ω** at the center (low, matches coax). Mounted low, closer to 50 Ω; in free space ~73 Ω.
* **Quarter-wave vertical:** about **36 Ω** with a good ground, needs **radials** (more radials = better ground).
* **Folded dipole:** about **300 Ω.**
* **Yagi:** driven element, reflector (longer), directors (shorter). Gain increases with more elements. **Front-to-back ratio** is how well it rejects signals from behind.
* **Gain:** **dBi** is relative to an isotropic radiator, **dBd** relative to a dipole. **dBi = dBd + 2.15**.
* **End-fed / random wire:** needs an **antenna tuner**. A **balun or unun** is used at the feed point.
* **Trap antennas** use LC traps to be resonant on multiple bands.
* **Loading coil** shortens a physically short antenna, at the cost of lower efficiency and bandwidth.
* **Beamwidth:** narrower beamwidth = higher gain.
* **Polarization:** matched polarization gives the strongest signal; a mismatch loses signal.

## Feed lines

* **Coax:** common impedance **50 Ω.** **Twin-lead / ladder-line** (open-wire) is a **balanced** line with **very low loss**, and used with a tuner for multi-band doublets.
* **Velocity factor:** the speed of the signal in the line compared with free space. **Solid polyethylene coax: ~0.66.** Foam: ~0.80. Ladder-line: ~0.95. So a physical quarter wave of coax is shorter than the free-space quarter wave.
* **SWR** (standing wave ratio): **1:1** is ideal. SWR of **2:1** means about 11% of power is reflected (the **return loss** is 9.5 dB); on a low-loss line, the radio sees *less* trouble than you'd think.
* **Balun** converts balanced to unbalanced. A **choke balun** suppresses common-mode current on the coax shield.
* **Feed line loss increases with frequency.** Loss also increases with SWR.
* **Antenna tuner** matches the transmitter to the line. It does not change the SWR on the line between the tuner and the antenna.
* **Common-mode current** on the outside of the coax means your feed line becomes part of the antenna. Fix with a **choke**.

---

# G0 · Electrical and RF Safety (2 exam questions)

* **Electrical safety:** the same rules as Technician: fuses in the hot conductor, all external grounds bonded, wire gauge matched to current. **Ground-fault circuit interrupters (GFCI)** protect from shock in damp areas.
* **Capacitors:** large power-supply capacitors can hold a lethal charge after power-off. **Bleeder resistors** drain them.
* **RF exposure (MPE):** the FCC sets **Maximum Permissible Exposure** limits that depend on **frequency, power, antenna gain, distance, and duty cycle.** The body absorbs most efficiently at **VHF around 30–300 MHz**, so MPE limits are lowest there.
* **Controlled vs uncontrolled** environments: the **controlled** limit is five times higher (people who know they're in an RF area vs. the general public).
* **Averaging time:** 6 minutes (controlled) and 30 minutes (uncontrolled).
* **Routine evaluation** is required above specific power thresholds that vary by band. Use FCC OET Bulletin 65, online calculators, or measurement.
* **Tower safety:** never climb alone, use a harness, stay away from power lines. **Never attach an antenna to a utility pole.**
* **Hazardous materials:** **beryllium oxide** (found in some RF power transistors and dummy loads) is toxic if the part is broken and dust is inhaled. Treat carefully.
* **Lead-acid and lithium battery safety** as in the Technician guide.

---

# Cram sheet

* **General cannot use:** 7.125–7.175 MHz, and sub-bands reserved for Extra on 80/40/20/15 m.
* **30 m:** CW and data only, **200 W PEP**.
* **LSB below 10 MHz; USB above** (and USB on 60 m).
* **FT8 on 20 m: 14.074 MHz USB.**
* **1500 W PEP** is the maximum anywhere else.
* **Beacons:** 28.20–28.30 MHz, 100 W PEP.
* **VEs:** 18 years old, CSCE valid **365 days**, three VEs for a Technician exam.
* **Gray line** = strong propagation along the day/night boundary.
* **D layer** absorbs lower HF by day, and disappears at night.
* **Higher SFI → higher MUF.**
* **RMS = 0.707 × peak.** PEP = (0.707 × Vp)² / R.
* **X_L = 2πfL. X_C = 1 / 2πfC.** f₀ = 1 / (2π√LC).
* **1 time constant = 63.2%** charge, **36.8%** discharge.
* **Impedance ratio = turns ratio squared.**
* **Dipole length (ft): 468 / f(MHz).** Quarter wave: 234 / f.
* **Coax Z: 50 Ω.** Solid-PE velocity factor: **0.66**.
* **dBi = dBd + 2.15.**
