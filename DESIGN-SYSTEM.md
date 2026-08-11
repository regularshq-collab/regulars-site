# REGULARS — Design System

**"The Press Shop."** The site is *set*, not designed. Ink laid on stock, everything
locked to a grid, every number set in metal. The emotional target is competence you can
feel — the reassurance an owner-operator gets from a clean invoice, a labelled toolboard,
or a truck with proper vinyl lettering.

**The one rule that keeps this out of SaaS territory:** every element is either **type**, a
**rule**, or a **mark**. There is no fourth category. No cards. No panels. No containers
with soft backgrounds. Structure is made of lines and empty space.

Files:

- `/assets/styles.css` — the only stylesheet. Page-level `<style>` blocks are forbidden
  except for a genuinely page-unique one-off (a hand-fitted hero line height, say).
- `/assets/site.js` — the only script. Holds `BOOKING_URL` at the very top.

---

## 1 · The laws

1. **Amber is a torque marking, not a brand colour.** Five appearances per page, maximum.
   Count them by hand before shipping.
2. **Amber never carries text on paper.** `#E8A33D` on `#F6F3EC` is 1.8:1. On paper amber
   is a *fill*, a *rule*, or a *stroke* only. Amber text is legal on navy (8.1:1). If a
   word must read warm on paper, use `--amber-deep` at h3 size or larger.
3. **Oswald is always uppercase.** If it wants mixed case, it should be Inter.
4. **Never set Oswald below 14px.** Below that it turns to mush; use Inter uppercase
   (`.eyebrow`, `.label`, `.folio`) instead.
5. **No rule ever floats centred with space on both sides.** Rules run to an edge — of the
   viewport, of the column group, or of the text they belong to.
6. **Body copy never starts at column 1.** Column 1 is frequently empty on purpose and
   carries the vertical spine.
7. **No two adjacent sections share a ground or a column footprint.** Write the spans down
   and check them.
8. **Every figure on the page is tabular.** Prices, times, ratings, phone numbers.
9. **Headline line breaks are hand-placed** with `<br>`. `text-wrap: balance` is banned on
   display type — the ragged edge is the composition.
10. **Nothing is rounded, nothing blurs, nothing bounces, nothing lifts.**

Contrast, verified: paper/navy 14.8:1 · steel/paper 6.2:1 · steel-lift/navy 4.9:1 ·
navy/amber 8.1:1. Banned: amber text on paper; steel text on navy (2.0:1 — rules only).

---

## 2 · Tokens

Colour: `--navy #12233D` · `--navy-deep #0C1728` · `--navy-lift #1B3253` ·
`--steel #2C5F7C` · `--steel-lift #4A7E9B` · `--amber #E8A33D` · `--amber-deep #C9862A` ·
`--paper #F6F3EC` · `--paper-2 #EFEAE0` · `--paper-3 #E4DED1`.
Hairlines: `--hair`, `--hair-strong`, `--hair-dark`, `--hair-dark-strong`.

`--rule-color` is the token every component reads for its hairlines. Dark grounds
(`.band--navy`, `.band--navy-deep`, `.band--steel`, `.band--painted`, `.on-dark`) re-point
it automatically, so **components need no dark variants of their own**. If you build a dark
region that is not a band, add `class="on-dark"`.

Space: `--s1 4px` → `--s12 224px` on an 8px base (4px half-step for optical corrections
only). Band rhythm: `--band-pad`, `--band-pad-dark`, `--band-pad-tight`, `--band-pad-strip`.

Type: `--sans` (Inter), `--cond` (Oswald); sizes `--f-micro` `--f-label` `--f-label-2`
`--f-small` `--f-body` `--f-lede` `--f-h4` `--f-h3` `--f-h2` `--f-h1` `--f-display`
`--f-numeral`.

Motion: `--ease cubic-bezier(.2,0,0,1)`, `--t-fast 120ms`, `--t 140ms`, `--t-slow 180ms`.
180ms is the ceiling. No overshoot, ever.

---

## 3 · Page skeleton

```html
<body>
  <!-- paste headerHtml here, skip link included -->
  <main id="main">
    <section class="band band--paper"> … </section>
    <section class="band band--navy"> … </section>
  </main>
  <!-- paste footerHtml here -->
</body>
```

