---
title: "Antenna Handbook"
subtitle: "Types, what each is good for, and three cheap builds"
---

# Start here {#start}

The antenna is the most important part of your station, and the cheapest part to improve. A $10 antenna hung high and clear beats a $500 radio on a bad one. Almost every "my radio is weak" problem is an antenna problem.

This handbook is for every license class. It covers four things:

1. **How antennas work**, in seven ideas. No math beyond what is on the Technician exam.
2. **The types**, and what each is genuinely good at.
3. **A picker.** Tell it what you want to do and it recommends antennas.
4. **Three builds** you can finish in an afternoon for roughly the price of a pizza, with cut lengths calculated for your frequency.

> **Elmer says:** Antenna advice online is full of strong opinions. Here is the plain version. Pick the antenna that matches **what you want to do**, put it **as high and as clear of metal as you can**, use **decent coax with good connectors**, and **measure the SWR**. Do those four things and you will be happier than most hams.

<!-- img:yagi A Yagi beam on a mast. One of the oldest and most effective designs there is. -->

**What you need to build and tune:** a tape measure, side cutters, a soldering iron, and an **SWR meter or antenna analyzer**. Used SWR meters are around $20 to $40. A NanoVNA-class analyzer is more, but shows you the whole picture. Without a meter you are guessing.

# How antennas work {#basics}

## 1. An antenna is a resonant length of wire {#resonance}

An antenna radiates well when its length is a simple fraction of the wavelength, usually **half a wave** (a dipole) or **a quarter wave** (a vertical over a ground). That is called **resonance**. Higher frequency means a shorter wavelength, so a shorter antenna. The exam formulas are the same ones you build with:

* wavelength (m) = 300 ÷ frequency (MHz)
* half-wave dipole, total length (ft) = **468 ÷ MHz**
* quarter-wave vertical (ft) = **234 ÷ MHz**

The 468 (not the free-space 492) already includes a 5 percent shortening because of the wire's thickness and its ends. It is why a 2 meter quarter-wave whip is about 19 inches (exam question T9A08).

<!-- lab:wave -->

## 2. SWR tells you about the match, not about how good the antenna is {#swr}

**SWR** (standing wave ratio) measures how well the antenna's impedance matches your 50 Ω coax and radio. 1:1 is a perfect match. 2:1 is fine. Above 3:1 many radios turn their power down to protect themselves (T7C05).

Two traps:

* **Low SWR does not mean a good antenna.** A dummy load is a perfect 1:1 and radiates nothing.
* **Feed-line loss hides high SWR.** A long run of cheap coax can make a bad antenna look good on the meter because the reflected power is eaten before it gets back to you.

<!-- lab:swr -->

## 3. Polarization: match the other station {#polarization}

The **polarization** of an antenna is the direction of its electric field, which is the direction of its wire. A vertical antenna is vertically polarized, a horizontal wire is horizontally polarized. Match polarization with the station you want to talk to. **FM repeaters and handhelds use vertical.** **Weak-signal SSB and CW on VHF and UHF use horizontal.** Cross-polarized stations lose a lot of signal (T3A04). On HF, the ionosphere scrambles polarization, so either works.

<!-- lab:polar -->

## 4. Pattern and gain: where the signal goes {#pattern}

No antenna makes power. A "high gain" antenna just squeezes the same power into a narrower beam, like focusing a flashlight. **Gain** is measured in **dBi** (against an imaginary antenna that radiates equally in all directions) or **dBd** (against a dipole). **dBi = dBd + 2.15.**

* A dipole has about 2.15 dBi and a figure-eight pattern.
* A vertical is **omnidirectional** (same in every compass direction).
* A **Yagi** or **quad** is a beam. More elements, narrower beam, more gain, and it has to be aimed.

<!-- lab:patterns -->

## 5. Height and clearance {#height}

Higher is better, for two reasons: it clears obstacles, and horizontal antennas radiate at lower angles (better for distance) as they climb. Metal nearby (gutters, wires, rain downspouts, other antennas) detunes and shadows an antenna. Hang it in the clear.

## 6. The feed line and common-mode current {#feedline}

The coax is a road. A bad road (cheap thin cable on a long run, rusty connectors, water in the cable) wastes power before it reaches the antenna. Another problem is **common-mode current**: RF flowing on the *outside* of the coax shield, which turns the cable into part of the antenna. Symptoms: SWR that changes when you touch or move the cable, RF in the shack, interference to the TV. The cure is a **choke**: either snap-on ferrites, or just **six to eight turns of the coax itself in a coil about 6 inches across**, taped, right at the antenna.

