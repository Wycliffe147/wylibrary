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
| **Clean 477 file display names** (Task 4 Phase 1) | `4573e9a` | Nov 13 |
| **Hybrid update notification system** (materials vs features vs custom) | `c7929d4` | Nov 13 |
| **Save for Offline (IndexedDB), Batch Downloads & Bookshelf Splash (v11.1)** | `2e7cc0a` | Nov 13 |
| **2026 MANEB exam papers and full ZIP package drop** | `5683108` | Nov 16 |
| **WhatsApp student community integration** | `24383d3` | Nov 16 |
| **Live academic resource count synchronization (v11.8)** | `aa97b99` | Nov 16 |
| **JCE & MSCE Curriculum Level Selector & Title Flip (v12.0)** | `db52eda` | Nov 25 |

---

## 📌 Saved Tasks (User Backlog)

> These are tasks Wycliffe has identified. Tackle when he's ready.

1. **Practice Page Upgrade**
   - Refresh question sets, improve interactive UI/feedback, and expand subject coverage.

2. **Splash Screen Book-Opening / Page-Flip Animation**
   - Animated book pages closing / flipping to reveal the central logo upon launch.

3. **2026 & Recent Document Additions**
   - Ingest and index new past papers, mock exams, and syllabi from 2026 / recent school years.

4. **Document Naming, Metadata & Ingestion Workflow (Folder-by-Folder)**
   - **Goal:** Go through every folder one at a time (starting with `Books/`), clean file names, verify JCE/MSCE classification accuracy, fix duplicates, and document conventions. Each folder is a learning step toward building a smart ingestion script.
   - **Progress so far:**
     - ✅ `Books/Additional Mathematics` (commit `2c901cb`, Nov 13)
     - ✅ `Books/Agriculture` (deep audit complete: 71 clean books with 100% level tagging, 9 mock exams transferred to Exams/, 4 duplicates deleted from R2)
     - ✅ `Books/Bible Knowledge` (merged casing duplicate, moved 5 mock exams to Exams/, deleted 4 sermons/duplicates, 24 clean books)
     - ✅ `Books/Biology` (deep audit complete: 112 clean books with 100% level tagging, 44 mock exams moved to Exams/, 15 Q&A moved to Q&A, 2 syllabuses moved to Syllabuses, 30 deleted)
     - ✅ `Books/Business Studies` (deep audit complete: 2 mock exams moved to Exams/, 5 syllabuses moved to Syllabuses)
     - ✅ `Books/Chemistry` (deep audit complete: 44 clean books with 100% level tagging, 18 exams moved to Exams/, 3 Q&A moved to Q&A/, 1 syllabus moved to Syllabuses/, 14 deleted)
     - ✅ `Books/Chichewa` (deep audit complete: 24 clean books with 100% level tagging, 21 mock exams moved to Exams/, 2 syllabuses moved to Syllabuses, 3 duplicates deleted)
     - ✅ `Books/Computer studies` (deep audit complete: 28 clean books with 100% level tagging, 1 mock exam moved to Exams/, 3 non-curriculum deleted)
     - ✅ `Books/English` (deep audit complete: 116 clean books with 100% level tagging, 33 exams moved to Exams/, 5 Q&A moved to Q&A/, 3 syllabuses moved to Syllabuses/, 34 deleted)
     - ✅ `Books/Geography` (deep audit complete: 35 clean books with 100% level tagging, 21 mock exams moved to Exams/, 1 Q&A moved to Q&A/, 7 deleted)
     - ✅ `Books/History` (deep audit complete: 9 clean books with 100% level tagging, 10 mock exams moved to Exams/)
     - ✅ `Books/Home Economics` (deep audit complete: 2 clean books with 100% level tagging, 2 non-curriculum deleted)
     - ✅ `Books/Life Skills` (deep audit complete: 2 clean books with 100% level tagging, 2 exams moved to Exams/)
     - ✅ `Books/Mathematics` (deep audit complete: 37 clean books with 100% level tagging, 28 mock exams moved to Exams/, 21 Q&A moved to Q&A/, 1 syllabus moved to Syllabuses/, 2 books transferred to Additional Mathematics, 26 deleted)
     - ✅ `Books/Physical Science` (deep audit complete: 1 clean book with 100% level tagging)
     - ✅ `Books/Physics` - 44 clean books (15 exams, 5 Q&A, 3 syllabuses, 38 deleted); 100% level tagged; Nov 27, 2026
     - ✅ `Books/Social Studies` (deep audit complete: 7 clean books with 100% level tagging, 1 mock exam moved to Exams/)
     - ✅ `Books/Syllabuses` - Decentralized 24 subject syllabuses into `Books/{Subject}/Syllabus/` subfolders; preserved complete national MANEB regulations handbook; Nov 27, 2026
     - ⬜ All `Exams/` subfolders
     - ⬜ `Q&A/`
     - ⬜ **Unzip `Zips/` folder:** Review all 56 ZIP archives, extract contents, and distribute individual files across the correct subject folders in `Books/` and `Exams/`. Remove ZIP duplicates from R2 once distributed and verified.
   - **Fix existing filenames:** Clean up vague, truncated, and inconsistent names. Many files have raw upload names with no hint of what's inside.
   - **Establish a naming convention** (locked in after the folder pass):
     ```
     [Category]_[Subject]_[Level]_[Year]_[Description].pdf
     Exams_Mathematics_MSCE_2024_Paper1.pdf
     Books_Biology_JCE_MaladeSyllabus.pdf
     ```
   - **Re-organize misclassified files** into correct subject/level directories.
   - **Automate new resource ingestion** (built from lessons learned folder-by-folder):
     - Validates filenames against the naming convention before upload.
     - Auto-generates / updates `files-index.json` entries (description, category, path, ID) on upload.
     - Community submission workflow: WhatsApp group members submit files → ingestion script renames, places, and indexes them → they appear in the library automatically.
     - **File deduplication via content hash:** Computes a short SHA-256 hash per file; rejects exact duplicates at ingestion even if renamed or moved.

