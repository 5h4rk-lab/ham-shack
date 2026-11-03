---
title: "Amateur Extra Class Study Guide"
subtitle: "FCC Element 4 · Question pool 2024–2028 (valid July 1, 2024 – June 30, 2028)"
---

# Start here

Extra is the top of the ladder: every privilege on every band, and an exam that is the first one with real engineering in it. It is also the one most people think they can't pass. The reason it feels hard is volume (599 questions) and a handful of math-flavored groups. The reason it is very passable is that those math groups follow a small number of patterns.

| Fact | Detail |
|---|---|
| Questions on exam | 50 |
| Passing score | 37 correct (74%) |
| Pool size | 599 questions, 10 subelements, 50 groups |
| Structure | One question from each group (E1A, E1B, … E0A) |
| Prerequisite | General license (or credit for Elements 2 and 3) |

**Pool date.** This pool runs through **June 30, 2028.** Confirm at ncvec.org.

**Where the points are.** Rules (E1), operating (E2), and propagation (E3) are mostly recall. Electronics (E4–E9) is pattern recognition. If you can do four calculations (reactance, resonant frequency, time constant, dB) and recognize which circuit a diagram shows, you are most of the way there.

**Two things to do before studying.**

1. Print the **Extra pool formulas sheet** (it is Section "Cram sheet" at the end of this guide).
2. Learn to use your calculator's `1/x`, `x²`, `√`, `10^x` and `log` keys quickly. Check your VE team's calculator rules first.

---

# E1 · Commission's Rules (6 exam questions)

## Band edges and bandwidth

* A **USB carrier** (dial) frequency plus the signal's bandwidth must stay inside the band. For a 3 kHz USB signal the top sits **3 kHz above the dial frequency**, so the highest legal dial setting is 3 kHz below the upper band edge. For LSB, the signal extends **below** the dial, so stay **3 kHz above** the lower edge.
* Example from the pool: a 3 kHz USB signal on **14.348 MHz** fails because the **upper 1 kHz is outside the 20 m band** (edge is 14.350).
* **Data emissions on 20 m with a 2.8 kHz USB signal:** highest legal carrier is **14.1472 MHz** (so the signal stays inside the data segment ending at 14.150).
* **60 m CW:** transmit at the **center frequency** of the channel. **Max bandwidth for data on 60 m: 2.8 kHz.**
* **Do not transmit** with your carrier within the bandwidth of a band edge. Think "dial + bandwidth".

## Special bands

* **2200 m (135.7–137.8 kHz):** max **1 W EIRP**.
* **630 m (472–479 kHz):** max **5 W EIRP** (except some parts of Alaska).
* Both require you to **notify the Utilities Technology Council (UTC)**, and you may operate after **30 days** if not told otherwise. **Phone** is permitted in the **entire 630 m band.**

## Interference and protected areas

* **Spurious emission:** an emission **outside the necessary bandwidth** that can be reduced without affecting the information.
* Max spurious emissions below 30 MHz: **−43 dB** relative to the fundamental.
* Protect an **FCC monitoring facility** within **1 mile**.
* **National Radio Quiet Zone:** surrounds the **National Radio Astronomy Observatory** (and the Naval site) in West Virginia.
* **Radiolocation interference on 70 cm:** repeater control operator must **cease operation or mitigate** the interference.
* **Line A:** roughly parallel to and south of the U.S.-Canada border. North of it, certain 420–430 MHz uses are restricted.
* **PRB-1:** applies to **state and local zoning.** They must make **reasonable accommodation** for amateur antennas.
* **FAA:** you may have to notify the FAA and register the antenna structure if it is tall or near an airport.
* **Broadcast interference:** the FCC may require you to avoid transmitting during certain hours on frequencies that cause problems.
* **Angle modulation index max:** **1.0** at the highest modulating frequency (on 10 m).

## RACES, remote, foreign operation

