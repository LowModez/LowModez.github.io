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
- **JavaScript is minimal by design, and never decides how things look.** The
  animation is CSS: keyframes, `@property`-registered gradient angles,
  `clip-path` reveals, masked conic-gradient borders, and scroll-driven
  timelines. Where an effect needs the pointer's position, which CSS cannot
  read, a script writes coordinates into custom properties and nothing else.
  No script sets a color, a size, or a transform.
- **Progressive enhancement throughout.** Eleven `@supports` blocks guard the
  newer CSS features, the reveal animations only hide content after a script
  confirms it can run, and every pointer-driven property has a neutral CSS
  default. With JavaScript disabled the site is fully readable and still
  animated.
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
├── 404.html                    Custom not-found page
├── README.md
├── .gitignore
│
├── css/                        One concern per file, see css/README.md
│   ├── README.md               Load order and where things belong
│   ├── tokens.css              Custom properties only
│   ├── base.css                Reset, base elements, page background
│   ├── layout.css              Containers, section rhythm, footer
│   ├── utilities.css           Small single-purpose helpers
│   ├── components.css          Buttons, cards, tags, accent modifiers
│   ├── header.css              Header, navigation, mobile menu
│   ├── home.css                Home page sections
│   ├── page.css                Projects index and 404 page
│   ├── case-study.css          Project case study pages
│   ├── animations.css          Every keyframe and motion rule
│   └── responsive.css          Media queries and reduced motion
│
├── js/                         One behavior per file
│   ├── footer-year.js          Keeps the copyright year current
│   ├── mobile-nav.js           Narrow-screen navigation menu
│   ├── scroll-reveal.js        Fades sections in on scroll
│   ├── card-pointer.js         Card glow and tilt follow the cursor
│   ├── cursor-glow.js          Page-wide glow follows the cursor
│   └── main.js                 Entry point, calls the above
│
├── assets/
│   ├── images/                 Screenshots and the social preview image
│   ├── icons/                  Favicons
│   └── documents/              Resume
│
└── projects/
    ├── index.html              Projects index
    ├── heartfire.html          Case study: C++ dungeon crawler
    └── home-lab.html           Case study: virtualization lab
```

### How the files fit together

The CSS is split by responsibility and loaded with separate `<link>` tags in a
fixed cascade order, documented in [css/README.md](css/README.md). Tokens come
first, then the rules that consume them, then motion, then responsive
overrides. Each page loads only the section files it needs.

The JavaScript follows the same idea: each file defines exactly one function
and runs nothing. `main.js` is the only file that calls anything, so there is a
single place to see what a page does on load. Plain `<script>` tags rather than
ES modules, so the site still works when `index.html` is opened directly from
disk.

---

## License

The code in this repository may be read and learned from freely. The written
content, project descriptions, and images are mine and are not intended for
reuse in someone else's portfolio.
