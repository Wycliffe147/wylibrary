# Wylibrary Folder Cleanup & Audit Baseline Log

This log permanently records the **Before** and **After** baseline numbers for each subject folder during the deep library audit. 
The "After" number represents the clean, frozen count at the moment the folder audit was completed (separate from future additions).

---

## 📊 Subject Folder Audit Summary

| Subject Folder | Status | Before Count | After Clean Books | Transferred to Exams | Transferred to Q&A | Duplicates / Non-Curriculum Deleted | Level Tagging Coverage | Completion Date |
|---|---|---|---|---|---|---|---|---|
| **Books/Additional Mathematics** | ✅ Audited | 19 | 19 | 0 | 0 | 0 | 100% MSCE | Nov 13, 2026 |
| **Books/Bible Knowledge** | ✅ Audited | 34 | 24 | 5 | 0 | 4 | 100% Explicit | Nov 25, 2026 |
| **Books/Agriculture** | ✅ Audited | 84 | 67 | 10 | 3 | 6 | 100% Explicit | Nov 25, 2026 |
| **Books/Biology** | ✅ Audited | 203 | 112 | 44 | 15 | 30 | 100% Explicit | Nov 26, 2026 |
| **Books/Business Studies** | ✅ Audited | 7 | 0 | 2 | 0 | 0 | 100% Explicit | Nov 26, 2026 |
| **Books/Chemistry** | ✅ Audited | 80 | 44 | 18 | 3 | 14 | 100% Explicit | Nov 26, 2026 |
| **Books/Chichewa** | ✅ Audited | 50 | 24 | 21 | 0 | 3 | 100% Explicit | Nov 26, 2026 |
| **Books/Computer studies** | ✅ Audited | 32 | 28 | 1 | 0 | 3 | 100% Explicit | Nov 26, 2026 |
| **Books/English** | ✅ Audited | 191 | 116 | 33 | 5 | 34 | 100% Explicit | Nov 26, 2026 |
| **Books/Geography** | ✅ Audited | 64 | 35 | 21 | 1 | 7 | 100% Explicit | Nov 26, 2026 |
| **Books/History** | ⬜ Queued | 24 | *Pending* | - | - | - | - | - |
| **Books/Home Economics** | ⬜ Queued | 8 | *Pending* | - | - | - | - | - |
| **Books/Life Skills** | ✅ Audited | 4 | 2 | 2 | 0 | 0 | 100% Explicit | Nov 26, 2026 |
| **Books/Mathematics** | ✅ Audited | 115 | 39 | 28 | 21 | 26 | 100% Explicit | Nov 27, 2026 |
| **Books/Physical Science** | ✅ Audited | 1 | 1 | 0 | 0 | 0 | 100% Explicit | Nov 27, 2026 |
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
- **Clean Books Retained:** 24 clean books (100% level classified)
- **Transferred to Exams:** 5 mock exams moved to `Exams/Bible Knowledge/` on Bucket 2
- **Transferred to Syllabuses:** 1 official syllabus moved to `Books/Syllabuses/`
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
- **Clean Books Retained:** 112 clean textbooks, form modules, and practical handbooks (83 MSCE, 18 JCE, 11 Both)
- **Transferred to Exams:** 44 files (Cluster, Diocese, School, and Division mock exams, MANEB past papers, marking schemes, practical examination papers)
- **Transferred to Q&A:** 15 files (Kudinkula Q&A, Bioz Model Essays, Chancellor College Q&A, Mastering Biology Essays, Transpiration Essay, Predicted Essays)
- **Transferred to Syllabuses:** 2 official curriculum syllabuses moved to `Books/Syllabuses/`
- **Deleted from R2:** 30 files (5 non-curriculum/corrupt/spam: church medical missionary quotes, 2-byte corrupt dummy, farm sales spreadsheet, WhatsApp prediction spam, crude 2.7KB draft; plus 25 duplicate/superseded uploads)
- **Format and Metadata Fixes:** Converted and renamed `2._MALNUTRITION.txt` (a PowerPoint presentation) to `.pptx` format in storage and catalog.

