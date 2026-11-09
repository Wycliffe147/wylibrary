# Wylibrary Roadmap & Task Backlog

*Last updated: 2026-11-09*

---

## ✅ Recently Completed

| Feature | Commit | Date |
|---|---|---|
| PWA install prompt fix (local icons, early listener, no cooldown) | `a28e9f8` | Nov 7 |
| GA4 analytics + event tracking (downloads, search, quiz, PWA) | `92de167` | Nov 7 |
| Favicon & SEO icons for Google Search | `8f0b1c9` | Nov 7 |
| Open Graph, Twitter Card, JSON-LD structured data | `b192605` | Nov 7 |
| **Network-First SW caching & full offline mode** | `fcb7909` | Nov 8 |
| **Manual "⚡ Update Available" button with version handshake** | `fcb7909` | Nov 8 |
| **Offline detection banner** (`📡 You are offline...`) | `fcb7909` | Nov 8 |
| Fix offline banner always showing + move update toast to top | `a7b22b6` | Nov 8 |
| **Staging branch & AGENTS.md** (test-before-deploy workflow) | `8e193de` | Nov 9 |

---

## 📌 Saved Tasks (User Backlog)

> These are tasks Wycliffe has identified. Tackle when he's ready.

1. **Practice Page Upgrade**
   - Refresh question sets, improve interactive UI/feedback, and expand subject coverage.

2. **Splash Screen Book-Opening / Page-Flip Animation**
   - Animated book pages closing / flipping to reveal the central logo upon launch.

3. **2026 & Recent Document Additions**
   - Ingest and index new past papers, mock exams, and syllabi from 2026 / recent school years.

4. **Directory & Metadata Cleanup**
   - Re-organize misclassified files into correct subject/level directories.
   - Fix missing, truncated, or misleading document filenames in `files-index.json`.

5. **Batch Multi-Select & Share / Download Function**
   - Allow selecting multiple files (checkboxes / multi-select mode).
   - Share multiple selected document links or files simultaneously via Web Share API / WhatsApp.
   - **Multi-Download Fallback (Client-side ZIP):** Many mobile browsers block multiple simultaneous file downloads. Detect this restriction or provide an option to package selected files into a single `.zip` file client-side (using JSZip) for 1-click batch download.

---

## 🔧 PWA & Cache Architecture (Planned Improvements)

### 6. "Save for Offline" Button per Document — ✅ BUILT (v11.0, on staging)
- **"📥 Save offline"** button on every file card (except ZIP packages). Saved files live in the separate cache bucket `wylibrary-user-documents`, which the service worker never wipes on updates.
- Files are stored under a **stable file id** (not the path), with details in IndexedDB (`wylibrary-offline`). `scripts/add-ids.mjs` assigns ids to `files-index.json` and keeps them across renames/moves; `public/id-map.json` is its history (**commit it**).
- When the library changes, saved copies are reconciled on the next online visit: renamed/moved → follows the file; replaced → "↻ Update saved copy"; deleted → kept, flagged "No longer in the library".
- **My Saved Books** page (`#/saved`, shortcut on Home when something is saved). The PDF viewer opens saved copies first, so they work with no connection.
- Offline, unsaved files show greyed-out Open/Download with a "Needs internet" explanation.
- Still to decide: auto-switching the Library to Saved Books when offline (currently a banner link + Home shortcut).

### 7. Offline UI State Refinements — partly done
- ✅ Disable/grey-out download buttons and links that require internet.
- ✅ Show count of saved offline documents in the offline banner (with a "View saved" link).
- ⬜ When offline, automatically highlight that **Practice Quiz** and **About** pages work fully.

### 8. Reading Progress & Bookmarks
- Automatically save the last page read per document in `localStorage`.
- When reopening a PDF, offer to resume: *"Continue from page 42?"*

---

## 🚀 Growth, UX & Feature Suggestions

### 8. Search & Discovery Upgrades
- **Faceted Filters:** Quick pill buttons for Level (*MSCE, JCE, Primary, Tertiary*), Subject (*Maths, Physics, Biology, History*), and Year (*2020–2026*).
- **Index Optimization:** As `files-index.json` grows past 600 KB, consider gzipping/brotli pre-compression or lightweight client-side MiniSearch/Fuse.js for instant, typo-tolerant search.

### 9. Examination & Practice Features
- **Timed Mock Exam Mode:** Countdown timer mimicking MANEB exam conditions.
- **Detailed Solution Explanations:** Step-by-step reasoning for wrong answers in `quiz-data.json`.
- **Streak & Performance Stats:** Simple offline statistics showing quiz accuracy and subjects practiced.

### 10. Community & Distribution (Organic Growth)
- **WhatsApp / Telegram Channel Link:** Header/footer link to a study group or channel for new document announcements.
- **Direct PWA "Install App" Menu Item:** Permanent "Install App" button in the nav so visitors who dismissed can install anytime.
- **PWA Share Target:** Allow sharing study materials with peers via Web Share API (`navigator.share`).

### 11. Google Search Console Reindex
- Submit `https://wylibrary.org` in [Google Search Console](https://search.google.com/search-console) → URL Inspection → "Request Indexing".
- Favicon/logo in search results takes **1–4 weeks** after reindex.

### 12. Delete Ghost `wylibrary.pages.dev +1` Web Analytics Entry
- Requires a Cloudflare API token with `Account → Web Analytics edit` permission:
  ```bash
  curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/c5703910f00b285b8660ec05372093f6/rum/site_info/d90d87f95aa946efb7e79aba6f2caed4" \
    -H "Authorization: Bearer <TOKEN_WITH_RUM_WRITE>"
  ```

---

## 🧪 Development Workflow Reminder

> [!IMPORTANT]
> **Always test on staging before deploying to production.**
> See [`AGENTS.md`](file:///home/wy/Projects/wylibrary/AGENTS.md) in the project root.

| Environment | URL | Branch |
|---|---|---|
| **Production** | `https://wylibrary.org` | `main` |
| **Staging** | `https://staging.wylibrary.pages.dev` | `staging` |

```bash
# Push to staging → test → merge to main
git checkout staging && git merge main && git push origin staging
# ... test at staging URL ...
git checkout main && git push origin main
```
