# Area Mapping — Bank Mandiri KCP A Yani

Networking & area mapping tool untuk Bank Mandiri KCP Ahmad Yani Banjarmasin.
CRUD pin lokasi, filter by kategori/produk/kota, integrasi Google Sheets (Apps Script) + Google Drive (photos).

## ✨ Features

- **Map** (Leaflet) dengan 800+ pin, real-time filtering, clustering, hover preview
- **Glassmorphic pin card** (modern info popup on click)
- **⌘K Command Palette** (search + 10 quick actions, keyboard nav)
- **Filter chips** horizontal scroll + active filter removal
- **Dark mode** (proper token-based, not a hack) with auto-swap map tiles (CartoDB Light ↔ Dark Matter)
- **Welcome onboarding tour** (5 steps with spotlight, first-time only)
- **PWA installable** (offline-first, custom manifest + service worker)
- **Mobile responsive** (FAB, bottom sheet, sidebar drawer)
- **Keyboard shortcuts** (press `?` for help, A/N/R/S/D/L/P/B/`,` for actions)
- **Offline-first** writes via pending queue (auto-syncs on reconnect)
- **Login** with session token persisted in localStorage
- **JSON/CSV export-import** for backup

## 🛠️ Tech Stack

- **Frontend:** Vanilla JS (no framework), HTML, CSS with custom design tokens
- **Map:** [Leaflet 1.9.4](https://leafletjs.com/) + [leaflet.markercluster 1.5.3](https://github.com/Leaflet/Leaflet.markercluster)
- **Backend:** Google Apps Script (Web App) + Google Sheets
- **Storage:** Google Drive (photos), localStorage (cache + pending queue)
- **Hosting:** Vercel (static, auto-deploy from this repo)

## 🚀 Deploy

This project is hosted on **Vercel** as a static site. Every push to `main` auto-deploys.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ayanibanjarmasin/peta-a-yani)

## 📁 Project Structure

```
.
├── index.html              Main app (single file, ~2900 lines)
├── manifest.webmanifest    PWA manifest
├── sw.js                   Service worker (offline cache)
├── vercel.json             Vercel config (static + cache headers)
├── .gitignore              Git ignore rules
├── README.md               This file
├── V17-original.html       Backup of pre-modernization V17
├── REFACTOR_PLAN.md        Roadmap for splitting monolith into modules
└── assets/
    └── icons/              Logo + PWA icons (transparent PNG)
```

## ⚙️ Configuration

Open the app → ⚙ Settings → set:
- **Apps Script Web App URL** (default provided)
- **Sheet Name** (default: `📝 Data Lengkap`)

To add new users, edit the sheet (columns Y = username, Z = password).

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Command palette |
| `?` | Show shortcuts help |
| `A` / `N` | Add new pin |
| `R` | Reload from server |
| `S` | Sync pending changes |
| `D` | Toggle dark mode |
| `L` | My location (GPS) |
| `P` | Click-to-add mode |
| `B` | Toggle sidebar rail |
| `,` | Settings |
| `ESC` | Close any overlay |

## 📜 License

Internal use only — Bank Mandiri KCP Ahmad Yani Banjarmasin.
