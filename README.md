# Tiru Builds Portfolio

Responsive personal portfolio in plain HTML, CSS and JavaScript. No framework, no build step, no server.

## Run locally

Open `index.html` in a browser, or for a more reliable preview:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Structure

```
tiru-builds-portfolio/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── img/
    │   ├── tiru-portrait.webp      900×1125 hero portrait
    │   ├── tiru-portrait-sm.webp   450×562 (mobile)
    │   ├── tiru-portrait.jpg       fallback
    │   └── og-card.jpg             1200×630 share card
    └── icons/
        ├── favicon.svg / .ico / favicon-32.png
        ├── apple-touch-icon.png
        └── icon-192.png
```

## What's new

- **Hero portrait** replaces the CSS sculpture. Orbits, coordinates (17°00' N 81°47' E) and FIG. 01 caption are kept. Tilts gently with the pointer on desktop.
- **Light / dark toggle** in the header. First visit follows the OS setting, then your choice is remembered (`localStorage` key `tb-theme`). No flash on load.
- Dark mode is a warm charcoal version of the same terracotta + sage palette, driven by CSS variables.
- Favicons, share-card image, and a `<noscript>` fallback so content shows without JavaScript.

## Before publishing

- Replace `assets/img/tiru-portrait.*` any time: keep the 4:5 ratio.
- For link previews, make the `og:image` URL absolute, e.g. `https://yourdomain.com/assets/img/og-card.jpg`.
- Verify every project demo and repository URL.
- Replace the CSS mock project visuals with real screenshots when you have them.
- Confirm the Instagram and LinkedIn URLs.