One `<h1>` per page. `<main id="main">` is required — the skip link targets it.

---

## 4 · Type

| Class | What it is |
|---|---|
| `.t-display` | Hero lettering only. One per site page, at most. Oswald 600, `line-height:.84`. |
| `h1` / `.t-h1` | Page title. Oswald 600. |
| `h2` / `.t-h2` | Section title. Oswald 500. |
| `h3` / `.t-h3` | Pillar name, sub-head. Oswald 500. |
| `h4` / `.t-h4` | Inline lead-in. **Inter 600, sentence case** — not Oswald. |
| `.lede` | The one paragraph under a display line. Max 40ch, set automatically. |
| `p` | Body. Hard ceiling 62ch — pair with `.measure` (42ch) or `.measure-tight` (34ch). |
| `.t-small` | Caption, footnote, legal. |
| `.t-muted` | Steel on paper, steel-lift on navy. Switches automatically. |
| `.eyebrow` / `.label` | 11px Inter 600, `.19em` tracked caps. The stencilled voice. |
| `.label-lg` | 13px version, for anything that needs to be read across the room. |
| `.folio` | 10px, `.24em`. Sheet numbers, colophons. |
| `.tnum` | Force tabular/lining/slashed-zero figures. Already on tables, plates, sticks. |
| `.stop` | The amber full stop. `<span class="stop">.</span>` |
| `.cond` | Opt any element into Oswald uppercase. |
| `.measure` / `.measure-tight` / `.measure-wide` | 42ch / 34ch / 58ch caps. |
| `.prose` | Wrapper that gives inline `<a>` a 1px underline thickening to 2px. |

```html
<span class="eyebrow">Sheet 02 · Capture</span>
<h2 class="mt-4">When nobody<br>picks up</h2>
<p class="lede mt-5">A call comes in while you are on a job.</p>
```

---

## 5 · Signature devices

### 5.1 Misregistration overprint — `.overprint`

A second ink pass that did not quite line up. The offset is locked at **2px, not em**:
registration error on a press is physical, so it must not scale with the type. Use on the
hero display and **one** statement band per site. Never more — it stops being a press
artefact and becomes a style the moment it is everywhere.

`data-ink` must repeat the text **with the same line breaks**, encoded as `&#10;`
(the pseudo-element is `white-space: pre-wrap`). Mismatched breaks look like a bug.

```html
<h1 class="t-display overprint" data-ink="Keep the&#10;customers&#10;you already&#10;have.">
  Keep the<br>customers<br>you already<br>have<span class="stop">.</span>
</h1>
```

### 5.2 Stroked numerals — `.numeral`

Oversized outlined figures for sequences and stats. They bleed off the container edge and
sit *behind* their content. One per pillar, one per stat — never a grid of them.

Modifiers: `.numeral--on-navy` (steel-lift stroke), `.numeral--amber` (once per page),
`.numeral--solid`. Positioning: `.numeral-bleed-left`, `.numeral-bleed-right`,
`.numeral-bleed-bottom`, on a parent carrying `.has-numeral` (which relatively positions the
parent and lifts real content above the figure).

```html
<div class="has-numeral">
  <span class="numeral numeral-bleed-left" aria-hidden="true">01</span>
  <h2>Capture</h2>
</div>
```

### 5.3 Ghost lettering — `.ghost-word`

A single word at 18vw in navy at 5.5% opacity, running off two edges, half-hidden behind
the real content. The faded painted wall ad under the new one. **Once per page.** Always
`aria-hidden="true"`; put it in a container with `.u-relative.u-clip`.

### 5.4 The composing stick — `.stick`

Big figures set as individual metal sorts in a hairline-divided stick.

```html
<span class="stick">
  <i class="sym">$</i><i>2</i><i>4</i><i>9</i><i class="unit">/mo</i>
</span>
<div class="rule-slab--amber"></div>
```

`.stick--sm` for h3-scale. The `$` rides at cap height; the unit hangs at the baseline.

### 5.5 Fitted lettering — `.fitline`

Sign-writer line fitting: size each line so a 4-character word and an 11-character word
optically fill the same panel. Set `--fit` per line; never use `scaleX`.
Rough starting point: `font-size ≈ target-width-in-vw ÷ (characters × 0.46)`, then eyeball
±0.4vw per line.

