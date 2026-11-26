# Wylibrary Folder Cleanup & Audit Baseline Log

This log permanently records the **Before** and **After** baseline numbers for each subject folder during the deep library audit. 
The "After" number represents the clean, frozen count at the moment the folder audit was completed (separate from future additions).

---

## 📊 Subject Folder Audit Summary

| Subject Folder | Status | Before Count | After Clean Books | Transferred to Exams | Transferred to Q&A | Duplicates / Non-Curriculum Deleted | Level Tagging Coverage | Completion Date |
|---|---|---|---|---|---|---|---|---|
| **Books/Additional Mathematics** | ✅ Audited | 19 | 19 | 0 | 0 | 0 | 100% MSCE | Nov 13, 2026 |
| **Books/Bible Knowledge** | ✅ Audited | 34 | 25 | 5 | 0 | 4 | 100% Explicit | Nov 25, 2026 |
| **Books/Agriculture** | ✅ Audited | 84 | 67 | 10 | 3 | 6 | 100% Explicit | Nov 25, 2026 |
| **Books/Biology** | ✅ Audited | 203 | 114 | 44 | 15 | 30 | 100% Explicit | Nov 26, 2026 |
| **Books/Business Studies** | ✅ Audited | 7 | 5 | 2 | 0 | 0 | 100% Explicit | Nov 26, 2026 |
| **Books/Chemistry** | ⬜ Queued | 57 | *Pending* | - | - | - | - | - |
| **Books/Chichewa** | ⬜ Queued | 12 | *Pending* | - | - | - | - | - |
| **Books/Computer studies** | ⬜ Queued | 21 | *Pending* | - | - | - | - | - |
| **Books/English** | ⬜ Queued | 191 | *Pending* | - | - | - | - | - |
| **Books/Geography** | ⬜ Queued | 50 | *Pending* | - | - | - | - | - |
| **Books/History** | ⬜ Queued | 24 | *Pending* | - | - | - | - | - |
| **Books/Home Economics** | ⬜ Queued | 8 | *Pending* | - | - | - | - | - |
| **Books/Life Skills** | ⬜ Queued | 7 | *Pending* | - | - | - | - | - |
| **Books/Mathematics** | ⬜ Queued | 72 | *Pending* | - | - | - | - | - |
| **Books/Physical Science** | ⬜ Queued | 19 | *Pending* | - | - | - | - | - |
| **Books/Physics** | ⬜ Queued | 90 | *Pending* | - | - | - | - | - |
| **Books/Social Studies** | ⬜ Queued | 6 | *Pending* | - | - | - | - | - |

---

## 📝 Detailed Folder Breakdown

### 1. Books/Additional Mathematics
- **Initial Count:** 19 files
- **Clean Books Retained:** 19
- **Changes:** Subject rule hardcoded in `getFileLevel()` to 100% MSCE. No duplicates or misplaced exams found.

### 2. Books/Bible Knowledge
- **Initial Count:** 34 files (merged duplicate lowercase `Books/Bible knowledge` directory)
- **Clean Books Retained:** 25 clean books (100% level classified)
- **Transferred to Exams:** 5 mock exams moved to `Exams/Bible Knowledge/` on Bucket 2
- **Deleted from R2:** 4 files (sermon outlines, church stewardship notes, duplicate drafts)

### 3. Books/Agriculture
- **Initial Count:** 84 files
- **Clean Books Retained:** 67 clean textbooks and course modules (41 MSCE, 18 JCE, 8 Both)
- **Transferred to Exams:** 10 files (9 cluster/diocese/school mock exams + 1 essay examination question paper)
- **Transferred to Q&A:** 3 comprehensive booklets (Kamphonje Q&A, Soil Degradation Q&A, Practical Exam Q&A)
- **Deleted from R2:** 6 files (4 duplicate uploads of Q&A/Kayembe/Achievers + 2 rough essay drafts)
- **Metadata Fixes:** Fixed size of `Agriculture Made Simple (Thoko Slim)` from 131 bytes dummy to 699 KB.

### 4. Books/Biology
- **Initial Count:** 203 files
- **Clean Books Retained:** 114 clean textbooks, form modules, and practical handbooks (84 MSCE, 18 JCE, 12 Both)
- **Transferred to Exams:** 44 files (Cluster, Diocese, School, and Division mock exams, MANEB past papers, marking schemes, practical examination papers)
- **Transferred to Q&A:** 15 files (Kudinkula Q&A, Bioz Model Essays, Chancellor College Q&A, Mastering Biology Essays, Transpiration Essay, Predicted Essays)
- **Deleted from R2:** 30 files (5 non-curriculum/corrupt/spam: church medical missionary quotes, 2-byte corrupt dummy, farm sales spreadsheet, WhatsApp prediction spam, crude 2.7KB draft; plus 25 duplicate/superseded uploads)
- **Format and Metadata Fixes:** Converted and renamed `2._MALNUTRITION.txt` (a PowerPoint presentation) to `.pptx` format in storage and catalog.

### 5. Books/Business Studies
- **Initial Count:** 7 files
- **Clean Books Retained:** 5 clean national curriculum syllabus documents (2 JCE, 2 MSCE, 1 Both)
- **Transferred to Exams:** 2 files (1 MANEB JCE sample paper + 1 Shire Highlands Education Division MSCE Paper II mock exam)
- **Transferred to Q&A:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit
