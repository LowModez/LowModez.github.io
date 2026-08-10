# Ethan McKinzie Portfolio

Source for my personal portfolio site, published with GitHub Pages at
**[lowmodez.github.io](https://lowmodez.github.io)**.

---

## About

A portfolio covering my move from Information Technology into Computer Science
and software development. It presents my projects, technical skills, and
education, with individual case-study pages for the larger projects.

I'm currently pursuing a **B.S. in Computer Science with an Artificial
Intelligence concentration** at Full Sail University, following a completed
**A.S. in Information Technology**.

---

## Technologies

| | |
|---|---|
| **Markup** | HTML5, semantic elements throughout |
| **Styling** | CSS3 with custom properties, Flexbox, and Grid |
| **Scripting** | Vanilla JavaScript, no libraries |
| **Hosting** | GitHub Pages |

No frameworks, no build step, no package manager, and no dependencies. The
site is static files served exactly as they are committed.

That is a deliberate choice for a first portfolio: it demonstrates the
underlying fundamentals rather than a tool's defaults, it loads quickly, and
there is no build pipeline to break between now and whenever someone opens it.

### Notes on the implementation

- **Design tokens.** Every color, font size, and spacing value is a CSS custom
  property declared in `:root`. No hardcoded colors are scattered through the
  stylesheet.
- **Category accents.** Components reference `--group` / `--group-dim` /
  `--group-soft` rather than fixed colors, so a single modifier class
  (`.accent-teal`, `.accent-violet`) recolors a card's accent line, borders,
  labels, and tag hovers at once.
- **Responsive without breakpoint sprawl.** Type scales with `clamp()` and
  grids use `repeat(auto-fit, minmax(...))`, so most of the layout adapts on
  its own. Media queries handle only genuine layout changes, such as
  collapsing the navigation.
- **JavaScript is minimal by design.** Three small functions: the footer year,
  the mobile navigation menu, and a scroll reveal built on
  `IntersectionObserver`. Anything CSS can do, CSS does.
- **Accessibility.** Semantic landmarks, one `h1` per page with no skipped
  heading levels, a skip link, visible focus states, alt text on every image,
  and `prefers-reduced-motion` support. Text colors were checked against their
  backgrounds and all clear WCAG AA.
- **Progressive enhancement.** The CSS that hides elements before they animate
  in is scoped to a class that JavaScript adds only after confirming it can
  run. With JavaScript disabled, nothing is hidden and the page is simply static.

---

## Local development

No install step and no server required.

```bash
git clone https://github.com/LowModez/LowModez.github.io.git
cd LowModez.github.io
```

Then open `index.html` in a browser.

A local server is optional, and only useful for testing root-relative paths:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

---

## Project structure

```text
LowModez.github.io/
├── index.html                  Single-page main site
├── README.md
├── .gitignore
│
├── css/
│   └── styles.css              All styles, in 16 numbered sections
│
├── js/
│   └── main.js                 Footer year, mobile nav, scroll reveal
│
├── assets/
│   ├── images/                 Screenshots and the social preview image
│   ├── icons/                  Favicons
│   └── documents/              Resume
│
└── projects/
    ├── heartfire.html          Case study: C++ dungeon crawler
    └── home-lab.html           Case study: virtualization lab
```

`css/styles.css` opens with a numbered table of contents matching the order the
page is built, from design tokens through to responsive rules.

---

## License

The code in this repository may be read and learned from freely. The written
content, project descriptions, and images are mine and are not intended for
reuse in someone else's portfolio.
