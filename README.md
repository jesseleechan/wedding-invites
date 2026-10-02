# Wedding invites

Next.js + GSAP recreation of the Canva site
<https://glowuponline.my.canva.site/green-wedding-invitation>, rebuilt with flexbox
instead of Canva's absolute positioning.

```bash
npm run dev   # http://localhost:3000 → redirects to /green-wedding-invitation
```

## Routes

| Route | What it is |
| --- | --- |
| `/<slug>` | Envelope screen ("Press to Open") |
| `/<slug>/home` | The invitation (hero, welcome, weekend, dress code, a few words, RSVP) |

## Designs

| Slug | Look |
| --- | --- |
| `green-wedding-invitation` | The original Canva recreation |
| `midnight-gala` | Navy & gold art deco, animated night sky |
| `blush-garden` | Rose & sage garden, lace edges, falling petals, wreath |
| `desert-sun` | Terracotta boho, sunset over mesas, self-drawing line art |

`/` is a gallery linking to all of them.

## Concepts

Concepts reuse an invite's content but have their own components, layout and
motion, so they aren't limited to the themed layout above.

| Slug | Concept | Lives in |
| --- | --- | --- |
| `the-trail` | Evergreen as a field-guide hike: kraft mailer → flip → peel sticker → open flap → unfold trail map → zoom into the X; then a national-park poster and a scroll-drawn trail with a walking hiker past six journal-page stops (calendar, elevation profile, pack list, trail-register RSVP) | `src/concepts/trail/` |

Content is in `src/invites/trail.ts` (`TrailInvite` type). The trail path is
measured from the stop markers at runtime, so it follows the flex layout at any
screen size.

## Making a variation

Each invite is one config file in `src/invites/` (copy, theme colours and a
`design` block). Register new ones in `src/invites/index.ts`.

The `design` block mixes and matches building blocks:

| Option | Choices | Lives in |
| --- | --- | --- |
| `backdrop` | photo, or `night` / `garden` / `desert` SVG scene | `components/scenes.tsx` |
| `card` | `ticket` (Canva PNG), `deco`, `lace`, `sunset` | `components/variants.tsx` |
| `divider` | `torn`, `deco`, `scallop`, `dunes` | `components/variants.tsx` |
| `dateShape` / `swatchShape` | `circle`, `ring`, `arch` / `circle`, `diamond`, `arch` | CSS |
| `photoFrame` | `polaroid`, `deco`, `arch` | `components/variants.tsx` |
| `weekendArt` | `mountain`, `wreath`, `desert` | `components/variants.tsx` |
| `weekendLayout` / `wordsLayout` | `split`, `reverse` (mirrored) | CSS |
| `fonts` | any font variable from `app/layout.tsx` | |
| `envelopeTint` / `sealTint` | recolour the envelope / wax seal, texture kept | |
| `sketchFilter` | CSS filter that recolours the pencil sketches | |

## Layout notes

- Sizes are written in design pixels from the 1366px Canva canvas:
  `calc(var(--u) * 24)`. `--u` tracks viewport width on desktop and is clamped
  on tablet/phone, where the two-column sections stack.
- The hero card and envelope use container query units so they scale as one
  piece on small screens.
- Absolute positioning is only used for full-bleed backgrounds, torn-paper
  edges and the inside of the polaroid graphic.
- Animations live in `src/components/Invitation.tsx` (`useInvitationMotion`) and
  `src/components/EnvelopeScreen.tsx`. They respect `prefers-reduced-motion`.
  In dev, add `?fast` to a URL to speed every animation up 20×.

## RSVP

`src/components/RsvpForm.tsx` matches the Canva form visually but doesn't send
data anywhere yet. Hook its `onSubmit` up to an API route or form service.

## Source assets

`canva-source/` (git-ignored) holds the raw download from Canva: every media file,
font and `design.json` (the full Canva document, including hidden draft pages).