<!-- img:ladderline Open-wire (ladder) line has the lowest loss of all feed lines but needs a tuner and careful routing. -->

## 7. Bandwidth and band: one antenna, one band (mostly) {#bandwidth}

A simple resonant antenna works well in a slice of one band. A 10 meter dipole is *not* a 20 meter antenna. Antennas that work on many bands (end-fed half-waves, trap dipoles, anything with a tuner) all make trades somewhere: efficiency, complexity or cost. For a first antenna, **pick the one band you actually want to use and cut it for that**.

# Antenna types: what each is good for {#types}

Prices are rough US dollars for parts. "Difficulty" is for a first-timer.

| Antenna | Best for | Polarization | Pattern | Cost | Difficulty |
|---|---|---|---|---|---|
| Half-wave dipole | HF, first station, any single band | Horizontal | Figure-8, broadside | $10 to $25 | Easy |
| Inverted V | Same, with one support | Horizontal | Figure-8, a bit rounder | $10 to $25 | Easy |
| Quarter-wave ground plane | FM repeaters, local VHF/UHF | Vertical | Omni | $8 to $15 | Easy |
| J-pole / Slim Jim | Repeaters, portable, no radials | Vertical | Omni | $5 to $15 | Easy to medium |
| Yagi | Distance, weak signals, satellites, fox hunts | Either (vertical for FM) | Beam | $30 and up | Medium to hard |
| Quad / loop | Quiet reception, compact beams | Either | Beam or figure-8 | $20 and up | Medium |
| End-fed half-wave | Portable multi-band HF | Mostly horizontal | Varies | $25 to $50 | Easy to medium |
| Magnetic loop | Apartments, restricted space | Either | Figure-8 | $40 and up | Medium to hard |
| Mobile whip | Cars, handheld boosters | Vertical | Omni | $15 to $40 | Easy |
| Rubber duck | Convenience only | Vertical | Omni (lossy) | Free with the radio | n/a |
| Discone | Scanners, SDR, wide coverage | Vertical | Omni | $30 and up | Easy |
| Log-periodic | Wide band beam, TV, tests | Horizontal | Beam | $30 and up | Medium |

## Half-wave dipole and inverted V {#dipole}

Two equal wires, one on each side of the center, fed with coax in the middle. It is the reference antenna for the whole hobby. For HF it is the best first antenna: nothing to buy but wire, rope and coax. An **inverted V** hangs the center high on a mast or tree and lets the ends slope down, so it needs only one support.

* **Good for:** HF voice and CW, one band at a time, backup antennas, portable.
* **Skip it if:** you have no way to hang 30 to 70 feet of wire (on 10 meters it is only 16 feet, so it fits almost anywhere).
* **Tip:** keep the ends at least 8 feet off the ground. The ends carry high voltage and people.

<!-- img:invertedv An inverted V: the center is up, the legs slope down. Illustration from a US Army field manual. -->

## Quarter-wave vertical and ground plane {#groundplane}

One vertical element plus a few **radials** (wires sticking out from the base) that act as the missing half of the antenna. Radials drooped at about 45° bring the impedance close to 50 Ω. It is omnidirectional and vertically polarized, so it is the natural match for FM repeaters.

* **Good for:** repeaters, simplex, public service nets, any VHF/UHF FM work.
* **Skip it if:** you want gain toward one direction, or horizontal polarization.
* **Tip:** a vertical on HF needs lots of radials. On VHF four is plenty.

<!-- img:groundplane A ground plane antenna: the vertical element on top, radials drooping below. -->

<!-- img:fanvertical An HF vertical with elevated radials. On HF the radials do real work. -->

## J-pole and Slim Jim {#jpole}

A **half-wave** vertical fed through a **quarter-wave matching stub**. No radials, and you can make one from copper pipe, from TV ladder line, or from twin-lead. The Slim Jim is a folded variant with a bit lower takeoff angle. A **roll-up J-pole** made from 450 Ω window line weighs almost nothing and is the classic go-bag antenna.

* **Good for:** repeaters from a window, attic or tree; portable and emergency use.
* **Skip it if:** you cannot add a choke. J-poles are fussy about common-mode current.
* **Tip:** the proportions are always the same: half wave on top, quarter wave below.

<!-- img:jpole A J-pole next to its Slim Jim, Super-J and collinear variations. The long section is half a wave, the stub a quarter wave. -->

## Yagi {#yagi}

A driven element with a longer **reflector** behind and shorter **directors** in front, so the signal goes in one direction. Each extra element adds a little gain and narrows the beam. It has to be pointed, by hand or with a rotator.

