# Portfolio — John Vincent Pangilinan

A static site: four HTML pages, one stylesheet, one small script. No build step
and no framework, so it runs on any host.

```
index.html                 Home: hero, work, about, tech stack, experience, contact
work/jar-garments.html     Case study 01
work/codelearn.html        Case study 02
work/trimex-library.html   Case study 03
assets/css/main.css        Design tokens (colour, type, grid) at the top, then components
assets/js/main.js          Theme switch, menu, scroll reveals, copy-email, clock, grid overlay
assets/img/                Responsive WebP images (800 / 1200 / 1600 / 2400 wide)
assets/files/              The résumé PDF
tools/make-images.sh       Turns a screenshot into the WebP sizes the pages use
```

Preview under XAMPP at <http://localhost/WebApp%203/portfolio/>, or from this
folder run `python3 -m http.server 8080` and open <http://localhost:8080>.

**Asking an AI to change something?** Give it `Portfolio-Maintenance-Guide.pdf`
(it sits next to this folder in the zip) together with this folder. The guide
has the design rules, the facts and step-by-step recipes, plus a prompt you
can paste.

## Tech stack logos

Each tile in the Tech stack section (`index.html`, section 03) is a
single-colour logo used as a CSS mask. It shows in grey at rest and in the
technology's own colour on hover (or on tap, on phones):

```html
<li class="tech" style="--logo: url(https://cdn.jsdelivr.net/npm/simple-icons@14/icons/php.svg); --brand: #777bb4">
```

To add a technology, copy a tile and change the logo URL, the name and
`--brand`. Logos come from [Simple Icons](https://simpleicons.org), where each
icon's page lists its slug and brand colour. VS Code and MySQL come from
[Devicon](https://devicon.dev). Add `--brand-dark` when the brand colour is too
dark to see on the dark theme, as the GitHub tile does.

## Still to fill in

Everything that still needs you is marked. Search the HTML for `TODO(john)`
and `[00]`.

- **`TODO(john):` notes** (eight, with a yellow tag) in the case studies: how
  things worked before JAR Garments and the library system, a short ERD note
  for each of those two, and your team size, responsibilities and evaluation
  results for CodeLearn. Delete each note once you've filled it in.
- **Results**: the `[00]` figures in section 06 of the JAR Garments and
  Trimex Library case studies. Use real numbers, or replace them with a line
  from the client.

### Placeholder images

Eight figures are labeled placeholders until you add screenshots or diagrams:

| Page | Files in `assets/img/work/…` |
| --- | --- |
| JAR Garments | `jar-garments/schema` (your ERD), `checkout`, `analytics` |
| CodeLearn | `codelearn/lesson`, `quiz`, `runner` |
| Trimex Library | `trimex-library/schema` (your ERD), `rfid`, `analytics` |

Capture at 1600 × 1000 (16:10) or larger, then run:

```sh
tools/make-images.sh ~/Desktop/checkout.png assets/img/work/jar-garments/checkout
```

The same filenames are overwritten, so the HTML keeps working. After that,
remove "(placeholder)" from that image's `alt` text. If an image isn't 16:10,
also update the `width` and `height` attributes on its `<img>`.

## Please confirm

- **Read-aloud (text-to-speech)** in CodeLearn's Build section. Your old site
  lists it, but this version of the code doesn't include it.
- "I'll reply within a day", and the work locations in Contact.

## Before you publish

- **Your CV PDF** shows your street address and phone number. Consider
  removing the street address from the public copy. It also still has
  template text: "City, State", "Month Year – Month Year" and
  "[Note: Optional]".
- **Canonical and social-preview URLs** point to
  `portfolio-five-plum-34.vercel.app`. If you deploy elsewhere, update them in
  the `<head>` of each page.
- **Deploy** by uploading this folder to Vercel or Netlify as a static site.
  No build command is needed.

## Design notes

The look is a developer's: a terminal in the hero, `~/path` section headers,
GitHub-style project cards, a git log for experience and an editor status bar
as the footer.

- **Palette**: dark first, with a full light theme. One accent, terminal green
  (`#1a7f37` on light, `#3fb950` on dark), defined with the other tokens at the
  top of `main.css`. All text passes WCAG AA (the accent is 4.6:1 on light and
  7.3:1 on dark). Syntax colours appear only inside code, and the technology
  colours only when you hover a Tech stack tile.
- **Typography**: JetBrains Mono for headings, labels, navigation and code;
  Geist for paragraphs. Both are free (SIL OFL) and load from Google Fonts.
- **Grid**: 4 / 8 / 12 columns. The "grid" button in the status bar shows it.
- **Theme**: the site follows the OS setting until someone picks light or
  dark, and that choice is remembered. Picking the OS's own theme goes back to
  following the OS.
# Portfoliowebsite
