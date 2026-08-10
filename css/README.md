# Stylesheet architecture

The CSS is split by responsibility, one concern per file. There is no build
step, so pages load the files they need directly with `<link>` tags.

## Load order

Order matters, because later files rely on and override earlier ones. Keep this
sequence in every page:

| # | File | Contains |
|---|---|---|
| 1 | `tokens.css` | Custom properties only. Colors, type scale, spacing, motion timings. No selectors. |
| 2 | `base.css` | Reset, base element styles, and the fixed page background layer. |
| 3 | `layout.css` | Containers, section rhythm, the footer. |
| 4 | `utilities.css` | Small single-purpose helpers: skip link, visually-hidden, eyebrow. |
| 5 | `components.css` | Reusable pieces: buttons, cards, tags, status pills, accent modifiers. |
| 6 | `header.css` | Site header, navigation, mobile menu. |
| 7 | *page file* | `home.css` on the home page, `case-study.css` under `/projects/`. |
| 8 | `animations.css` | Every keyframe and motion rule on the site. |
| 9 | `responsive.css` | Media queries and the reduced-motion block. Last, so it wins. |

`animations.css` sits second to last on purpose: it layers motion onto
components that are already fully styled, so a motion rule never has to fight
for specificity.

`responsive.css` is last so its breakpoint and reduced-motion rules override
everything above them without needing `!important`.

### Why separate `<link>` tags instead of `@import`

`@import` makes the browser discover each file only after the previous one has
downloaded, producing a chain of round trips that delays rendering. Separate
`<link>` tags are all discovered in the initial HTML parse and fetched in
parallel.

The trade-off is that adding a stylesheet means editing every page's `<head>`.
With five pages and no build step, that is the cheaper problem.

## Where things belong

- **A new color, size, or spacing value** goes in `tokens.css`, never inline in
  a rule. If a rule needs a value that is not a token, add the token first.
- **A new reusable piece** goes in `components.css` and gets a class, not a
  bare element selector.
- **Anything that moves** goes in `animations.css`, including its keyframes,
  and gets a matching entry in the reduced-motion block in `responsive.css`.
  That second half is not optional: an animation without a reduced-motion
  entry is an unfinished animation.
- **Anything specific to one page** goes in that page's file.

## The accent system

Components never reference an accent color directly. They use three variables:

```css
--group        /* the accent itself, for text and markers  */
--group-dim    /* 35% alpha, for borders                   */
--group-soft   /* 9% alpha, for tinted backgrounds         */
```

`tokens.css` defaults all three to amber. A modifier class overrides them for
its own subtree:

```css
.accent-teal   /* systems and networking      */
.accent-violet /* physical infrastructure     */
.accent-blue   /* education                   */
.accent-rose   /* contact                     */
.accent-amber  /* explicit reset back to amber */
.accent-neutral/* deliberately quiet          */
```

Adding one of these to a section or card recolors its label, heading rule,
borders, hover states, status pill, category dot, and every tag inside it. No
component needs a color variant of its own.

A card inside a section inherits that section's accent unless it sets its own.
That is why cards that should stay amber inside a colored section carry
`.accent-amber` explicitly.

## How motion is organized

`animations.css` is grouped so a given effect is findable without reading the
whole file:

| Group | Contains |
|---|---|
| A0 | `@property` registrations, which make gradient angles animatable |
| A | Every `@keyframes`, defined once and reused below |
| B | Page load: header, nav, hero, case study headers |
| C | Reveal on scroll, including tag and list cascades |
| D | Hover and interaction basics |
| E | Continuous ambient motion |
| F | Scroll-driven progress bar |
| G | Glow on hover |
| H | Pointer spotlight |
| H2 | Travelling border light |
| H3 | Three-dimensional tilt |
| H4 | Page-wide cursor glow |
| H5 | Clip-path wipe reveals |
| H6 | Button ripple |
| H7 | Animated progress bar gradient |
| H8 | Hero parallax on scroll |
| I | Text effects |
| J | Ambient background layers |
| K | Media and figures |
| L | Micro-interactions |

### Progressive enhancement

Eleven `@supports` blocks guard the techniques that are not yet universal:
`mask-composite`, `background-clip: text`, and scroll-driven
`animation-timeline`. Each is written so that a browser without the feature
shows the plain version rather than a broken one.

The `background-clip: text` guard is the one to be careful with. That technique
needs `color: transparent`, so without the guard the hero name would be
invisible rather than merely unanimated.

### What JavaScript is allowed to do

Three effects need the pointer's position, which CSS cannot read. The scripts
that supply it write nothing but coordinates:

| File | Writes | Read by |
|---|---|---|
| `card-pointer.js` | `--mx`, `--my`, `--rx`, `--ry` | Card spotlight and tilt |
| `cursor-glow.js` | `--cursor-x`, `--cursor-y` | The page-wide glow |

No script sets a color, a size, an opacity, or a transform. Every visual
decision stays in this folder. All of them exit early under reduced motion and
on devices without a hovering pointer, and every property they write has a
neutral default declared in CSS, so a script that never loads costs nothing.

## Adding a category color

1. Add `--accent-N`, `--accent-N-dim`, and `--accent-N-soft` to `tokens.css`.
2. Add a matching `.accent-name` modifier to `components.css`.
3. Check the contrast of the new color against `--bg-primary`, `--bg-surface`,
   and `--bg-surface-raised`. It must reach 4.5:1 on all three, since accents
   are used as label text rather than decoration.

No other file needs to change.
