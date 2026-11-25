# Wycliffe Mwanganda - The Full Story
> Private reference document. Source material for the About page, interviews, portfolio writeups, and future content.

---

## Who Wycliffe Is

Wycliffe Mwanganda is a self-taught software developer from Malawi. He builds real, production-grade systems across the full stack - not education tools specifically, but software. Wylibrary happens to be an education project. His portfolio shows the full range:

- **Wylibrary** - PWA e-library with Cloudflare edge, IndexedDB offline, Vanilla JS, SW caching
- **SchoolOS MW** - Multi-tenant school ERP with WhatsApp automation (Baileys), MANEB-compliant grading, payroll, attendance, parent portal
- **DigiHelp** - Software company website in React 18 + Vite + Tailwind on Cloudflare Pages
- **RoseMatch** - Android app
- **MindBridge** - Android app
- **WysPortfolio** - Portfolio site (Next.js)
- **JarvisAssistant** - Personal AI assistant
- **Report Generator** - Termux-native report card generator with WhatsApp dispatcher (origin of SchoolOS)
- **2LM Stock App** - Supabase-backed stock management
- And more across web, mobile, and automation.

He is not a university/college student doing coursework. He builds because he sees problems and has the ability to solve them.

---

## Education Timeline

| Year | Level | Note |
|---|---|---|
| 2020-2021 | Form 1 | COVID affected school calendar that year |
| 2022 | Form 2 | |
| 2023 | Form 3 | |
| 2024 | Form 4 | Wrote MSCE for the first time. Failed due to illness. |
| 2024 | Repeated Form 3 | |
| 2025 | Form 4 | |
| 2026 | Rewrote MSCE MANEB | |

---

## The Origin of Wylibrary (2021-2026)

**2021 (Form 1):** Wycliffe saw the chair of his school's ICT club build a very simple offline e-library. Far simpler than what Wylibrary is today, but it was the spark. He wanted to build his own - but online, properly organized, accessible to all students. The problem that felt impossible at the time: *where to store all the resources?* He had no idea how he could ever afford storage. So he kept planning.

From 2021 to 2025 he kept the idea alive: writing snippets of code, pseudocode, notes, sketches - whenever inspiration struck.

**January 2026:** Cracked the storage and cost problem - Cloudflare R2 and Pages, free tier covers it.

**March 2, 2026:** Launched the first version at 18 years old.

**July 11, 2026:** Registered wylibrary.org - his first ever custom domain.

**November 2026:** Full PWA, offline saving, 3,100+ resources, JCE/MSCE level filtering (v12.0).

---

## Why He Does It - And What It Costs

Nobody told him to do this. Nobody assigned it, no teacher, no institution, no paycheck.

**What goes in:**
- Sleep (many late nights)
- Time (evenings, weekends)
- Mobile data money - developing and testing on a data bundle costs real money in Malawi. A lot of it.

**What comes back:**
- Experience and sharper engineering skills
- Exposure - importantly: the right kind. People who find Wylibrary should see that he doesn't just build education tools, he builds real software with real architecture.
- The satisfaction of actually helping people.

---

## The Bigger Mission

Beyond resource access, he wants to show Malawian youth:
- You can build things that matter. Right now. Without waiting for permission.
- You can go deep into tech and create solutions for the problems around you.
- A young person from Malawi with a phone, a connection, and determination can build production software that helps thousands.

---

## Support Model (Before Mobile Money Integration)

PayChangu and Airtel/TNM API integrations are planned but not yet set up. Meaningful support in the meantime:
- Sending books, notes, or past papers to add
- Sharing the link with other students
- Teaching someone else how to use it
- Reporting bugs
- Suggesting missing subjects, years, or features
- Identifying gaps in the catalog

A dedicated Support section/page is planned for a future update.

---

## Legal & Trust Notes (For Future Reference)

### Privacy Policy / Terms of Use
No personal data is collected currently (no accounts, no logins, localStorage only). Worth revisiting when payment integration or any data collection is added.

### Copyright & Publisher Risk
Hosting copyrighted educational materials is a theoretical risk. Key context: sharing digital study materials is extremely common in Malawi - virtually every school has WhatsApp groups dedicated to it. No legal action has ever been taken in Malawi on this. Remains a low but non-zero risk to monitor as the project grows.

### Misinformation - Phishing Accusations
Someone told students Wylibrary is a phishing site. Likely concluded that any link shared on WhatsApp is a hacker link - understandable since roughly 60% of such links in Malawi ARE scams (fake prizes, fake registration, credential harvesting).

**YouTube idea:** Educate the public on:
- Common phishing/scam link tropes
- How to identify real vs scam links
- Live demo: build a fake phishing page, explain it, let viewers enter fake details, then reveal those entries live - proving how dangerous it is ("my people believe more when they see with their own eyes")
- This doubles as trust-building content for Wylibrary's reputation.

---

*Last updated: November 2026*
