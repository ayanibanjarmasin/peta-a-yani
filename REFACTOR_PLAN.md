# REFACTOR PLAN — V17 → Modular Architecture

> Status: **deferred**. Current `index.html` is a single 124KB file, which is **deployable on Vercel as-is** (static). Refactor to modules is optional, untuk DX yang lebih enak & git diff yang manageable.

## Why this isn't urgent

- `index.html` works in production today
- Vercel serves static files natively, no build step needed
- Single-file deployment is actually an advantage for hot-reload / simple rollback
- Refactor cost: ~1-2 hari. Benefit: easier maintenance, better collab

## When you actually need this

- Hire developer kedua → dia akan buta baca 1700 line monolith
- Pinjaman ke tim design / frontend lain untuk extend
- Mulai banyak bug yang susah dilokalisir karena semuanya di satu file

## Proposed structure (ES modules, no framework)

```
ayani-proper/
├── index.html                       # entry, body, head
├── manifest.webmanifest
├── sw.js
├── vercel.json
├── assets/
│   └── icons/...
├── css/
│   ├── variables.css               # :root, color tokens, dark mode
│   ├── base.css                    # reset, body, scrollbar
│   ├── topbar.css                  # topbar, toolbar
│   ├── sidebar.css                 # sidebar, tabs, cat-items
│   ├── map.css                     # map, pins, zoom, stats
│   ├── modals.css                  # form, login, settings, lightbox
│   ├── forms.css                   # inputs, fields, photo-grid
│   ├── animations.css              # pulse, spin, bounce
│   └── responsive.css              # @media queries
├── js/
│   ├── main.js                     # entry, DOMContentLoaded
│   ├── config.js                   # DEFAULT_API, LS_KEY, CAT_COLORS
│   ├── state.js                    # state object + observer pattern
│   ├── storage.js                  # loadFromLocal, saveToLocal
│   ├── api.js                      # apiAdd, apiUpdate, apiDelete, apiLogin, apiUploadPhoto
│   ├── map.js                      # initMap, renderMap (canvas + cluster)
│   ├── sidebar.js                  # renderSidebar, renderEmptyList
│   ├── filters.js                  # applyFilter, getCategories, getAllKota
│   ├── pins.js                     # CRUD pins, savePin, deletePin
│   ├── modals.js                   # form, login, settings, lightbox
│   ├── photos.js                   # photo grid, upload, lightbox
│   ├── session.js                  # login/logout/auth
│   ├── location.js                 # GPS, user marker
│   ├── settings.js                 # openSettings, saveSettings, export/import
│   ├── perf.js                     # debounce, throttle, raf-batch
│   └── ui.js                       # showToast, escape, dark mode
└── shared/
    └── eventbus.js                 # tiny pub/sub for cross-module events
```

## Conversion strategy

1. **Phase 1: extract CSS** (low risk, high readability win)
   - Split `<style>` block into the 9 CSS files above
   - Use `<link rel="stylesheet" href="/css/...">` to import
   - Verify no visual regression
   
2. **Phase 2: extract config + state + storage** (low risk)
   - `js/config.js` — all constants
   - `js/state.js` — the `state` object + small `state.on(key, cb)` observer
   - `js/storage.js` — load/save functions, isolated from app logic
   
3. **Phase 3: extract API layer** (low risk)
   - `js/api.js` — all `apiAdd/apiUpdate/...` functions
   - Replace globals with `import { apiAdd } from './api.js'`
   
4. **Phase 4: extract map rendering** (medium risk, biggest win)
   - `js/map.js` — `initMap`, `renderMap` (the perf-tuned version we already have)
   - Pass `state` via import
   
5. **Phase 5: extract sidebar + filters + modals** (medium risk)
   - Each module gets its own file
   - Use `eventbus` for cross-module communication
   
6. **Phase 6: replace inline `onclick`** (polish)
   - Use event delegation in modules
   - Add `data-action="add-pin"` etc. attributes

## Tradeoffs

| Aspect | Single file (current) | Modular (after refactor) |
|--------|----------------------|--------------------------|
| Cold deploy | 1 file to copy | 30+ files, but Vercel handles it |
| Git diff | Hard to read for big changes | Per-module diffs are clean |
| First paint | Slightly faster (no extra requests) | 30ms slower (HTTP/2 multiplex helps) |
| Code navigation | Cmd+F across 1700 lines | Module-scoped, IDE-friendly |
| Onboarding | New dev reads 1700 lines | New dev reads README + 1 file at a time |
| Build step | None | Still none (native ES modules) |
| Risk | - | Refactor could break edge cases (need thorough QA) |

## Recommendation

**Don't do this refactor in one big bang.** Instead:
1. Make small surgical extractions per PR
2. After each extraction, test in production
3. Wait until the next big feature (e.g. multi-branch) to do the full split

The current `index.html` is **already "proper enough"** for an internal tool. The bigger leverage right now is:
- ✅ Get it on Vercel (1 click deploy)
- ✅ Pin scroll performance (already patched, ~10-50x faster)
- ✅ PWA install (offline + add to home screen)
- ⏳ Refactor — when you have time, or when the next dev joins