5. **Missing Subjects Sourcing & Collection (Curriculum Expansion)**
   - Source, curate, and ingest textbooks and exam papers for secondary subjects currently missing or lacking textbook coverage in MSCE/JCE:
     - **Business Studies:** Added first core textbook (*Best Approach to Business Studies - Forms 3 and 4*) and model Q&A booklet (*Business Studies Q&A for MSCE by Boko*); 5 syllabuses organized into `Books/Business Studies/Syllabus/`.
     - **French:** Malawian secondary curriculum elective.
     - **Woodwork / Carpentry & Joinery:** Technical subjects.
     - **Metalwork:** Technical subjects.
     - **Technical Drawing:** Technical subjects.
     - **Performing Arts / Expressive Arts:** Music, Dance, Drama.
     - **Art & Design:** Creative arts elective.
     - **Physical Education (PE):** Sports science and physical education.

6. **Batch Multi-Select & Share / Download Function**
   - Allow selecting multiple files (checkboxes / multi-select mode).
   - Share multiple selected document links or files simultaneously via Web Share API / WhatsApp.
   - **Save Selected Folder(s) Offline:** Allow selecting folder checkboxes in the main library to batch-save all files within a folder to offline storage with 1 tap (including total download size preview & confirmation).
   - **Remove Selected** (saved books page): add a "Remove Selected" button next to "Download Selected" for bulk-deleting saved books. Suggested by Claude alongside the checkboxes feature (Nov 2026).
   - **Multi-Download Fallback (Client-side ZIP):** Many mobile browsers block multiple simultaneous file downloads. Detect this restriction or provide an option to package selected files into a single `.zip` file client-side (using JSZip) for 1-click batch download.

6. ✅ **Smart In-App Deep-Link Sharing (Navigate, Auto-Focus & Highlight)** - *implemented (app.js v5.2.0, SW v34): link format is `#/file/<stable-id>`; Share button now sends this link; unknown ids fall back to home with a toast*
   - Instead of sharing a raw download URL that isolates the file from the platform:
   - Share an in-app deep-link (e.g., `https://wylibrary.org/#/file/<id>`).
   - When opened by a peer, the link lands them directly inside Wylibrary at the exact folder location, auto-scrolls to the target card, and draws attention with a badge and pulse animation.
   - **Value:** Introduces students to the full library and surrounding past papers, letting them choose whether to Open, Download, or Save Offline with 1 tap.
   - **Future Refinement (Highlight Persistence & Triggers):** Currently pulse fades on a timer. Make highlight duration longer or tie dismissal to user interaction (e.g., stop pulse when scrolling is detected, when the card scrolls out of viewport, or on directory navigation change) so slow readers don't miss the target item.

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
- **Dedicated Wylibrary Facebook Page Creation & Launch Support:**
  - Launch an official Facebook page for Wylibrary (addressing and solving what went wrong in the previous attempt).
  - Prepare professional branding (profile icon, cover banner, description, website link).
  - Step-by-step guidance to avoid Meta account verification hurdles or automated flagging traps.
  - Draft initial announcements and connect with Malawian secondary school and student groups.
