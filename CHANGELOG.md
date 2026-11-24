# Wylibrary Changelog

All notable changes to Wylibrary are documented in this file.
The format is based on Keep a Changelog.

---

## [v12.0] - 2026-11-25

### Added
- **JCE & MSCE Curriculum Level Selector**:
  - Filter entire library catalog (Home and Folder views) by education level: **All**, **JCE** (Forms 1 & 2), and **MSCE** (Forms 3 & 4).
  - Curriculum-aware classification engine detecting Forms 1 to 4, subject exclusivity (e.g. Additional Mathematics, Physical Science), and safe fallbacks.
  - Header navigation Level pill (`#levelBtn`) in row 2 with amber active state.
  - Accessible mobile bottom sheet modal (`#levelSheet`) with smooth backdrop scrim, touch gesture handle, and ESC key support.
  - Friendly level-empty state inside folders when no materials match the selected level, with a one-tap reset button.
  - Persistent level preferences across visits via `localStorage`.
- **Header Title Flip Micro-Interaction**:
  - Micro-interaction that rotates the header title to announce the active view (`🎓 MSCE view`, `📘 JCE view`, `📚 All levels`) without taking up any extra vertical space on mobile screens.
  - Built-in 45-second cooldown and 120px scroll threshold on scroll re-entry to keep the interface calm and avoid visual distraction.
- **Title Layout & Logo Preservation**:
  - Inserted zero-width word joiner (`\u2060`) after the hyphen in `Wycliffe's e-library` to guarantee clean two-line breaking on narrow mobile screens (360px to 384px) without awkward mid-word breaks.
  - Restored full 70px base logo on mobile viewports.
- **In-App Update & Guide**:
  - What's New in v12.0 swipeable guide card introducing the Level Selector.
  - Service Worker update toast announcing the new filter to returning students.

---

## [v11.8] - 2026-11-16

### Added
- **2026 MANEB Exam Drop**: Ingested latest 2026 MANEB past papers, mock exams, and complete ZIP package into catalog.
- **WhatsApp Student Community**: Connected official WhatsApp community invite links to About and Contact pages.

### Changed
- **Live Stats Synchronization**: Synchronized live resource counts between the About page statistics card and footer statistics.
- **About Page Polish**: Restored consistent link-based social buttons and refined timeline animation styling.

---

## [v11.1] - 2026-11-13

### Added
- **Save for Offline (IndexedDB)**:
  - Save books, past papers, and notes directly to the device via `offline-store.js` and read them completely offline without mobile data.
  - Offline-capable PDF viewer with in-place opening.
- **Batch Download**: Multi-select checkboxes on files and folders with a "Download Selected" batch action.
- **Bookshelf Launch Splash**: Smooth launch bookshelf animation with reduced-motion support.
- **In-App "What's New" Guide**: 4-card swipeable onboarding guide introducing offline saving, batch downloads, and launch animations.
- **Offline Awareness System**: Amber offline pill showing saved document counts and antenna (📡) indicator badge on the logo.
- **Deep Linking**: Direct file deep-linking preserving hash navigation.
- **Hybrid Update Notifications**: Service worker update toast that automatically distinguishes between study material drops and feature releases.
- **Stable File IDs**: Generated persistent file IDs (`id-map.json`) to keep student offline saved copies intact across library renames.

---

## [v10.0] - 2026-11-08

### Added
- **Cloudflare Pages Migration**: Static edge hosting architecture with Cloudflare Pages and R2 storage.
- **Full Offline PWA Resilience**: Network-first Service Worker caching with complete offline fallback.
- **Manual Update Prompt**: Version handshake detecting new deployments with an update toast.
- **Offline Banner**: Sticky offline status alert for spotty connectivity.
- **Google Analytics 4**: Event tracking for document downloads, searches, quizzes, and PWA installs.
- **SEO & Social Sharing**: Open Graph tags, Twitter Card metadata, and schema.org JSON-LD structured data.