* **RACES:** any FCC-licensed amateur station certified by the responsible civil defense organization. Frequencies: **all amateur frequencies authorized to the control operator.**
* **Remote station max transmission without control:** **3 minutes.**
* **CEPT:** lets an FCC-licensed U.S. citizen operate in many European countries. You need a copy of **FCC Public Notice DA 16-1048.**
* **IARP:** International Amateur Radio Permit, for certain countries in the Americas.
* **Canada:** U.S. Extra operating under Canadian license terms follows **the operating terms of the Canadian license.**
* **Third party:** automatic control may relay third-party traffic only for **RTTY/data emissions.**
* **A message forwarded in violation:** responsibility sits with the **control operator of the originating station.**
* **Vessel/aircraft:** the master or pilot must approve; **any FCC-issued amateur license** suffices on a **US-registered vessel in international waters.**

## Space and telecommand

* **Telemetry:** one-way transmission of measurements from a distance.
* **Space telecommand station:** transmits commands to a space station. **May encrypt** its telecommand.
* **Balloon-borne telemetry:** requires a **call sign** in identification.
* **Model craft by telecommand:** max **1 W.**
* **Space station allocations:** HF: **40, 20, 15, 10 m.** VHF: **2 m.** UHF: **70 cm and 13 cm.**
* **Earth station:** any amateur station within privileges.
* **One-way communications** allowed for **space stations, beacon stations, telecommand stations.**

## VEs and the exam system

* **VECs** maintain the question pools and **coordinate** exams. **VEs** are accredited by a VEC.
* VEs may be reimbursed only for **preparing, processing, administering, and coordinating** the exam.
* If an examinee **fails**, return the application document. If an examinee **passes**, **three VEs** certify the examinee is qualified and submit the paperwork to the VEC.
* VEs may not examine **relatives** listed in the rules.
* Fraud penalty: **revocation of the VE's station license and suspension of the operator license.**

## Business and other prohibitions

* Message to a business: allowed only when **neither you nor your employer has a pecuniary interest.**
* **Mesh networks** cannot carry **messages encoded to obscure their meaning.**
* **Spread spectrum:** only on amateur frequencies **above 222 MHz.**
* **RF power amplifiers:** may be sold if **built or modified by an amateur** (for use by amateurs). They must meet the FCC's spurious-emission standards.
* **Auxiliary station control operator:** Technician, General, Advanced, or Amateur Extra.

---

# E2 · Operating Procedures (5 exam questions)

## Satellites and EME

* **Mode designators** use one letter per band, **uplink first**: V = 2 m, U = 70 cm, L = 23 cm (1.2 GHz), S = 13 cm (2.4 GHz), A = 10 m. Mode **U/V**: uplink 70 cm, downlink 2 m. Mode **V/U**: uplink 2 m, downlink 70 cm.
* **Keplerian elements** (two-line elements, TLEs) predict satellite position. **Doppler shift:** frequencies shift by a few kHz on 2 m and about 10 kHz on 70 cm; **you correct your transmit** so you land on the right downlink.
* **Linear transponders** repeat many signals at once; too much uplink power swamps the others.
* **EME (moonbounce):** the Moon is the reflector. **Path loss is large**, and **libration fading** (rapid flutter from lunar motion) shows up on higher bands. **Polarization shift** from **Faraday rotation** is notable on lower bands (2 m).
* **Digital modes for weak signals:** **JT65, JT9, FT8, MSK144** (meteor scatter). They use **narrow bandwidth, FEC, and long integration**, so they decode far below the noise.

## Digital protocols and operating

* **FT8:** 15-second sequences, 8-FSK, ~50 Hz wide, very low S/N operation. **MSK144:** meteor-scatter bursts.
* **APRS:** Automatic Packet Reporting System on **144.390 MHz** in North America. Position, weather, messages.
* **Packet:** AX.25 protocol. **PACTOR, WINMOR, VARA** use ARQ and are used for Winlink.
* **ATV and SSTV:** amateur TV and slow-scan TV. **Scottie** and **Martin** are SSTV modes. SSTV uses audio-frequency FM subcarrier at roughly 1200–2300 Hz.
* **ARQ vs FEC:** ARQ retransmits on request; FEC adds redundancy.
* **Contesting:** know exchange formats and scoring only to the degree the pool asks (it asks about **log submission, multipliers, and Cabrillo format**).
* **DXing:** use **split operation**, listen for the DX station's instructions, give your callsign once or twice. **"QSL via"** tells you where to send a card (bureau, LoTW, direct).
* **Grid squares:** Maidenhead locator, 4 or 6 characters (like **FN31pr**).
* **Remote station:** a station that you operate from elsewhere is under control from a **control point.**

