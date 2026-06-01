# Dr. De SouzAI - Thumbnail Architect

[![Version](https://img.shields.io/badge/version-1.2.2-purple)](manifest.json)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Manifest](https://img.shields.io/badge/manifest-v3-green)](manifest.json)
[![Tests](https://img.shields.io/badge/tests-Jest-red)](tests/)

> A Chrome & Microsoft Edge side-panel extension that generates high-impact YouTube thumbnail headlines using proven hook formulas with optional multi-language translation via self-hosted LibreTranslate. Fully client-side. No paid APIs required.

## Features

| Feature | Description |
|---|---|
| Hook Engine | 6 headline formula sets x 6 niches = 36+ scored templates |
| Engagement Scoring | Composite score (linguistic + emotional) per headline |
| Translation | Self-hosted LibreTranslate, community endpoints, offline mock |
| PNG Export | 1280x720 thumbnail placeholder with niche colour themes |
| JSON Export | Full headline + layout data export |
| Privacy-First | No external servers, API keys stored in browser only |
| Accessible | ARIA roles, keyboard tab navigation, focus management |
| XSS-Safe | All dynamic content via textContent, never innerHTML |

## Quick Start

**Chrome:** chrome://extensions/ > Developer mode > Load unpacked
**Edge:** edge://extensions/ > Developer mode > Load unpacked

```bash
npm install
npm test
node scripts/build-zip.js
```

## Translation Setup

**Option A - Offline Mock (default):** Works out of the box. Settings > Provider > Mock/Offline

**Option B - Self-Hosted LibreTranslate (recommended):**
```bash
docker compose -f docker/docker-compose.yml up -d
```
Settings > Provider: LibreTranslate, Endpoint: http://localhost:5000

**Option C - Community Endpoint:** Settings > Provider: LibreTranslate, Endpoint: https://translate.terraprint.co

> Warning: Community endpoints may be unreliable and rate-limited.

## Project Structure

```
dr-de-souzai-thumbnail-architect-refactor/
manifest.json, sidepanel.html, icons/
src/background.js, ui.js, engine.js, settings.js
src/skills/hook.js, hype.js, table.js, summary.js
src/adapters/index.js, mock-translation.js, provider-libretranslate.js, provider-template.js
tests/ (6 suites, 36+ tests)
docker/ (LibreTranslate self-hosting)
docs/ (privacy policy, publish guide, store listing)
scripts/build-zip.js
```

## Privacy & Security

- No data sent to our servers
- API keys stored in chrome.storage.local only
- All rendering via textContent (XSS-safe)
- No analytics, no tracking, no third-party scripts

See docs/PRIVACY-POLICY.md for the full privacy policy.

## License

MIT (c) 2026 Dr. De SouzAI
