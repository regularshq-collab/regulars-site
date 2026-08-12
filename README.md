# Regulars — marketing site

Static HTML/CSS/JS. No build step, no framework, no npm dependencies. Nine pages sharing one
stylesheet and one script.

## Status

| Thing | State |
| --- | --- |
| Booking link | **Live** → `https://calendly.com/regularshq/15-minute-meeting` |
| Contact email | **Live** → `regularshq@gmail.com` |
| Analytics | Vercel Web Analytics tag on every page (activate it in the Vercel dashboard) |
| Social preview | Title + description done; `og:image` / `og:url` need your domain |
| Sitemap | Not generated yet — needs your domain (see below) |
| Testimonials | Placeholders, clearly marked. Swap when you have real ones. |

## The one file you edit

`assets/site.js` holds both live values at the top:

```js
var BOOKING_URL = "https://calendly.com/regularshq/15-minute-meeting";
...
var CONTACT_EMAIL = "regularshq@gmail.com";
```

Change either one and the whole site follows — every "Book a Free Call" button on every page
reads from that constant. Never paste a URL into a page's HTML.

**If you ever rename the event in Calendly**, its URL changes and the old one stops working.
Update `BOOKING_URL` here at the same time and redeploy.

## When you have a domain

One command wires up everything that needs an absolute URL:

```bash
node set-domain.js your-domain.com
```

That writes `sitemap.xml`, adds the `Sitemap:` line to `robots.txt`, stamps `og:url` and
`og:image` into all pages, and upgrades the Twitter card to `summary_large_image`. Safe to
re-run if you change domains.

Then add an **`og.png` (1200×630)** to the project root, or the social card shows a broken
image. That is the one asset still missing.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, problem, three pillars, how it works, calculator, pricing, proof, CTA |
| `capture.html` | Pillar 1: missed-call text-back and booking |
| `reviewping.html` | Pillar 2: automated review requests |
| `comeback.html` | Pillar 3: reactivation and follow-up email campaigns |
| `pricing.html` | $500 + $297/mo, what's included, what isn't, 10-question FAQ |
| `industries.html` | Per-trade breakdown (HVAC, dental, auto, salon, med spa, home services) |
| `contact.html` | Book a call + working contact form |
| `privacy.html` | Privacy policy |
| `404.html` | Not found |
| `assets/styles.css` | The entire stylesheet (~2,000 lines) |
| `assets/site.js` | All shared behaviour |
| `DESIGN-SYSTEM.md` | Every reusable class, the design laws, and a ship checklist |
| `set-domain.js` | One-time domain setup (above) |

## What `site.js` does

Booking-link rewriting · mobile nav (Escape to close, focus handling) · active nav state from
the URL · "The System" dropdown with full keyboard support · FAQ accordions · scroll reveals
(auto-disabled under `prefers-reduced-motion`) · footer year · the revenue calculator · contact
form validation. Every feature is guarded, so a page missing a component never throws.

## The contact form

It **posts nowhere**. Validation runs client-side, then it composes a `mailto:` and opens the
visitor's own email app. That is honest and needs no backend, but it does lose people who
don't have mail configured.

To make it a real submitting form: give the `<form>` an `action` pointing at a form service
(Formspree, Basin, Vercel Forms) and delete the `initContactForm()` submit handler in
`site.js` so it stops calling `preventDefault()`. There's an HTML comment in `contact.html`
marking the exact spot.

## The calculator

It multiplies numbers the visitor types in themselves, with the close-rate defaulted to a
deliberately low 25%. It is labelled on-page as an estimate from their own inputs, not a
promise. Keep it conservative — an inflated calculator is the fastest way to lose a skeptical
owner-operator.

## The statistics

Every stat is a conservative range framed as a **general industry benchmark**, with a
disclaimer on the page. None of them claim to be results Regulars has produced. If you swap in
different figures, keep a source and keep the framing.

## Editing the header or footer

No build step, so header and footer are duplicated in all nine files. If you change one,
change all nine or the nav will drift. They are currently byte-identical — worth keeping that
true.

## Local preview

Root-relative paths (`/assets/styles.css`) mean `file://` won't load the CSS. Serve it:

```bash
npx serve C:\Users\RUEGERT28\regulars-site
```

## Deploying

```bash
npx vercel --prod
```

`vercel.json` already sets asset caching and security headers. Vercel serves `404.html`
automatically for unknown paths.