## Antenna aiming and scatter

* **Meteor scatter:** very brief bursts (fractions of a second to seconds) on **6 m, 2 m**; **FT8/MSK144** work best.
* **Ionospheric scatter, auroral and sporadic E:** see E3.

---

# E3 · Radio Wave Propagation (3 exam questions)

* **Transequatorial propagation (TEP):** VHF paths **across the geomagnetic equator** (north-south) in the afternoon/evening, using F-layer ridges.
* **Long path:** the signal takes the longer way around the Earth. Typical when the short path is in daylight/dark mismatch, and **around the gray line.** Delay echoes distort audio.
* **Gray line:** strong propagation along the terminator.
* **Chordal hop:** signals refract between the F-layer without ground reflection, giving **lower loss** than multi-hop.
* **Sporadic E** gives **6 m and 2 m** openings up to ~1500 miles per hop. It is most common **in summer.**
* **Auroral propagation:** signals reflect from the aurora; **raspy, distorted, CW favored.** Antenna points **north.**
* **Meteor scatter:** works on **28–148 MHz**, best at **6 m**, **peaks** during meteor showers and in the early morning.
* **Tropospheric ducting and scatter:** temperature inversion creates a duct over water or flat terrain; the **tropospheric scatter** mode uses forward scatter.
* **HF skip and MUF:** **MUF** is higher near solar max. **Critical angle:** the highest elevation angle at which a signal can still return.
* **Solar flux, A and K indices** as in General.
* **Fading terms:** **selective fading** (different frequencies fade at different times), **flutter fading** (polar paths), **Faraday fading.**
* **VHF/UHF line-of-sight range** with **radio horizon ≈ 4/3 of the optical horizon** (the **K factor 1.33**).
* **Ground-wave:** vertical polarization is better at lower frequencies.
* **Geomagnetic disturbances** shift **polar paths** first.

---

# E4 · Amateur Practices (5 exam questions)

## Test equipment

* **Oscilloscope:** displays amplitude vs **time.** Vertical = volts; horizontal = time. A **bandwidth** rule of thumb: you need a scope with bandwidth several times the highest frequency you measure.
* **Spectrum analyzer:** amplitude vs **frequency.** Use to look at **harmonics, spurs, intermodulation, occupied bandwidth.**
* **Frequency counter:** accuracy depends on its **time base**. **Increasing the gate time** gives more digits of resolution. A **TCXO/OCXO/GPS-disciplined** time base improves accuracy.
* **SWR analyzer / antenna analyzer:** measures SWR, impedance, resonance. **VNA (vector network analyzer):** measures magnitude and phase (S-parameters, S11 is return loss).
* **Dip meter / grid-dip meter:** finds resonant frequency of a **de-energized** tuned circuit.
* **RF probe, field-strength meter, absorption wavemeter, logic probe, digital multimeter, power meter.**
* **Meter accuracy:** a meter that reads **1% of full scale** is least accurate at **low** readings.

## Receiver performance

* **Dynamic range:** the span between the weakest signal a receiver can detect and the strongest it can handle without distortion. **Blocking dynamic range** = how strong an unwanted signal can be before the desired signal's gain drops by 1 dB. **Third-order intercept point (IP3)** characterizes intermodulation.
* **Intermodulation distortion (IMD):** strong signals mix and create false signals. Cure: **attenuate** the input, use a **preselector / filter**, choose a **high-IP3 receiver**.
* **Noise figure:** how much noise the receiver adds. Lower is better. **Noise floor** and **MDS (minimum discernible signal)**: MDS = kTB + NF.
* **Receiver sensitivity** on VHF: a **preamp near the antenna** improves system noise figure. A preamp before long lossy coax is better than after it.
* **Two-tone test** measures transmitter linearity.
* **Image rejection, IF rejection:** sets how well the receiver rejects the second response. A **superheterodyne** has an **image frequency** = signal ± 2 × IF.
* **Antenna-pointing, polarization**, and **common-mode** problems are covered in E9.
* **Interference types:** **blanketing** (strong local signal overloads many receivers), **cross-modulation**, **harmonic radiation**, **ferrite chokes** and **filters** as cures.
* **Grounding for RF noise:** a **single-point ground**, bonding, **line noise** from switching supplies, **power-line noise** located using a directional antenna and AM receiver.

---

# E5 · Electrical Principles (4 exam questions)

## Reactance, impedance, resonance

* **X_L = 2πfL. X_C = 1 / (2πfC).**
* **Resonant frequency** f₀ = 1 / (2π√(LC)). Rearranged: L = 1 / ((2πf)² C).
  * Quick: with L in µH and C in pF, **f₀ (MHz) = 159.2 / √(L × C)**.
* **Series resonance:** impedance is minimum (just R), current is maximum. **Parallel resonance:** impedance is maximum, current from the line is minimum.
* **Q** = X / R for series; **Q = R / X** for parallel. **Bandwidth (−3 dB) = f₀ / Q.**
* **Half-power point** is **−3 dB.**
* **Phase angle:** in a series RL circuit, **θ = arctan(X_L / R)**. A series RC has **negative** angle: arctan(−X_C / R).
* **Impedance** of series R and X: **Z = √(R² + X²).**
* **Time constants:** τ = RC (or L/R). **1τ ≈ 63.2%, 2τ ≈ 86.5%, 3τ ≈ 95%, 5τ ≈ 99.3%.**

## Complex numbers and the Smith chart

* **Rectangular form:** R + jX. **Polar:** magnitude ∠ angle. **j** is the imaginary operator: **+j = inductive reactance, −j = capacitive reactance.**
* **Convert:** magnitude = √(R² + X²); angle = arctan(X/R).
* **Smith chart:** a map of complex impedance. **Center = normalized 1 + j0** (perfect match, SWR 1:1). The **outer circle** is zero resistance (pure reactance). The **top half** is inductive; the **bottom half** is capacitive. One full trip around the chart = **half a wavelength** of line.
* **Rotating clockwise** moves you **toward the generator.**

## Power

* **Power factor:** cos θ. **True power** = I² R. **Apparent power** = V × I. **Reactive power** is the rest.
* **Resistors in parallel/series, voltage divider, Kirchhoff:** all fair game, plain Ohm's law.
* **Decibels:** 3 dB ×2, 6 dB ×4, 10 dB ×10, 20 dB ×100 (power). Voltage dB is 20 log.
* **Skin effect:** at RF, current flows near the **surface** of a conductor. This raises resistance with frequency; this is why **silver plating** and **tubing** work.
* **Eddy currents and core saturation** in iron-core inductors; **ferrite** and **powdered iron** are used at RF.

---

# E6 · Circuit Components (6 exam questions)

## Semiconductors

* **Zener:** reverse breakdown regulator. **Varactor:** voltage-variable capacitor. **PIN diode:** RF switch/attenuator, **acts as a variable resistor at RF.** **Schottky (hot-carrier):** fast, low forward drop, used in mixers and detectors. **Tunnel diode:** negative resistance, microwave oscillator.
* **Bipolar transistor gain:** **beta (hFE)** = Ic / Ib. **Alpha** = Ic / Ie (< 1).
* **FET types:** **JFET** (depletion), **MOSFET** (enhancement/depletion), **GaAsFET** (very low noise at UHF/microwave). A **MOSFET gate is insulated**, so it is **static-sensitive.**
* **Transistor biasing:** keeps the operating point in the active region. **Class A bias** sits in the middle of the load line.
* **Optocoupler (optoisolator):** LED and phototransistor for **electrical isolation.**
* **Op-amp:** very high input impedance, low output impedance. **Gain-bandwidth product** is constant. **Inverting gain = −Rf / Rin.** **Non-inverting gain = 1 + Rf / Rin.** A **voltage follower** has gain 1.
* **Logic families:** **TTL** (5 V, faster per power), **CMOS** (low power, wide supply, static sensitive). **Fan-out** is how many inputs one output can drive.
* **MMIC** (monolithic microwave IC): broadband gain block, typically 50 Ω in and out.
* **Crystal:** very high Q. **Quartz crystal** has series and parallel resonances. **Crystal lattice filter** gives a steep SSB passband.
* **Capacitor types:** **ceramic** (RF bypass, can be microphonic), **mica/silver mica** (stable), **electrolytic** (polarized, leaky at RF), **tantalum**. **Inductor:** the **Q** of a coil falls with **resistive and core loss.**
* **Surface acoustic wave (SAW) filter,** **ceramic filter,** **mechanical filter.**
* **Batteries:** **NiMH, NiCd, Li-ion, LiFePO4** characteristics; **cell voltage:** lead-acid 2.0 V, NiCd/NiMH 1.2 V, Li-ion 3.7 V nominal.
* **Digital ICs:** **flip-flop, counter, shift register, ADC, DAC.**

---

# E7 · Practical Circuits (8 exam questions)

## Digital logic

| Gate | Output is 1 when |
|---|---|
| **AND** | all inputs are 1 |
| **OR** | any input is 1 |
| **NOT** | input is 0 (inverts) |
| **NAND** | NOT (all inputs 1): output is 0 only if all inputs are 1 |
| **NOR** | NOT (any input 1): output is 1 only if all inputs are 0 |
| **XOR** | inputs differ |

* A **flip-flop** stores one bit. A **shift register** moves bits along a chain. A **counter** counts clock pulses; a **divide-by-N** counter makes frequency dividers. **J-K** and **D** flip-flops are standard.
* **Truth tables** show output for all input combinations. Know the **inverted-input** reductions (De Morgan).
* **Microprocessor** vs **microcontroller;** **A/D converter** resolution is bits (**n-bit → 2ⁿ levels**); **Nyquist:** sample at more than **2× the highest frequency.**
* **DSP:** filtering and demodulation in software; **FIR/IIR** filters; **DDS** (direct digital synthesis) uses a lookup table and DAC.

## Amplifiers and oscillators

* **Class A** (linear, inefficient), **AB** (SSB linear amps), **B**, **C** (efficient, nonlinear: FM/CW). **Class D/E** switching amplifiers are highly efficient.
* **Pi-network:** **Q** sets harmonic attenuation; higher Q = more harmonic rejection and narrower. **Pi-L** adds further rejection.
* **Oscillators:** **Colpitts** (two capacitors in series as the feedback divider), **Hartley** (tapped inductor), **Pierce** (crystal), **Clapp.** An oscillator needs **gain ≥ 1 and positive feedback (phase shift 360°).**
* **Phase-locked loop (PLL):** phase detector, loop filter, VCO, divider. Output frequency = N × reference. Used for synthesizers and FM demodulation.
* **Active filters:** op-amp with RC. **Sallen-Key.** **Butterworth** (flat passband), **Chebyshev** (sharper skirt, ripple), **Elliptic.** **Order** sets the steepness (6 dB per octave per pole).
* **Filter terms:** **cutoff** at −3 dB; **shape factor** = ratio of −60 dB to −6 dB bandwidth (smaller is better); **ripple**, **insertion loss.**
* **RC and LC filters:** low-pass, high-pass, band-pass, band-reject (notch).
* **Mixers:** produce sum and difference. **Balanced** and **double-balanced** mixers suppress LO and RF at the output. **Image** concerns.
* **Modulators:** **balanced modulator** (DSB, no carrier); **reactance modulator** (FM). **Phase modulation** is easy to generate; FM from PM needs integration.
* **Receivers:** **superhet**, **direct conversion**, **SDR**; **AGC**, **squelch**, **product detector**, **discriminator.**
* **Power supplies:** switching supply ripple/noise; **regulator** types; **voltage multipliers.**
* **Transmission line sections:** quarter-wave stub, **half-wave** repeats impedance, **quarter-wave transformer** Z = √(Z₁ Z₂).

---

# E8 · Signals and Emissions (4 exam questions)

* **Modulation index (AM)** = Vm / Vc (above 1 = over-modulation, distortion, splatter).
* **FM:** **deviation ratio** = max deviation / max modulating frequency. **Modulation index** = deviation / modulating frequency. **Carson's rule:** bandwidth = 2 (Δf + f_m).
* **Phase modulation** and **frequency modulation** differ in how deviation relates to modulating frequency.
* **Pulse modulation:** **PWM, PPM.** **Spread spectrum:** **frequency hopping** and **direct sequence;** processing gain; **orthogonal codes.**
* **Digital terms:** **baud** (symbols/s), **bit rate**, **bandwidth** (Nyquist; a signal can't have more than 2 × bandwidth symbols/s). **Shannon limit** is the ultimate bit rate for a given S/N.
* **FSK, PSK, QPSK, QAM:** more bits per symbol means more S/N required. **Bit error rate (BER)** vs **S/N.**
* **Error handling:** **ARQ, FEC, interleaving, parity, CRC.**
* **Character sets:** **Baudot (5 bits)**, **ASCII (7 bits)**, **Unicode.** **Varicode** is used in PSK31 (shorter codes for common letters).
* **PSK31** ≈ 31.25 baud, ~31 Hz BW. **Pactor, WINMOR, VARA, D-STAR, DMR, C4FM:** know what each is.
* **Digital voice:** **vocoder** compresses speech. **D-STAR uses GMSK**; **DMR uses TDMA (two time slots) on 12.5 kHz.**
* **Key clicks:** rise and fall times of a CW envelope that are too short create wide **key-click sidebands.**
* **Sidebands and bandwidth of AM:** carrier + upper + lower. **Single sideband** saves bandwidth and power.
* **Phase noise, reciprocal mixing, IMD**: signal-quality terms.

---

# E9 · Antennas and Transmission Lines (8 exam questions)

## Gain, pattern and impedance

* **Gain** is compared to **isotropic (dBi)** or **dipole (dBd).** **dBi = dBd + 2.15.**
* **Radiation resistance:** the equivalent resistance that would dissipate the radiated power. **Efficiency** = Rrad / (Rrad + Rloss).
* **Beamwidth** is the angle between **−3 dB** points. Narrower beamwidth = more gain. **Front-to-back** and **front-to-side** ratios.
* **Effective radiated power (ERP)** = TX power − line loss + antenna gain (in dBd). **EIRP** uses dBi. EIRP = ERP × 1.64.
* **Half-wave dipole:** feed impedance ~**73 Ω** in free space (lower when near ground). **Folded dipole:** ~**300 Ω.** **Quarter-wave vertical:** ~**36 Ω.**
* **Antenna Q and bandwidth:** short antennas are narrow-band.
* **Height above ground** controls **takeoff angle**: higher horizontal antennas give lower angles for DX.

## Antenna types

* **Yagi:** driven element, reflector, directors; **stacking** two Yagis adds about **3 dB.** **Boom length** influences gain. **Gamma match, hairpin match, T-match** are matching methods.
* **Quad / delta loop:** full-wave loop with a little gain over a dipole. Polarization depends on where you feed it: **bottom or top center = horizontal, side = vertical.**
* **Log-periodic:** wide bandwidth, moderate gain. **Helical:** circular polarization (satellites). **Parabolic dish:** gain depends on diameter in wavelengths. **Slot, horn, patch.**
* **Vertical antennas:** need **ground radials**; **elevated radials** can be fewer. **Ground losses** hurt efficiency. **Top hat and loading coil** electrically lengthen a short vertical.
* **Beverage antenna:** long wire for receiving on low bands. Directional, low-noise, **receive only.**
* **Rhombic, long-wire:** gain increases with length.
* **Phased arrays:** spacing and phasing steer the pattern: **endfire** and **broadside**, **cardioid** pattern.
* **Antenna modeling (NEC):** use computer modeling to see patterns and impedance.
* **Antenna efficiency** vs **ground type.**

## Transmission lines and matching

* **Characteristic impedance Z₀:** coax 50/75 Ω; **parallel-wire** 300–600 Ω.
* **Velocity factor:** solid PE 0.66; foam 0.80; **open-wire** ~0.95.
* **Reflection coefficient** Γ = (Z_L − Z₀) / (Z_L + Z₀). **SWR = (1 + |Γ|) / (1 − |Γ|)** = Z_L / Z₀ for a resistive load greater than Z₀.
* **Matching sections:** **quarter-wave transformer** (Z = √(Z₁ Z₂)), **stubs** (shorted or open), **gamma, hairpin, T-match, beta match.**
* **Return loss:** −20 log |Γ|. **SWR 2:1 → Γ = 0.333, RL = 9.5 dB.**
* **Line loss** reduces the SWR you measure at the transmitter: a lossy line makes a bad antenna look better. **Mismatch loss** is separate.
* **Baluns and chokes:** **1:1 current balun** isolates feed line from antenna; **4:1 and 9:1 unun/balun** are impedance transformers. A **choke balun** is just inductance in the shield path.
* **Stub for filtering:** a **quarter-wave shorted stub** across the line presents an open circuit at its design frequency and short at even harmonics; it's used as a **notch**.
* **Smith chart problems:** plot normalized impedance, rotate by line length, read off the new impedance.

---

# E0 · Safety (1 exam question)

* **RF exposure:** same MPE framework as General. **SAR (specific absorption rate)** is used for devices near the body (handhelds). **Controlled vs uncontrolled** environments differ by a factor of five in power density.
* **Evaluation:** calculations, models, or measurements. The bulletin is **OET 65.**
* **Beryllium oxide** (ceramic in some power transistors): do not break or grind.
* **Lead and solder fumes:** ventilate.
* **Lightning, tower, ground rod** rules as before.
* **High-voltage amplifiers:** can be lethal. Bleed capacitors and use the "one hand in the pocket" rule.

---

# Cram sheet

**Formulas (memorize and be able to run them on a calculator)**

* X_L = 2πfL · X_C = 1 / (2πfC)
* f₀ = 1 / (2π√(LC)) (MHz: 159.2 / √(L µH × C pF))
* Z = √(R² + X²) · θ = arctan(X / R)
* Q = X / R · BW = f₀ / Q
* τ = RC → 63.2% (1τ) · 86.5% (2τ) · 95% (3τ)
* dB = 10 log(P₂/P₁) = 20 log(V₂/V₁)
* Γ = (Z_L − Z₀)/(Z_L + Z₀) · SWR = (1 + |Γ|)/(1 − |Γ|)
* Quarter-wave transformer: Z = √(Z₁ Z₂)
* dBi = dBd + 2.15 · EIRP = ERP × 1.64
* Carson: BW = 2(Δf + f_m)
* n-bit ADC: 2ⁿ levels · Nyquist: sample > 2 f_max

**Numbers**

* 60 m: 2.8 kHz bandwidth, CW at channel center
* 2200 m: 1 W EIRP · 630 m: 5 W EIRP
* VE: three VEs certify a pass
* Remote control stations: 3 minutes max transmission without control
* Spurious below 30 MHz: −43 dB
* Spread spectrum: above 222 MHz
* Model craft: 1 W
* FCC monitoring facility: 1 mile
* Beacon, telecommand, space station may send one-way

**Test equipment picker**

* Amplitude vs time → **oscilloscope**
* Amplitude vs frequency → **spectrum analyzer**
* Resonance of a dead circuit → **dip meter**
* Impedance and SWR vs frequency → **antenna analyzer / VNA**
* Frequency accuracy → **frequency counter with a good time base**