```html
<h1><span class="fitline" style="--fit:9.6vw">Missed calls</span>
    <span class="fitline" style="--fit:22vw">book</span>
    <span class="fitline" style="--fit:10.2vw">themselves<span class="stop">.</span></span></h1>
```

### 5.6 Substrate

Paper fibre + laid-paper tooth are applied globally to `<body>` (inline `feTurbulence`
data-URI, no network request). Bands that set their own ground carry their own grain
automatically. Two opt-ins:

- `.baseline-grid` on a band — a ghosted 32px baseline grid that dissolves as you scroll
  into the copy. It reads as a printer's guide sheet showing through.
- `.colghost` — twelve empty `<i>` elements, absolutely positioned inside a
  `.u-relative` hero, showing the real column edges. Exact, not faked with a gradient.

```html
<section class="band band--paper baseline-grid u-relative">
  <div class="colghost" aria-hidden="true"><i></i>… twelve total …<i></i></div>
  <div class="grid"> … </div>
</section>
```

### 5.7 Corner ticks — `.corner-ticks`

Crop marks on the four corners of a content box, so the block reads as a trimmed page.
Add the class to any positioned container. Costs nothing, reads instantly as print
production.

### 5.8 The vertical spine — `.spine`

Column 1 (or 12) holds a rotated micro-caps label against a full-height hairline, like the
spine of a bound catalogue. `.spine--right` flips it; `.spine--sticky` pins it for the
length of the section. **Hidden below 900px** — it is a desktop-composition device and
faking it on mobile looks apologetic.

```html
<div class="spine cs-1 sp-1"><span>Est. for owner-operators</span></div>
```

Content examples: `EST. FOR OWNER-OPERATORS`, `NO CONTRACT · CANCEL AFTER 90 DAYS`,
`SHEET 02 OF 05`, `RUNS WITHOUT YOU`.

---

## 6 · Grid and layout

`.grid` — 12 columns at ≥901px, 8 at 601–900, 4 at ≤600. Max 1400px, fluid side margins.
Every direct child defaults to `1 / -1`, so you only declare what you want to offset.

| Utility | Effect |
|---|---|
| `.cs-1` … `.cs-12` | column-start, ≥901px only |
| `.sp-1` … `.sp-12` | span, ≥901px only |
| `.t-cs-1` … `.t-cs-8` / `.t-sp-1` … `.t-sp-8` | tablet overrides, 601–900px |
| `.row-1` / `.row-2` | explicit grid row |
| `.bleed` | full-viewport-width escape hatch inside a `.grid` child |
| `.bleed-left` / `.bleed-right` | bleed one side only |

**Column doctrine.** Rotate between four placements so no two consecutive sections share a
footprint:

| Placement | Classes | Used for |
|---|---|---|
| A | `.cs-2 .sp-7` | hero headline, statement bands |
| B | `.cs-4 .sp-6` | primary body sections — the signature indent |
| C | `.cs-2 .sp-5` + `.cs-8 .sp-4` | editorial spread, unequal |
| D | `.cs-1 .sp-5` + `.cs-7 .sp-6` | inverted spread, heavy left |

At least two sections per page must start at column 3 or later. Let column 12 carry only a
folio; leave column 1 empty for the spine.

Flow helpers: `.flow` / `.flow-sm` / `.flow-lg` (owl margins), `.stack`, `.stack-lg`,
`.cluster`, `.between`, `.self-end`, `.self-bottom`, `.push-down`.
Spacing: `.mt-2` … `.mt-10`, `.mb-4` … `.mb-9`.
Misc: `.text-right`, `.nowrap`, `.u-hide-sm` (hide ≤900), `.u-hide-lg` (show ≤900 only),
`.u-relative`, `.u-clip`, `.sr-only`.

---

## 7 · Bands

`.band` is the section shell. Grounds must alternate.

| Class | Ground |
|---|---|
| `.band--paper` | transparent — the stock shows through |
| `.band--tint` | `--paper-2`, the alternate register |
| `.band--navy` | the ink |
| `.band--navy-deep` | second pass, for the loudest moment |
| `.band--steel` | rare; a diagram or schematic band |
| `.band--painted` | navy panel + amber brush stripe + inset keyline |

Rhythm modifiers: `.band--tight`, `.band--strip` (deliberately cramped, so the anchor bands
feel enormous by comparison), `.band--anchor` (up to 240px of air). Dark bands already get
more padding than paper bands — ink needs air.

Add-ons: `.band--drafting` (24px drafting grid on a dark ground), `.baseline-grid`,
`.band--sheared` (clipped bottom edge — **once per page maximum**).

The painted band needs two empty spans as its first children:

```html
<section class="band band--painted band--sheared">
  <span class="stripe" aria-hidden="true"></span>
  <span class="keyline" aria-hidden="true"></span>
  <div class="grid"> … </div>
</section>
```

The amber stripe deliberately stops 18% short of the right edge — the point where the
painter lifted the brush. The keyline is open on its right side for the same reason.

---

## 8 · Rules

Four weights, and using the wrong one is a bug.

| Class | Spec | Meaning |
|---|---|---|
| `.rule-hair` | 1px | a division within a thought; spans a full column group |
| `.rule-2` | 2px | a heading's underscore |
| `.rule-under` | 2px, inline | underscore sized to the heading's own text width — put it on the heading |
| `.rule-slab` | 5px `currentColor` | a section boundary; **full-bleed only** |
| `.rule-slab--amber` | 5px amber | the single most important fact on the page. Once. |
| `.rule-hazard` | 6px amber/navy diagonal | the one loudest transition per page. Never twice. |
| `.rule-vert` | 1px vertical | divider inside a flex row |
| `.hand-rule` | inline SVG | a brushed divider with a tiny wobble; square caps |

```html
<h2 class="rule-under">Comeback</h2>
<div class="rule-slab bleed" style="color:var(--navy)"></div>
<svg class="hand-rule" viewBox="0 0 1200 8" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0 4.6 C 180 3.1, 300 5.4, 470 4.2 S 760 2.9, 930 4.8 S 1120 4.0, 1200 3.4"
        fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/>
</svg>
```

---

## 9 · Section headers and folios

Every section opens the same way. It never gets old because what sits *under* it changes
shape every single time.

```html
<div class="sechead">
  <span class="sechead__id">01 <i>/</i> Capture</span>
  <span class="sechead__sheet">Sheet 02 of 07</span>
  <h2 class="sechead__title">When nobody<br>picks up</h2>
  <p class="sechead__lede lede">Optional single lede line.</p>
</div>
```

The `<i>` inside `.sechead__id` is the amber slash — one of the page's five amber slots.
`.sechead__sheet` hides below 600px.

The folio slug — two labels with a hairline flexing between them:

```html
<p class="folio-slug"><span>Sheet 03 · Comeback</span><span class="folio-slug__fill"></span>
  <span>Regulars / Retention System</span></p>
```

---

## 10 · Buttons and links

| Class | Behaviour |
|---|---|
| `.btn` | Base. Navy ground, paper type, ink wipe filling from the left like a roller on a plate. |
| `.btn.btn-amber` | **The CTA.** Amber fill, navy type, hard 4px offset (zero blur). Hover presses it 2px into the page; active presses it flat. |
| `.btn.btn-ghost` | 1px outline, wipes to solid. Inverts automatically on dark grounds. |
| `.btn--sm` / `.btn--lg` / `.btn--block` | size modifiers |
| `.btn-row` | flex row for one primary + one text link |
| `.link` | body-adjacent link: hairline underline that thickens to 2px amber |
| `.link-arrow` | tracked micro-caps + a drawn arrow that steps 4px right on hover |

Never two equal-weight buttons side by side. One solid CTA plus one text link.

**Every booking CTA is exactly this markup, on every page:**

```html
<a href="#booking-link" class="btn btn-amber js-booking">Book a Free Call</a>
```

Do not write a real URL into any page. `site.js` holds one `BOOKING_URL` constant and
rewrites every `.js-booking` href on load, adding `target="_blank" rel="noopener"` **only**
if that constant becomes an `http(s)` URL.

---

## 11 · Icons — `.icon`