* **Good for:** distance on VHF/UHF, weak-signal SSB and CW, repeaters that are too far, satellites (small handheld Yagis), direction finding.
* **Skip it if:** you want to cover all directions without moving anything.
* **Tip:** for FM, mount it vertically polarized. For SSB and CW on VHF, horizontal.

<!-- img:foxhunt A handheld directional antenna at a fox-hunting championship. Direction finding is half the fun of a Yagi. -->

## Quad and loop antennas {#quad}

A **cubical quad** is a full-wave square (or diamond) loop with a reflector. It is small for its gain, quiet on receive, and handles weather well. A simple **full-wave loop** of wire is a good low-noise HF antenna.

* **Good for:** quiet receive, compact beams, antennas for windy places.
* **Skip it if:** you want the simplest possible build.

<!-- img:quad A cubical quad: two square loops, one driven and one reflector. -->

## End-fed half-wave (EFHW) {#efhw}

A half-wave wire fed at one end through a matching transformer (commonly 49:1). It works on its fundamental band and its harmonics (40, 20, 15, 10 meters from a 40 meter wire). It needs one support at the far end and no center connection.

* **Good for:** portable and camping HF, hotel rooms, stealth.
* **Skip it if:** you want maximum efficiency. The transformer and common-mode current cost you a little.
* **Tip:** put a choke on the coax, and run the coax away from the wire.

## Magnetic loop {#magloop}

A small loop (about a meter across for 20 meters) with a variable capacitor. It is compact, quiet to receive, and works indoors, but it has a very narrow bandwidth. You retune it for every frequency change.

* **Good for:** apartments, balconies, restricted space.
* **Skip it if:** you want to hop around a band quickly.

<!-- img:loop A large loop antenna. A magnetic loop for ham use is a smaller cousin that is tuned with a capacitor. -->

## Mobile whips and the rubber duck {#whips}

A quarter-wave whip on a car roof uses the metal roof as its ground plane. A **5/8-wave** whip has more gain than a quarter wave (exam fact T9A09). The short **rubber duck** on a handheld is a compromise that trades efficiency for convenience (T9A04). A **telescoping quarter-wave whip** of about 19 inches on 2 meters is a dramatic upgrade, especially indoors or in a car.

* **Good for:** cars, handhelds, quick setups.
* **Tip:** a handheld used inside a car with no outside antenna loses signal to the metal body (T9A07). Use a roof-mounted antenna.

<!-- img:handheld A handheld with the stock rubber-duck antenna. Swapping the antenna is the cheapest upgrade in ham radio. -->

## Discone {#discone}

A disk on top of a cone gives an enormous bandwidth. It is not tuned for one band. Discones are the standard answer for scanners, **SDR receivers**, and monitoring many services. They can transmit on amateur bands but with a poor match on some.

* **Good for:** receiving everything from VHF through UHF.

<!-- img:discone A discone antenna. The disk above the cone gives it huge bandwidth. -->

## Log-periodic {#logperiodic}

A set of dipoles of different lengths on a common boom. It gives moderate beam gain across a wide range of frequencies. HF versions are huge. Small VHF/UHF versions are the same type as many old TV antennas.

<!-- img:logperiodic A large log-periodic array. The elements get shorter toward the front. -->

## Satellites and circular polarization {#satellite}

Satellites tumble, so their signals fade as the polarization changes (spin fading, exam T8B09). **Circular polarization** fixes that. A **handheld Yagi** (often called an Arrow or similar) and a hand-aimed radio is how most people work FM satellites. Doppler shift (T8B07) moves the frequency during the pass, so you adjust as you listen.

# Which antenna should I use? {#picker}

Pick a goal. The picker gives you the best options and the ones to skip.

<!-- lab:antpicker -->

# Build 1: Two meter ground plane (about $10) {#build-groundplane}

**What it is:** a quarter-wave vertical with four drooping radials. The simplest VHF antenna that works on repeaters. Make it for 146.520 MHz and it works across the entire 2 meter band.

**Parts**

* 1 SO-239 chassis connector ($3)
* about 8 feet of 12 or 14 AWG solid copper wire, or brazing or welding rod, or a wire coat hanger ($3)
* 5 small solder lugs or ring terminals, 5 small screws and nuts ($2)
* a piece of PVC pipe or a short board to mount on ($2)
* 50 Ω coax with a PL-259 on the antenna end ($10 to $25)

**Cut lengths** (use the calculator to change the frequency)

* **Vertical element:** 234 ÷ MHz feet, about **19.2 inches** at 146.52 MHz. Cut it a quarter inch long.
* **Four radials:** about 5 percent longer, about **20.2 inches** each.

