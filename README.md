# ChromeLandingPage

A lightweight Chrome-inspired landing page with a live clock, custom quick links, search shortcuts, and a weather widget.

## Features
- glassmorphism-style UI over a full-screen background image
- search using Google or Bing
- real-time date and time display
- quick-link dashboard with localStorage persistence
- add custom bookmarks from the page itself
- weather widget powered by Open-Meteo using the browser location when available

## Run locally
1. Open `index.html` in a browser, or
2. serve the folder locally with a simple static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files
- `index.html` — page structure
- `index.css` — styling and responsive layout
- `scrip.js` — logic for time, search, links, and weather