Hand-drawn inline SVG only. 24×24 box, 2px inset, `stroke-width:1.5`,
**`stroke-linecap:butt`, `stroke-linejoin:miter`**, `fill:none`, `stroke:currentColor`.
Round caps are the visual signature of every icon library on earth and would undo the
direction in one stroke. Snap geometry to 0.5px offsets so lines stay crisp at 1×.

Sizes: `.icon--sm` 16 · default 24 · `.icon--lg` 40 · `.icon--xl` 64.
Colour: `.icon--steel`, `.icon--amber`. Never more than one large icon per viewport.

The six drawings for the whole site: handset whose arc has a 2px gap (Capture) · five-point
star drawn as a single **open** polyline overshooting its start by 1.5px (ReviewPing) ·
envelope with a U-turn arrow whose head is two straight strokes (Comeback) · calendar block
with one cell struck through · clock showing only the 12 and a minute hand at 1 · arrow-right.

```html
<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M2.5 8.5h11M9.5 4.5l4 4-4 4"/>
</svg>
```

---

## 12 · The data plate — `.plate`

A bordered spec block with an inverted title bar and four 3px corner rivets. It is the
site's logo-equivalent: the object you would recognise across the room. Use it in the hero,
as the pricing summary, and in the footer region — the document then closes on the same
object it opened with.

```html
<div class="plate">
  <div class="plate__head"><span>Regulars · 1</span><span>Rev 2026.1</span></div>
  <dl class="plate__body">
    <div class="plate__row"><dt>Reply</dt><dd><em>~60 sec</em></dd></div>
    <div class="plate__row"><dt>Number</dt><dd>Keeps your existing line</dd></div>
    <div class="plate__row"><dt>Install</dt><dd>$500 one-time</dd></div>
    <div class="plate__row"><dt>Service</dt><dd><em>$249</em> / month</dd></div>
    <div class="plate__row"><dt>Term</dt><dd>No contract after 90 days</dd></div>
  </dl>
  <div class="plate__foot">Data plate · Regulars</div>
</div>
```

`.plate` is drawn for dark grounds; `.plate--light` inverts it for paper. `<em>` inside a
`dd` promotes that value to Oswald. Row hover lifts the ground and adds a 2px amber inset —
the only amber inside the plate.

---

## 13 · Spec rows, dot leaders, tables

Every list of facts is a spec sheet. Never bullets, never a card. This is the most reusable
component in the system.

```html
<dl class="spec">
  <div class="spec-row"><dt>Setup</dt><span class="leader"></span><dd>$500</dd></div>
  <div class="spec-row"><dt>Service</dt><span class="leader"></span><dd>$249/mo</dd></div>
</dl>
```

`.leader-row` is the contents-page variant (`auto 1fr auto`) for FAQ indexes and
what's-included lists.

Real tables: `.table` with `.table--zebra`, `.table--hover` (row hover adds a 2px amber
inset), `.cell-name` to promote the first cell to Oswald, and `.table-scroll` as the
required wrapper — tables drop to a 520px minimum and scroll inside their own container so
the page body never scrolls sideways.

```html
<div class="table-scroll">
  <table class="table table--zebra table--hover">
    <caption>Comeback campaigns</caption>
    <thead><tr><th>Campaign</th><th>Trigger</th><th>Timing</th></tr></thead>
    <tbody><tr><td class="cell-name">Reactivation</td><td>No visit in 6 months</td><td>3 emails</td></tr></tbody>
  </table>
</div>
```

---

## 14 · Stats, status strip, dimension line

**`.stats` / `.stat`** — a rule-divided row of figures. `.stat__fig` (Oswald),
`.stat__label` (tracked caps), `.stat__note` (optional small print).

**`.status-strip` / `.status-cell`** — four cramped cells with a label over a value,
hairline top and bottom. Collapses to 2×2 below 760px. Put one `span.cond` in the last cell
so a single word lands in Oswald — a small joke, correctly told.

```html
<div class="status-strip">
  <div class="status-cell"><b>Reply time</b><span class="cond">~60 sec</span></div>
  <div class="status-cell"><b>Setup</b><span class="cond">7 days</span></div>
  <div class="status-cell"><b>Your number</b><span class="cond">Unchanged</span></div>
  <div class="status-cell"><b>Apps to learn</b><span class="cond">None</span></div>
</div>
```