- **Google Analytics (GA4) Reporting & Insights Integration:**
  - Connect GA4 Data API (or weekly CSV reports) to track top-downloaded books, search trends, and student traffic patterns across Malawi.
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

### 15. Post-Download Donation Prompt System (PayChangu & PayPal)
- **Support Mechanism:** Prompt a non-intrusive donation appeal after file downloads to support platform hosting, bandwidth, and ongoing curation.
- **Payment Gateways:**
  - **PayChangu:** For Malawian domestic contributions (Airtel Money, TNM Mpamba, local bank cards).
  - **PayPal:** For international supporters wishing to contribute.
- **Smart Suppression & Cooldown:** If a user contributes, suppress future donation prompts dynamically based on donation amount/tier (e.g., temporary exemption or tiered cool-off period tracked locally).

### 16. Consistent, Warm & Colorful Icon System (Future Middle Ground)
- **Goal:** Fix the core problem with system emojis (they render inconsistently across Samsung, iOS, Android, and Windows) while **preserving the warmth, color, and informal relatable charm** that students love about Wylibrary.
- **Design Principles & Direction (User Vision):**
  - Avoid cold, thin, corporate monochrome line icons that strip away the app's personality.
  - Explore a colorful, chunky, rounded middle ground:
    - Folders remain cheerful yellow folders.
    - PDFs remain red closed books (like the classic 📕).
    - Office files (Word, Excel, Slides) and ZIP packages each retain distinct signature colors.
    - Footer stats retain vibrant books, drive, and calendar motifs.
  - Alternative: Self-hosted consistent SVG emoji artwork (e.g., Twemoji or Microsoft Fluent Emoji) bundled locally for 100% offline consistency across devices.
  - **Status:** Deferred for a thoughtful future design pass; keep current familiar emojis for now and focus on functional milestones.

### 17. Voluntary Student District Selector (Analytics & Regional Reach)
- **Concept (Idea for future consideration):** Because telecom providers in Malawi (Airtel and TNM) route mobile data through centralized gateway breakout points in Lilongwe and Blantyre, standard IP geolocation maps almost all students to Lilongwe (even when studying in Mzuzu, Zomba, Karonga, Kasungu, etc.).
- **Implementation:** An optional, friendly dropdown or setting (e.g. "Where are you studying from? [Mzuzu, Lilongwe, Blantyre, Zomba...]") saved in `localStorage` and sent as an anonymous custom event or dimension to Google Analytics (`student_district`).
- **Privacy First:** 100% voluntary, zero intrusive browser GPS permission popups, fully respectful of student privacy.
- **Priority:** Low / Optional future exploration.

### 18. About Page Story & Vision Expansion
- **Story Details to Incorporate:**
  - **Who Wycliffe Is & What He Does:** Background on Wycliffe Mwanganda, what he does, and his dedication to software development and student empowerment.
  - **The 2021 Form 4 Origin:** The early roots of Wylibrary dating back to 2021 when Wycliffe was in Form 4, experiencing firsthand the scarcity of textbooks, syllabi, and past exam papers for secondary school students in Malawi.
  - **The Vision:** Transforming education accessibility across Malawi through a free, ultra-fast, and data-friendly digital library built specifically for local learners.
- **Priority:** High / Scheduled for narrative and personal story polish.

### 19. Competitor & Ecosystem Tracking (Mabuku Site)
- **Reference:** `https://free.mabuku.site/` (Mabuku - "Books" in Chichewa).
- **Context:** An alternative Malawian digital study resource repository offering secondary school notes and past exam papers.
- **Points of Comparison & Opportunities for Wylibrary:**
  - **Uptime & Network Resilience:** Many alternative portals run on basic hosting stacks and frequently suffer 520/503 origin outages or slow loading on spotty mobile data. Wylibrary's static edge architecture (Cloudflare Pages + R2) provides superior reliability and instant page loads.
  - **Offline Capability:** Wylibrary's PWA allows complete offline document saving with IndexedDB, which competitors generally lack.
  - **Resource Curation:** Track missing past paper years, marking keys, and syllabuses to ensure Wylibrary remains the most complete and up-to-date repository (3,104+ resources).