### 5. Books/Business Studies
- **Initial Count:** 7 files
- **Clean Books Retained:** 0 (all 5 curriculum syllabus files consolidated into `Books/Syllabuses/`)
- **Transferred to Exams:** 2 files (1 MANEB JCE sample paper + 1 Shire Highlands Education Division MSCE Paper II mock exam)
- **Transferred to Syllabuses:** 5 files (Teaching Syllabuses, General Syllabuses, Scope & Sequence Chart)
- **Transferred to Q&A:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit

### 6. Books/Chichewa
- **Initial Count:** 50 files
- **Clean Books Retained:** 24 clean setbooks, grammar guides, and coursebooks (10 MSCE, 5 JCE, 9 Both)
- **Transferred to Exams:** 21 mock exams moved to `Exams/Chichewa/` on Bucket 2 (CEED Papers 1-3, Machinga, St Marys, Shire Highlands, Madisi, Mulanje, Hill Crescent, Kamuzu Barracks, Nanjiriri, MANEB compilation)
- **Transferred to Syllabuses:** 2 national curriculum syllabuses moved to `Books/Syllabuses/` (JCE Forms 1-2 Syllabus, Senior Secondary Forms 3-4 Syllabus)
- **Transferred to Q&A:** 0
- **Deleted from R2:** 3 files (1 incomplete draft and 2 duplicate uploads)
- **Level Tagging Coverage:** 100% Explicit

### 7. Books/Computer studies
- **Initial Count:** 32 files
- **Clean Books Retained:** 28 clean textbooks, modular units, and reference handbooks (6 MSCE, 12 JCE, 10 Both)
- **Transferred to Exams:** 1 mock exam moved to `Exams/Computer Studies/` on Bucket 2 (Loyola Jesuit Secondary School JCE Computer Studies Mock 2021)
- **Transferred to Syllabuses:** 0
- **Transferred to Q&A:** 0
- **Deleted from R2:** 3 files (1 non-curriculum student personal letter to Mzuzu University, 2 external hacking trade paperbacks from PDFDrive)
- **Level Tagging Coverage:** 100% Explicit

### 8. Books/Chemistry
- **Initial Count:** 80 files
- **Clean Books Retained:** 44 clean textbooks, coursebooks, and experimental practical guides (24 MSCE, 12 JCE, 8 Both)
- **Transferred to Exams:** 18 files (17 mock exams to `Exams/Chemistry/` on Bucket 2: CEED Form 4, Answer Private Academy Papers 1 & 2, Providence Cluster Papers 1 & 2, Bangwe Cluster Practical, Nkula CDSS Form 2, Nsanje District, Mzalangwe Cluster, JCE Sample Paper, Loyola Jesuit Papers 1 & 2, Hill Crescent, Mzuzu Diocese Papers 1 & 2, Evergreen Garden Form 1; plus 1 misplaced CWED MSCE Life Skills Paper II Marking Scheme moved to `Exams/Life Skills/`)
- **Transferred to Q&A:** 3 comprehensive booklets to `Q&A/Chemistry/` on Bucket 2 (Model Chemistry Practical Questions & Answers by Sir James, Chemistry Model Examination Questions & Answers, Master Tutors Chemistry Questions & Model Answers)
- **Transferred to Syllabuses:** 1 official curriculum syllabus moved to `Books/Syllabuses/` (Chemistry Senior Secondary Syllabus Forms 3 and 4)
- **Deleted from R2:** 14 files (1 UNIMA application form, 1 primary school teacher induction presentation, 1 Turkish high school IB thesis, 1 UK GCSE blog post, 1 US university lab guide, 2 Indian exam blog scrapes, 1 incomplete 8-page fragment, 1 redundant 130MB uncompressed copy, and 5 duplicate uploads)
- **Level Tagging Coverage:** 100% Explicit