**`.dim`** — the dimension line. Engineering-drawing measurement applied to something
nobody normally measures: the width of a price numeral, the gap between two events. One per
page; amber (`.dim--amber`) only on the pricing page.

```html
<div class="dim">
  <span class="dim__tick"></span><span class="dim__line dim__line--start"></span>
  <span class="dim__label">≈ 60 sec</span>
  <span class="dim__line dim__line--end"></span><span class="dim__tick"></span>
</div>
```

---

## 15 · Pillars

Three **plates**, not three cards. Each pillar gets a different ground, a different internal
grid, a different content form and a different reading direction. The form should carry the
meaning: Capture is about *time*, so draw a timing diagram; ReviewPing is about *trend*, so
draw a plot; Comeback is about *schedule*, so build a table.

`.pillar` (positioned, clipped) · `.pillar__num` (the stroked figure, clipped by the
viewport edge) · `.pillar__inner` · `.pillar__kicker` · `.pillar__title` (carries its own
2px underscore) · `.pillar__body` · `.pillar__figure`. `.pillar--mirror` flips the numeral
to the right edge and right-aligns the text — that reversal is what stops the sequence
developing a card rhythm. It un-mirrors below 900px.

`.contact-sheet` is the strip that introduces the sequence:

```html
<p class="contact-sheet"><b>The system</b><span>01 Capture</span><span>02 ReviewPing</span><span>03 Comeback</span></p>
```

---

## 16 · Steps and timelines

`.steps` / `.step` / `.step__num` (stroked) / `.step__when` / `.step__title` / `.step__body`
— a schedule hung off a 5px rule, not a row of numbered circles.

`.timeline` / `.timeline__axis` / `.timeline__marks` / `.timeline__mark` — ticks descending
from one horizontal rule. Real timelines are not evenly spaced: vary the column spans.
`.timeline__mark--amber` gives one milestone an amber drop-line twice as long as the others.
Rotates to a vertical list below 900px.

---

## 17 · Pricing

`.docket` — the job docket: a `--paper-2` block with a 2px navy top rule and a **scalloped
perforation masked along its bottom edge**. `.docket__head`, `.docket__total` (5px slab
above the total).

`.stamp` — rotated −7°, 2px `--amber-deep` border, Oswald 600, reading `NO CONTRACT`. It
sits *over* the rule, breaking the box, which is exactly what a stamp does. Below 600px it
un-rotates into the flow.

`.perf` — a tear-off edge. `.customer-copy` — the rotated micro-caps line beneath it
(`CUSTOMER COPY — RETAIN FOR YOUR RECORDS`). That 1.5° rotation should be the only
non-orthogonal element on the page besides the stamp.

`.price-figure` — wrapper for the oversized numeral, so a `.dim` can be measured against it.

Pricing copy is fixed and must be stated exactly: **$500 one-time setup + $249/month, cancel
any time after the first 90 days.** One price, no tiers. Never invent another number.

---

## 18 · Directory list — `.directory`

This replaces every situation where a template would reach for cards: industries, FAQ
indexes, feature lists, the sub-items inside Comeback.

```html
<div class="directory">
  <a class="dir-row dir-row--flood" href="/industries.html#hvac">
    <span class="dir-row__no">01</span>
    <span class="dir-row__name">HVAC</span>
    <span class="dir-row__meta">Seasonal service</span>
  </a>
</div>
```

Hover slides a 4px amber slab out from the left edge and opens the meta tracking from .16em
to .2em. `.dir-row--flood` additionally floods the whole row navy with paper type — like a
proof being pulled. 84px minimum row height, so the hit target is never in question.

---

## 19 · FAQ accordion

Markup is exact — the double wrapper inside `.faq__a` is what makes the `0fr → 1fr` grid
transition work without measuring anything.

```html
<div class="faq">
  <div class="faq__item">
    <button class="faq__q" type="button" aria-expanded="false">
      <span class="faq__idx">Q.01</span>
      <span>Do I keep my phone number?</span>
      <span class="faq__sign" aria-hidden="true"></span>
    </button>
    <div class="faq__a"><div><div class="faq__inner">
      <p>Yes. Nothing about your line changes.</p>
    </div></div></div>
  </div>
</div>
```