### 20. Automated Book & Exam Ingestion Script
- **Goal:** CLI tool to automate adding new books and exam papers to Cloudflare R2 and updating the catalog without manual JSON editing.
- **Key Architecture Lessons:**
  - **R2 Bucket Routing:** Route `Books/` to Bucket 1 (`wylibrary-media-1`), and `Exams/`, `Zips/`, `Q&A/` to Bucket 2 (`wylibrary-media-2`).
  - **Dual Catalog Synchronization:** Must update both `/files-index.json` and `/public/files-index.json`.
  - **Stable IDs:** Must run `node scripts/add-ids.mjs` and commit `/public/id-map.json` to keep students' saved offline documents intact.
  - **Filename Normalization:** Standardize titles (e.g. `2026 MANEB Biology Paper I.pdf`) and align directory naming (e.g. `Exams/Computer studies`).
  - **Explicit MIME Types:** Always upload with explicit `ContentType` (`application/pdf`, `application/zip`).
  - [x] **Service Worker Invalidation:** Auto-bump `CACHE_NAME` and update `UPDATE_META` (`materials` drop notification) implemented in `scripts/ingest.mjs`.

### 23. Christmas Theme (Dec 2026) - REMINDER
- **Idea:** Try a subtle, time-limited Christmas theme for the last week of December. Festive color accents (reds/greens alongside the brand blue), maybe a light snowflake or star motif in the header or on the splash. Keep it gentle - does not distract from study content.
- **Should auto-revert after Christmas week** (Dec 25-Jan 1 window). Could be toggled manually or via a date check in JS.
- **Priority:** Seasonal / Try when December arrives.

### 24. Exam Paper Organization (Community Suggestion)
- **Suggested by:** Community member (+265 982 33 60 08) via WhatsApp, Nov 27 2026.
- **Idea:** Reorganize `Exams/` subfolders into clearly separated sections:
  - `Exams/MANEB Official/` - Official MANEB papers (MSCE + JCE by year, most sought-after)
  - `Exams/Mock Exams/` - School mock/end-of-term papers (kept separate)
- **Why:** Official MANEB papers are what students most urgently need; mixing them with school mocks makes them harder to find.
- **Resource offer:** Community member has offered to supply MANEB papers 2000-2026 for English, Maths, Physics, Chemistry, Biology, Computer Studies, Agriculture, Geography.
- **Priority:** Medium / Plan during Exams/ folder audit pass (after Books/ audit completes).

### 25. Play Store Distribution
- **Goal:** Get Wylibrary on Google Play Store.
- **Cost:** $25 one-time Google Play Developer account fee (approx MWK 50k-80k after bank charges).
- **Plan:** Fundraise through community donations to cover the fee.
- **Technical approach:** Investigate Trusted Web Activity (TWA) - packages a PWA as an Android APK without rewriting the app. Tools: Bubblewrap CLI or PWA Builder.
- **App Store (iOS):** Separate cost and process - explore later.
- **Priority:** Medium / Target 2027 when funds available.

### 21. Footer Expansion & Structured Links
- **Goal:** Update the footer across all views by adding more comprehensive information and clear navigation links.
- **Key Elements to Include:**
  - Quick links (Home, Practice, About, Contact, WhatsApp Student Community).
  - Resource categories (JCE Resources, MSCE Resources, MANEB Past Papers, Textbooks).
  - Wylibrary mission summary and direct What's New guide link.
- **Priority:** High / Pair with About page update.

### 22. Level Filter Notification Pill (Offline-Style or Merged Header Banner)
- **Concept:** When filtered to JCE or MSCE, show a clear status pill styled like the existing amber offline indicator banner (`#offlineBanner`).
- **Ideas to Explore:**
  - Dedicated top status pill: e.g. `🎓 MSCE active · Tap to change` anchored at the top of the header.
  - Unified / merged banner: When both offline and filtered to a level, gracefully merge or cycle the status (e.g. `Offline · 12 saved books | 🎓 MSCE`) to maintain a clean, zero-clutter interface.
- **Priority:** Backlog / Saved for future design pass.

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