<!-- lab:antcalc ground -->

**Steps**

1. Solder the vertical element straight to the center pin of the SO-239.
2. Put a lug under each of the four mounting screws on the SO-239 flange and bolt on the radials. The flange is the shield (ground) side.
3. Bend the radials down at about **45 degrees**. Flat radials give about 36 Ω; drooped radials bring it close to 50 Ω.
4. Mount the connector end on a PVC pipe or board so the vertical element points straight up.
5. Connect the coax and put a **choke** (six turns, 6 inches across) a few inches from the antenna.
6. Hoist it as high and clear as you can. Tape the connector with self-amalgamating tape, then electrical tape, to keep water out.

**Tune it:** measure SWR at 146.52 MHz. If the lowest SWR is *below* your target frequency, the vertical is too long; trim a **1/8 inch** at a time. If it is above, you cut too much (so cut slightly long next time). SWR should come in under 1.5:1.

**Why this teaches you something:** you just built the antenna from the Technician exam: question T9A08 (19 inches on 2 meters), T9A09 (why a 5/8 wave has more gain), T9B (50 Ω coax).

# Build 2: Roll-up J-pole from ladder line (about $15) {#build-jpole}

**What it is:** a half-wave radiator on top of a quarter-wave matching stub, made from a few feet of 450 Ω window line. It rolls up to the size of a sandwich, hangs from a branch or a curtain rod, and needs no radials. It is the best go-bag antenna for 2 meter repeaters.

**Parts**

* about 5 feet of **450 Ω window line** (ladder line, $0.30 per foot)
* 50 Ω coax with a PL-259 or BNC, a few feet long ($10)
* a short piece of bare wire for the shorting bar
* a few small zip ties and a loop of string

**Cut lengths** (starting values; every build trims differently)

* **Stub** (both conductors together): quarter wave × velocity factor ≈ 0.25 × λ × 0.91.
* **Radiator** (one conductor): half wave × 0.95 ≈ 0.5 × λ × 0.95.
* Leave about **3 inches extra** at the top to trim.

At 146.52 MHz: λ is about 80.6 inches, so the stub is about **18.3 inches**, the radiator about **38.3 inches**, and you start with about **59 inches** of line. Use the calculator below (it is set to J-pole).

<!-- lab:antcalc jpole -->

**Steps**

1. Cut the ladder line to the **total** length.
2. At the **bottom**, solder a short wire across both conductors. That is the shorted end of the stub.
3. Measure the **stub length** up from the short. Just above that point, cut **one** of the two conductors and remove the extra, leaving the other conductor running all the way to the top as the radiator.
4. Connect the coax about **1.5 inches above the short**: the coax center to the conductor that continues up to the radiator, the shield to the other (short) conductor. Slide this tap point up and down while watching SWR to find the lowest value; it is usually between 1 and 3 inches.
5. Make a **choke**: six turns of the coax in a 6 inch coil, taped, right under the tap. J-poles do not behave without one.
6. Hang it from the top by a loop of string, vertical, at least a few feet from metal and walls.

**Tune it:** if SWR is lowest below 146.5 MHz, trim the **top of the radiator** a quarter inch at a time. Then re-adjust the tap point. Done.

<!-- img:slimjim A Slim Jim diagram. The proportions are the same as the J-pole: half wave on top, quarter wave at the bottom. -->

# Build 3: Ten meter dipole (about $20) {#build-dipole}

**What it is:** a classic half-wave dipole for 28.4 MHz, in the part of the 10 meter band where **Technicians may use SSB voice** (28.300 to 28.500 MHz). The antenna is only about 16 feet long, so it fits on a balcony, a roof, or between two trees. When 10 meters is open, this is how you talk to the world with a Technician license. (The band opens when the sun is active and, mostly, in daylight. Check solar activity.)

**Parts**

* about 40 feet of 14 AWG stranded insulated wire ($6)
* a **center insulator** with a coax connector (a small plastic plate with an SO-239, or a 3D-printed or PVC one, $3 to $8)
* two **end insulators** (plastic spreaders, or a piece of PVC or even a zip tie, $2)
* 50 feet of RG-8X or RG-58 coax with connectors ($20 to $30)
* rope or paracord, and a way to hoist the center (a pole, a roofline, a tree) ($5)

**Cut lengths** (use the calculator to change the frequency)

* Total length = 468 ÷ MHz feet = **16.5 feet** at 28.4 MHz
* Each leg = **8 ft 3 in**. **Cut each leg about 5 percent long** (8 ft 8 in) and trim it to resonance.
* On 15 meters (21.1 MHz, CW for Technicians) each leg is about 11 ft 1 in. On 40 meters (7.05 MHz, CW) about 33 ft.

<!-- lab:antcalc dipole -->

**Steps**

1. Cut two equal legs, each 5 percent long.
2. Attach one leg to each side of the center insulator (one to the center pin, one to the shield side).
3. At each end, loop the wire through the end insulator and **fold it back on itself** with a few turns. That makes it easy to adjust the length by an inch.
4. Add a **choke** at the feed point: six to eight turns of coax, 6 inches across, taped. Or snap-on ferrites.
5. Hang it as an **inverted V**: center as high as you can (20 to 30 feet is great), ends sloping down but at least **8 feet above the ground**. Keep clear of power lines and people.
6. Run the coax away at right angles to the wire for a few feet, then down.

**Tune it:** with an SWR meter, check **28.000, 28.200, 28.400, 28.600 MHz**. The lowest SWR point tells you the antenna's resonance.

* Lowest SWR **below** your target? The antenna is **too long**. Shorten each leg.
* Lowest SWR **above** your target? Too short. (Make a note: cut long next time.)
* **Rule of thumb:** to move the resonance 100 kHz at 28.4 MHz, change each leg by about **0.35 inch**.

Try the trimming lab below to feel how this works.

<!-- lab:trim -->

# Feed lines, connectors, and chokes (cheaply) {#feed}

* **Coax:** RG-8X is a good all-around choice; RG-58 is fine for short runs; use thick, low-loss coax (LMR-400 or similar) for long VHF/UHF runs. The shorter the better. **Loss rises with frequency** (T9B05).
* **Connectors:** **PL-259 (UHF)** for HF and VHF, **BNC** on handhelds, **Type N** above about 400 MHz (T9B06). **Tape all outdoor connectors** with self-amalgamating tape, then electrical tape (T9B01).
* **Choke:** six to eight turns of the coax in a 6 inch coil at the antenna. It costs nothing and cures a lot.
* **Impedance:** 50 Ω is the amateur standard (T9B02).

<!-- img:pl259 A PL-259 (UHF) connector, common on HF and VHF gear. -->

# Troubleshooting {#troubleshooting}

| Symptom | Likely causes | What to do |
|---|---|---|
| High SWR everywhere | Bad connector or cable, shorted element, wrong antenna for the band | Check the connector first, then try another coax |
| SWR lowest at the wrong frequency | Wrong length | Trim or lengthen, the rules of thumb above |
| SWR jumps when you touch the cable | Common-mode current | Add a choke at the antenna |
| SWR changes with weather | Water in the connector or coax | Reseal or replace; coax can fail from moisture (T7C09) |
| Erratic SWR | Loose connection in the antenna or feed line (T9B09) | Re-solder and tighten |
| RF in the shack, TV or audio buzz | Common-mode current, overloaded neighbor equipment | Chokes, ferrites, and good grounding |
| No contacts | Wrong polarization, antenna too low, band closed | Check the band, polarization, and height |

<!-- img:swrmeter An SWR and power meter. It goes in the feed line between the radio and the antenna (T4A05). -->

# Safety {#safety}

* **Power lines kill.** Stay far from them. If your antenna falls, no part of it may come within **10 feet** of a power line (T0B06). **Never attach an antenna to a utility pole.**
* **Never climb alone**, and use a harness and tie-off (T0B).
* **RF exposure.** Keep antennas away from people, especially at higher power. Relocating the antenna is the most effective fix (T0C08). The station licensee is responsible for exposure limits (T0C13).
* **Lightning.** Disconnect antennas in storms; use a lightning arrester on a grounded panel where the feed line enters (T0A07).
* **Neighbors and rules.** In the US, **PRB-1** requires state and local governments to reasonably accommodate amateur antennas, but it does **not** override private contracts such as HOA rules or a lease. Check yours.

<!-- img:tower Tower work. Harness, tie-off, training and a spotter on the ground. -->

# Exam connections {#exam}

Every idea here appears on the Technician exam:

* **T9A Antennas:** polarization, gain, beams, loading, the 19 inch quarter wave, dipole pattern.
* **T9B Feed lines:** coax, 50 Ω, connectors, tuners, SWR.
* **T7C Antenna measurements:** SWR, dummy loads, feed line failure.
* **T3A and T3B:** polarization and wavelength.

[Practice T9A](#/drill?group=T9A) · [Practice T9B](#/drill?group=T9B) · [Practice T7C](#/drill?group=T7C)

> **Elmer says:** The best way to learn is to build one. Make the 10 meter dipole this weekend. When you hear your first station answer you, the whole exam makes sense.