`site.js` wires `aria-expanded`, generates the panel id, links `aria-controls` /
`aria-labelledby`, and toggles `.is-open`. The `+` sign loses its vertical stroke when open.
No chevron circles.

---

## 20 · Forms

No boxes, no fills, no radius: a 1px underline per field that thickens to 2px amber on
focus. Labels are stencilled micro-caps sitting above the rule.

```html
<div class="field">
  <label class="field__label" for="email">Email <span class="req">*</span></label>
  <input class="field__input" id="email" name="email" type="email" required
         autocomplete="email" data-error-required="We need an email to reply.">
  <span class="field__hint">We reply within one business day.</span>
  <span class="field__error" role="alert"></span>
</div>
```

Also: `.form`, `.form-grid` (2-up, collapses at 700px), `.field--full`, `.field__select`,
`.field__textarea`, `.check` (a square that fills — never a toggle pill), `.form-note`,
`.form-status`.

Validation states are `.is-invalid` / `.is-valid` on the `.field`, applied by `site.js`.
**Colour is never the only signal** — the field rule turns `--amber-deep` *and* the
`.field__error` message appears. `aria-invalid` is set on the input.

The contact form has `id="contact-form"` and **posts nowhere**. It validates client-side and
composes a `mailto:` to `regularshq@gmail.com` (the `CONTACT_EMAIL` constant in
`site.js` — clearly swappable). The page must say so in visible copy.

---

## 21 · The revenue calculator

Standard IDs — use these exactly or the script will not find it:
`calc-job-value`, `calc-missed-calls`, `calc-close-rate`, `calc-close-rate-out`,
`calc-monthly`, `calc-annual`.

Arithmetic, run live on every input: `monthly = job value × missed calls per week ×
(close rate ÷ 100) × 4.33 weeks`, and `annual = monthly × 12`. Currency is formatted with
`Intl.NumberFormat`, whole dollars. The close-rate slider defaults to a **deliberately
conservative 25%**.

**Every page that embeds the calculator MUST carry the caveat**, visibly, in
`.calc__caveat` — it is an estimate built from the owner's own numbers, not a claim or a
promise from Regulars. Suggested wording:

> This is an estimate built from the numbers you typed, not a promise from Regulars.
> Change any figure and it changes with you.

```html
<div class="calc">
  <div class="calc__grid">
    <div class="field">
      <label class="field__label" for="calc-job-value">Average value of one job</label>
      <span class="calc__money"><span>$</span>
        <input id="calc-job-value" type="number" inputmode="numeric" min="0" step="25" value="450">
      </span>
    </div>
    <div class="field">
      <label class="field__label" for="calc-missed-calls">Calls missed per week</label>
      <span class="calc__money"><span>#</span>
        <input id="calc-missed-calls" type="number" inputmode="numeric" min="0" step="1" value="8">
      </span>
    </div>
    <div class="field field--full calc__rangewrap">
      <div class="calc__rangehead">
        <label class="field__label" for="calc-close-rate">Share who would book if reached</label>
        <span class="calc__rangeout" id="calc-close-rate-out" aria-live="polite">25%</span>
      </div>
      <input class="calc__range" id="calc-close-rate" type="range" min="0" max="100" step="5" value="25">
    </div>
  </div>
  <div class="calc__out mt-8">
    <div class="calc__cell"><span class="calc__fig calc__fig--lead" id="calc-monthly">$0</span>
      <span class="calc__cap">Recovered per month</span></div>
    <div class="calc__cell"><span class="calc__fig" id="calc-annual">$0</span>
      <span class="calc__cap">Recovered per year</span></div>
  </div>
  <p class="calc__caveat">This is an estimate built from the numbers you typed, not a
    promise from Regulars. Change any figure and it changes with you.</p>
</div>
```

`.calc__fig--lead` is amber **only on a dark ground**; on paper it stays navy and the
emphasis comes from size alone.

---

## 22 · Testimonials and statements

`.quotes` / `.quote` / `.quote__text` / `.quote__by` / `.quote__trade` — hairline-ruled
blocks with a 2px top rule. `.quote--stripe` swaps that for a 6px amber pinstripe at the
left, the same width as the painted band's top stripe: the pinstripe as punctuation.
Nothing lifts, nothing is a card.

Until real quotes exist, mark each one honestly with `.quote__placeholder`
(`PLACEHOLDER — REPLACE WITH A REAL CUSTOMER QUOTE`). Never ship invented testimonials
without that flag.

`.statement` — the full-bleed poster-scale sentence. `.statement .knock` knocks a phrase out
to outline. `.statement--light` drops to Oswald 300, which after a page of heavy lettering
is itself the surprise. `.attribution` for the slug beneath.

```html
<p class="statement">If they don't hear back in five minutes, they call
  <span class="knock">the next name</span> on the list.</p>
<span class="attribution">— How it actually goes</span>
```

---

## 23 · Header and footer

Paste `headerHtml` and `footerHtml` byte-identically on every page. **Do not hardcode the
active nav state** — `site.js` derives it from `location.pathname` and treats `""`, `"/"`
and `"/index.html"` all as home.

Seven destinations resolve into five: the three pillars live behind a real **"The System"**
disclosure. It is a `<button>`, so Enter and Space already work; the script adds hover-open
on fine pointers, `ArrowDown`/`ArrowUp`/`Home`/`End` to walk the items, `Escape` to close
and refocus the button, and click-outside to dismiss. Below 1000px the whole nav collapses
into `#nav-panel`, which lists all seven flat under a group label, traps Tab, closes on
Escape, and restores focus.

The header carries a hairline utility rail above the masthead (the spec header of a
technical drawing). On scroll past 24px, `site.js` adds `.is-scrolled`: the rail collapses,
the masthead shortens to 56px and a 2px amber rule appears at the bottom edge. **No shadow.
Ever.**

Footer: `--navy-deep`, opening with a 5px paper slab, four unequal columns
(`.foot-col--wide` 5 / `--a` 3 / `--b` 2 / `--c` 2), a centred colophon, and the cropped
`.foot-mark` wordmark bleeding off both edges in `--navy-lift` — the back of the sign.
`.js-year` is filled by the script.

---

## 24 · Motion, reveals, focus

Transitions are 120–180ms with `--ease`. Nothing overshoots, nothing scales, nothing
translates on hover except the amber CTA pressing 2px into the page.

`.reveal` + `.reveal-1` … `.reveal-4` (40ms stagger) — an 8px rise and a fade, fired once by
an IntersectionObserver. Use it sparingly: one band per page, at most. The reveal is gated
on a `.js` class the script adds to `<html>`, so a visitor without JavaScript sees
everything. Under `prefers-reduced-motion: reduce` the observer is skipped entirely and the
elements are simply shown.

Focus is never removed and never rounded. The default ring is a 2px navy outline with a 1px
amber inner (correct on paper); dark grounds, the header and the footer flip to a solid
amber ring automatically.

`prefers-reduced-motion` collapses every transition and animation to 0.01ms.
`prefers-reduced-transparency` drops the grain. A print stylesheet strips the substrate,
the header and the buttons.

---

## 25 · Ship checklist

Ship only when every line is true.

1. `border-radius` appears zero times above 2px. Grep for it.
2. Every `box-shadow` has a `0` blur, or is an `inset` hairline. No `filter: blur()`, no
   `backdrop-filter`, no radial-gradient blobs.
3. Amber appears **five times or fewer** on the page. Count them by hand.
4. Amber never carries text on paper.
5. No two adjacent sections use the same ground or the same column span.
6. At least two sections start at column 3 or later.
7. Every `<svg>` is inline, hand-authored, `stroke-linecap: butt`.
8. The only network requests are the two `fonts.g*.com` origins. Block the font request and
   the page must still be fully readable and correctly composed in the fallback stack.
9. Nothing is centred except the statement band's *band* and the footer colophon.
10. Every figure uses tabular numerals.
11. No emoji anywhere, including alt text and labels.
12. No section contains three siblings with identical width and identical structure.
13. Copy audit: no "leverage", "seamless", "empower", "revolutionize", "unlock",
    "supercharge", "game-changing". Short sentences. Pricing stated exactly.
14. Works at 360, 768, 1024 and 1440. Nothing scrolls the body sideways.
15. Take a screenshot, blur it to 20px, and look at it. You should see an asymmetric
    composition of dark masses and empty paper — not a stack of equal grey rectangles. If it
    looks like a stack, the layout is wrong no matter how well the type is set.