### 9. Books/Geography
- **Initial Count:** 64 files
- **Clean Books Retained:** 35 clean textbooks, physical/human geography coursebooks, and map reading guides (20 MSCE, 8 JCE, 7 Both)
- **Transferred to Exams:** 21 mock exams and past papers to `Exams/Geography/` on Bucket 2 (Karonga/Mzuzu Diocesan, Karonga Diocese, MANEB MSCE Paper 2, MSCE Paper 2 2020, St Godfrey Papers 1 & 2, Answer Private Academy Paper 2, Blantyre Secondary School Cluster, MANEB Chief Examiners Report 2019, St Marys 2016 & 2021 & 2018, New Vision Form 4, JCE Sample Papers 1 & 2, Northern Education Division Papers 1 & 2, Hill Crescent Paper 2, Marist Secondary School Papers 1 & 2, Mzuzu Diocese Paper 2)
- **Transferred to Q&A:** 1 model answer booklet to `Q&A/Geography/` on Bucket 2 (Geography Model Examination Questions and Answers by K. Gareta)
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 7 files (1 external Cambridge IGCSE 2012 revision guide, 1 draft 485KB copy of Marist Mock, 1 duplicate 9.8MB copy of Form 3/4 notes, 1 duplicate 79-page upload of Human & Economic Geography, 1 duplicate 64-page upload of Human Geography, 1 duplicate 84-page upload of Form 4 Geography, and 1 duplicate upload of Book 3 with Map Work Elements)
- **Level Tagging Coverage:** 100% Explicit

### 10. Books/English
- **Initial Count:** 191 files
- **Clean Books Retained:** 116 clean textbooks, literature companions, drama/novel texts, grammar workbooks, and teacher training manuals (31 MSCE, 8 JCE, 77 Both)
- **Transferred to Exams:** 33 files to `Exams/English/` on Bucket 2 (MANEB 2015 JCE Paper I, MANEB 2019 MSCE Paper I, Mzuzu Diocese 2020, Answer Private Academy Paper III, Mvera Girls Form 1 Papers I & II, Dedza Diocese Paper III, Northern Education Division Papers I & II & III, Mulanje District Council, Mulanje Cluster Paper III, Zingwangwa Cluster Paper III, St Marys Papers I & II, Hill Crescent Papers I & II & III, Blantyre Secondary School Cluster Papers I & II & III, New Vision Form 4, Likuni Boys 2012, BSS Zone 2017, JCE Sample Paper II, Shire Highlands Education Division Paper I, and Paper III Note Making Mock)
- **Transferred to Q&A:** 5 literature model question and essay analysis booklets to `Q&A/English/` on Bucket 2 (Essay Questions and Model Analysis on Macbeth, Macbeth and The Pearl Literature Essays with Insights, Macbeth Model Essay Questions and Answers by Scott Lessons, Compilation of Essay Questions from Macbeth 2020, and The Pearl Questions and Answers Study Plan)
- **Transferred to Syllabuses:** 3 national curriculum syllabus documents moved to `Books/Syllabuses/` (English Syllabus Forms 1 and 2, English Senior Secondary Syllabus Forms 3 and 4, and MANEB English Examination Syllabus)
- **Deleted from R2:** 34 files (1 UAE private school handbook, 1 OraQuick HIV test kit leaflet, 1 non-curriculum apocryphal Book of Enoch, 1 romance novel paperback, 2 primary school textbooks/guides, 1 primary PSLCE mock exam, 3 external bank/Hindi exam web scrapes, 1 TOEFL vocabulary trade book, 4 misfiled Chichewa literature drafts, 1 draft notes with emoji title, and 18 duplicate uploads of grammar books, literature summaries, and setbook texts)
- **Level Tagging Coverage:** 100% Explicit

### 11. Books/Life Skills
- **Initial Count:** 4 files
- **Clean Books Retained:** 2 clean study guides (1 JCE, 1 Both)
- **Transferred to Exams:** 2 mock exams to `Exams/Life Skills/` on Bucket 2 (St Marys Girls Secondary School MSCE Life Skills Mock Exam 2020, Michiru View Secondary School MSCE Life Skills Mock Exam 2022)
- **Transferred to Q&A:** 0
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit

### 12. Books/Mathematics
- **Initial Count:** 115 files
- **Clean Books Retained:** 39 clean textbooks, modular coursebooks, formula compendiums, and revision pamphlets (21 MSCE, 8 JCE, 10 Both)
- **Transferred to Exams:** 28 mock exams and past papers to Bucket 2:
  - 25 files to `Exams/Mathematics/` (MANEB 2006 Paper 1, MANEB 2016 JCE, 2016 Mzuzu Diocese Mock Paper 1, 2019 Maranatha Mock Paper 1, 2019 Providence Cluster Mock Paper 2, MANEB 2020 Paper 1, 2021 CCAP Synod of Livingstonia Mock Papers 1 & 2, 2021 Nkhamenya Cluster Mock Paper 2, 2022 MANEB Chief Examiners Report, 2022 Chikhwaza Cluster Mock Paper 2, 2023 CEED Mock Paper 1, 2023 Lilongwe City Mock Papers 1 & 2, 2023 Blantyre Secondary School Cluster Mock Paper 2, 2023 Shire Highlands Education Division Mock Paper 1, 2025 Shire Highlands Education Division Mock Paper 1 PDF & DOCX, 2026 Northern Education Division JCE Mock, 2026 Loyola Jesuit Secondary School JCE Mock, 2021 MANEB JCE Sample Paper, 2025 Central West Education Division Mock Papers 1 & 2, MSCE Mock Paper 1, and 2020 Mzuzu Diocese Mock Papers 1 & 2, 2020 St Marys Mock Paper 1)
  - 3 files to `Exams/Additional Mathematics/` (MANEB 2014 MSCE Additional Mathematics Paper 1, MANEB 2019 MSCE Additional Mathematics Paper 2)
- **Transferred to Q&A:** 21 topical model answers and solution booklets to Bucket 2:
  - 20 files to `Q&A/Mathematics/` (17 topical Ans_MSCE_Math model solutions for Irrational Numbers, Mapping & Functions, Change of Subject, Variations, Polynomials, Coordinate Geometry, Graphs of Functions, Travel Graph, Trigonometry, Similarity, Vectors, Constructing Geometry, Statistics, Matrices, Quadratics, Algebraic Fractions; plus MSCE Mathematics Past Exam Questions & Model Answers 2002-2015, Topical Sets Questions and Solutions, and K. Gareta 2017 Mock Paper 1 Model Solutions)
  - 1 file to `Q&A/Additional Mathematics/` (Additional Mathematics Assignment and Model Solutions by Sam Mhango)
- **Transferred to Syllabuses:** 1 official national curriculum syllabus moved to `Books/Syllabuses/` (Mathematics Syllabus Forms 3-4, MIE 2013)
- **Deleted from R2:** 26 files (5 corrupted PDFs with invalid catalogs/xref tables: maths_practice_1998, 2000, 2001, 2005, 2006; 12 non-curriculum/primary/trade: 2022 Primary Mathematics, Chimteka Zone PSLCE exam, IPTE primary teacher college module, 4-page US journal article, GRE exam review, 7-page illegible student notebook scribbles, Bob Miller Calculus trade book, Edexcel IGCSE teacher answers, FSMA UK vectors worksheet, MEP Year 8 angles worksheet, continuous assessment workshop slides, USAID AMAA NGO layout; and 9 duplicate uploads of Arise Book 3, Maranatha Mock, Excel Book 3, Target Book 4, Motto Mathematics, Chikwakwa Book 4, and Mathematics Book 2)
- **Level Tagging Coverage:** 100% Explicit (21 MSCE, 8 JCE, 10 Both)

### 13. Books/Physical Science
- **Initial Count:** 1 file
- **Clean Books Retained:** 1 clean comprehensive teacher guide (1 MSCE)
- **Normalized Title:** Physical Sciences Grade 12 Teacher's Guide (Siyavula).pdf (Level: msce)
- **Transferred to Exams:** 0
- **Transferred to Q&A:** 0
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit
