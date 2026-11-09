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

4. **Document Naming, Metadata & Ingestion Workflow**
   - **Fix existing filenames:** Clean up vague, truncated, and inconsistent names across Books, Exams, and Q&A. Many files currently have raw upload names that give users no hint of what's inside.
   - **Establish a naming convention:** Agree on a standard pattern before uploading new files, for example:
     ```
     [Category]_[Subject]_[Level]_[Year]_[Description].pdf
     Exams_Mathematics_MSCE_2024_Paper1.pdf
     Books_Biology_JCE_MaladeSyllabus.pdf
     ```
   - **Re-organize misclassified files** into correct subject/level directories.
   - **Automate new resource ingestion:** When adding new materials, automate as much of the pipeline as possible:
     - Script to validate filenames against the naming convention before upload.
     - Auto-generate / update `files-index.json` entries (description, category, path, ID) on upload rather than editing JSON manually.
     - Community submission workflow: WhatsApp group members submit files → ingestion script renames, places, and indexes them → they appear in the library automatically.

5. **Batch Multi-Select & Share / Download Function**
   - Allow selecting multiple files (checkboxes / multi-select mode).
   - Share multiple selected document links or files simultaneously via Web Share API / WhatsApp.
   - **Save Selected Folder(s) Offline:** Allow selecting folder checkboxes in the main library to batch-save all files within a folder to offline storage with 1 tap (including total download size preview & confirmation).
   - **Remove Selected** (saved books page): add a "Remove Selected" button next to "Download Selected" for bulk-deleting saved books. Suggested by Claude alongside the checkboxes feature (Nov 2026).
   - **Multi-Download Fallback (Client-side ZIP):** Many mobile browsers block multiple simultaneous file downloads. Detect this restriction or provide an option to package selected files into a single `.zip` file client-side (using JSZip) for 1-click batch download.

6. **Smart In-App Deep-Link Sharing (Navigate, Auto-Focus & Highlight)**
   - Instead of sharing a raw download URL that isolates the file from the platform:
   - Share an in-app deep-link (e.g., `https://wylibrary.org/#/folder/Books/Physics?file=Excel_Phy.pdf` or `?id=file_id`).
   - When opened by a peer, the link lands them directly inside Wylibrary at the exact folder location, auto-scrolls to the target card, and draws attention with a subtle pulse/glow animation (and/or checks its box).
   - **Value:** Introduces students to the full library and surrounding past papers, letting them choose whether to Open, Download, or Save Offline with 1 tap.

---

## 🔧 PWA & Cache Architecture (Planned Improvements)

### 5. "Save for Offline" Button per Document
- Add a **"📥 Save for Offline"** button next to each PDF in the file list.
- Stores the PDF in a **separate cache bucket** (`wylibrary-user-documents`) that is never wiped during app updates.
- When offline, the Library tab switches to a **"My Saved Books"** view showing only saved documents.
- Documents not yet saved show a disabled state (`Needs Internet`) instead of broken links.

### 6. Offline UI State Refinements
- When offline, automatically highlight that **Practice Quiz** and **About** pages work fully.
- Disable/grey-out download buttons and links that require internet.
- Show count of saved offline documents in the offline banner.

### 7. Reading Progress & Bookmarks
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

### 10. Community, Resource Crowdsourcing & Developer Showcase
- **Wylibrary WhatsApp Community Group:**
  - Dedicated group for users, students, and teachers to support the project.
  - **Crowdsourcing Study Materials:** Let members submit exam papers, mock tests, syllabi, and textbooks for Wycliffe to index and add to the library.
  - **Feedback & Support Channel:** Report broken files, report bugs, ask study questions, and propose new features.
  - **Broader Community & Social Reach:** Connect the group with Wycliffe's personal Facebook presence/page to foster community engagement without managing fragmented separate brands.
- **Developer Branding & Portfolio Showcase:**
  - Showcase Wylibrary as a live demonstration of Wycliffe's full-stack & PWA development skills.
  - Include an elegant, non-intrusive credit/footer link ("Crafted by Wycliffe") linking to:
    - Personal Portfolio: [`WysPortfolio`](file:///home/wy/Projects/WysPortfolio)
    - Digital solutions & services: [`digihelp-site`](file:///home/wy/Projects/digihelp-site)
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

### 13. Multi-Language Support (Localization & Inclusion)
- **Language Selector:** Multi-language UI prioritizing **Chichewa** alongside English (addressing the common gap where local languages are overlooked by educational platforms), designed modularly so additional regional languages can be easily added.
- Localize navigation, buttons, offline alerts, search hints, and study guides.
- Save user language preference in `localStorage`.

### 14. AI Assistant for Site Help & Navigation
- **In-App AI Guide:** A lightweight assistant to help students find study materials, past papers, syllabus contents, and explain how to use library features (offline saving, search, practice quizzes).

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
