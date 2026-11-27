# Wylibrary Folder Cleanup & Audit Baseline Log

This log permanently records the **Before** and **After** baseline numbers for each subject folder during the deep library audit. 
The "After" number represents the clean, frozen count at the moment the folder audit was completed (separate from future additions).

---

## 📊 Subject Folder Audit Summary

| Subject Folder | Status | Before Count | After Clean Books | Transferred to Exams | Transferred to Q&A | Duplicates / Non-Curriculum Deleted | Level Tagging Coverage | Completion Date |
|---|---|---|---|---|---|---|---|---|
| **Books/Additional Mathematics** | ✅ Audited | 19 | 21 | 0 | 0 | 0 | 100% MSCE | Nov 13, 2026 |
| **Books/Bible Knowledge** | ✅ Audited | 34 | 24 | 5 | 0 | 4 | 100% Explicit | Nov 25, 2026 |
| **Books/Agriculture** | ✅ Audited | 84 | 67 | 10 | 3 | 6 | 100% Explicit | Nov 25, 2026 |
| **Books/Biology** | ✅ Audited | 203 | 112 | 44 | 15 | 30 | 100% Explicit | Nov 26, 2026 |
| **Books/Business Studies** | ✅ Audited | 7 | 0 | 2 | 0 | 0 | 100% Explicit | Nov 26, 2026 |
| **Books/Chemistry** | ✅ Audited | 80 | 44 | 18 | 3 | 14 | 100% Explicit | Nov 26, 2026 |
| **Books/Chichewa** | ✅ Audited | 50 | 24 | 21 | 0 | 3 | 100% Explicit | Nov 26, 2026 |
| **Books/Computer studies** | ✅ Audited | 32 | 28 | 1 | 0 | 3 | 100% Explicit | Nov 26, 2026 |
| **Books/English** | ✅ Audited | 191 | 116 | 33 | 5 | 34 | 100% Explicit | Nov 26, 2026 |
| **Books/Geography** | ✅ Audited | 64 | 35 | 21 | 1 | 7 | 100% Explicit | Nov 26, 2026 |
| **Books/History** | ✅ Audited | 19 | 9 | 10 | 0 | 0 | 100% Explicit | Nov 27, 2026 |
| **Books/Home Economics** | ✅ Audited | 4 | 2 | 0 | 0 | 2 | 100% Explicit | Nov 27, 2026 |
| **Books/Life Skills** | ✅ Audited | 4 | 2 | 2 | 0 | 0 | 100% Explicit | Nov 26, 2026 |
| **Books/Mathematics** | ✅ Audited | 115 | 37 | 28 | 21 | 26 | 100% Explicit | Nov 27, 2026 |
| **Books/Physical Science** | ✅ Audited | 1 | 1 | 0 | 0 | 0 | 100% Explicit | Nov 27, 2026 |
| **Books/Physics** | ✅ Audited | 105 | 44 | 15 | 5 | 38 | 100% Explicit | Nov 27, 2026 |
| **Books/Social Studies** | ✅ Audited | 8 | 7 | 1 | 0 | 0 | 100% Explicit | Nov 27, 2026 |

---

## 📝 Detailed Folder Breakdown

### 1. Books/Additional Mathematics
- **Initial Count:** 19 files
- **Clean Books Retained:** 21 clean textbooks and modules (19 original + 2 transferred from Books/Mathematics: Additional Mathematics Students Book 4, and Chancellor College Additional Mathematics Module)
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
- **Clean Books Retained:** 37 clean textbooks, modular coursebooks, formula compendiums, and revision pamphlets (19 MSCE, 8 JCE, 10 Both; 2 Additional Mathematics textbooks transferred to Books/Additional Mathematics/)
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

### 14. Books/History
- **Initial Count:** 19 files
- **Clean Books Retained:** 9 clean textbooks, study notes, and essay guides (6 MSCE, 2 JCE, 1 Both)
- **Transferred to Exams:** 10 mock exams and past papers to `Exams/History/` on Bucket 2 (MANEB 2006 MSCE Paper 1, 2021 Robert Blake Cluster JCE Mock, 2026 CEED MSCE Mock Papers 1 & 2, 2025 Mangochi Catholic Diocese MSCE Mock Papers 1 & 2, 2026 Northern Education Division JCE Mock, 2025 Central West Education Division MSCE Mock Papers 1 & 2, MANEB JCE History Sample Paper)
- **Transferred to Q&A:** 0
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit (6 MSCE, 2 JCE, 1 Both)

### 15. Books/Home Economics
- **Initial Count:** 4 files
- **Clean Books Retained:** 2 clean textbooks and study notes (1 JCE, 1 MSCE: Home Economics Form 1 Study Notes, Achievers Home Economics Book 3)
- **Transferred to Exams:** 0
- **Transferred to Q&A:** 0
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 2 files (1 presidential parliamentary speech: State of the Nation Address SONA February 2026; 1 blank 6-word planning sheet template)
- **Level Tagging Coverage:** 100% Explicit (1 JCE, 1 MSCE)

### 16. Books/Social Studies
- **Initial Count:** 8 files
- **Clean Books Retained:** 7 clean coursebooks and modular study notes (2 JCE, 5 MSCE: Social Studies Form 1 Notes, Form 2 Notes by Ndacheredwa, Form 3 Notes by Holly, Forms 3 & 4 Notes by Holly, Form 4 Notes by Harrison Benala, MSCE Coursebook by Godfrey Mhango, Forms 3 & 4 Complete Notes)
- **Transferred to Exams:** 1 mock exam to `Exams/Social Studies/` on Bucket 2 (2026 Loyola Jesuit Secondary School JCE Social Studies Mock)
- **Transferred to Q&A:** 0
- **Transferred to Syllabuses:** 0
- **Deleted from R2:** 0
- **Level Tagging Coverage:** 100% Explicit (2 JCE, 5 MSCE)

### 17. Books/Physics
- **Initial Count:** 105 catalog files + 1 ghost key (MS Office temp file `~$20 physics 1 large print.docx`) = 106 total R2 objects audited
- **Clean Books Retained:** 44 physics textbooks, revision notes, and study guides with 100% explicit level tagging
  - **JCE (Form 1-2) books (17):** Excel and Succeed Physics Students Book 1, Excel and Succeed Physics Students Book 1 (Compact), Excel and Succeed Physics Students Book 2, Jhango Physics Students Book 1, Jhango Physics Students Book 2, JC Physics Study Notes - Form 2 (Junior Certificate), Physics Notes - Form 1, Physics Notes - Form 1 (Basic), Physics Notes - Form 2, Physics Study Notes - Form 1 (Core Curriculum), Physics Study Notes - Form 1 (Katsala, Syllabus Based), Physics Study Notes - Form 1 (Lisausyo), Physics Study Notes - Form 2 (Junior Certificate), Physics Study Notes - Form 2 (Lisausyo), Physics Study Notes - Form 2 (Temwanani Mweso, MZUNI), Physics Students Book 2 (Strides), Physics Study Notes - Forms 1 and 2 (Junior Level Core Elements)
  - **MSCE (Form 3-4) books (26):** Arise with Physics Students Book 4, Daud Adam Physical Science Password Forms 3 and 4 (x2 copies), Excel and Succeed Physics Students Book 3, Excel and Succeed Physics Students Book 4, Excel and Succeed Physics Students Book 4 (Condensed), Jhango Physical Science Students Book, Jhango Physics Students Book 3, Jhango Physics Students Book 4, Physics Blend - MSCE Candidate Companion (Fr. Benedict Zele), Physics Made Simple - Book 4 (Rashid Mabuka), Physics Notes - Form 3, Physics Notes - Form 3 Pamphlet (New Syllabus), Physics Notes - Form 4, Physics Notes - Form 4 (The Physics Master, New Hope Publications), Physics Notes - Form 4 (Thin Lenses and Optics), Physics Notes - Form 4 (Waves and Electronics), Physics Notes - Form 4 Topic 12 Nuclear Physics, Physics Notes - Nuclear Physics (Chimtawira), Physics Notes - Electricity and Electromagnetic Induction 2 (Electronics), Physics Pamphlet with Answers (Tupaseko, Musonda), Physics Short Notes - New Syllabus (All Forms), Physics Study Notes - Form 3 (L.M. Manda), Physics Study Notes - Form 3 (New Syllabus), Physics Teaching Notes - Form 4 (MSCE), Physics Theory Notes - Kugwetsa (Bonda Education Group), Target in Physics Students Book 3, Understanding MSCE Physics - Form 3 (Malango)
  - **Both levels (1):** Physics Short Notes - New Syllabus (All Forms)
- **Transferred to Exams:** 15 mock and past papers to `Exams/Physics/` on Bucket 2
  - 2018 St George Academy MSCE Mock - Physics Paper II (Practical)
  - 2019 Zomba Catholic MSCE Mock - Physics Paper II (Practical)
  - 2019-2020 Rumphi Education Cluster End of Term 1 - Physics Paper I (Form 4)
  - 2020 Northern Education Division MSCE Mock - Physics Paper I
  - 2021 Loyola Jesuit JCE Mock - Physics
  - 2021 Nkhamenya Cluster MSCE Mock - Physics Paper II (Practical)
  - 2021 St Marys MSCE Mock - Physics Paper II (Practical)
  - 2022 Mzuzu Diocese MSCE Mock - Physics Paper I
  - 2022 Nkhoma Synod MSCE Mock - Physics Paper I
  - 2022 Nkhoma Synod MSCE Mock - Physics Paper II (Practical)
  - 2022 Northern Education Division MSCE Mock - Physics Paper I
  - 2022 Northern Education Division MSCE Mock - Physics Paper II (Practical)
  - 2022 St Godfrey MSCE End of Term 1 - Physics Paper I
  - 2025 St Marys MSCE Post-Mock - Physics Paper I
  - MANEB MSCE Sample Paper - Physics Paper II (Practical)
- **Transferred to Q&A:** 5 topical question-and-answer sets to `Q&A/Physics/` on Bucket 2
  - Physics Topical Questions - Electricity 1 (MSCE year-tagged 2003-2012)
  - Physics Topical Questions - Magnetism and Electromagnetic Induction (MSCE year-tagged 2003-2012)
  - Physics Topical Questions - Oscillations and Waves (MSCE year-tagged 2004-2012)
  - Physics Topical Questions - Nuclear Physics (MSCE year-tagged 2003-2012)
  - Physics Q and A - Kudinkula Mwapa Eazy MSCE (Musonda-style)
- **Transferred to Syllabuses:** 3 official syllabus documents to `Books/Syllabuses/`
  - Physics Syllabus - Forms 1-2 (Malawi MoEST, 2013)
  - Physics Syllabus - Forms 3-4 (Malawi MoEST, 2013)
  - Physics Syllabus - Forms 3-4 (Zimbabwe O-Level, 2015-2022) [foreign reference copy]
- **Deleted from R2:** 38 files (duplicates, foreign curriculum, corrupt, non-student resources)
  - Duplicates removed: 03_Magnetisism duplicate, 05_Oscillations duplicate, 06_Nuclear_Physics duplicate, 11-NUCLEAR_PHYSICS garbled copy, Exel_and_succeed_Form_2 pair, EXCELL_PHYSICS_BOOK_2/3/4 giant uncompressed copies, Excel_Physics_Book_3-1 (81MB), Excel_physics_book_3_powered_by_Benzo, Jhango Book 3 pair (keeping corrected edition), Jhango_physicsBK_4_complete Copy, PHYSICS_NOTES_PDF_sense (exact duplicate), _PHYSICS_BOOK_4 (smaller duplicate), _PHYSICS_book 2 Copy, Form_4_Physics_Excell_and_succerd Copy, PHySICS BOOK 1-1 (89MB empty OCR), Physics_Book_1_Excel_and_Succeed_1 (31MB duplicate), Physics_book_4_excel (66MB duplicate), Target_In Physics Book 3 (41MB duplicate), The_Physics_of_Waves (empty OCR)
  - Foreign curriculum: Chimistry&physics (SA FHSST Grade 10), College Physics PDFDrive (university-level), 100_PHYSICS_QUESTIONS (Pakistani), IGCSE Physics (Edexcel UK), FORM 1 PHYSICS NOTES Copy (Kenyan/KASNEB), PHY 111 LUANAR (university-level), grem_physics_FOR_FORM_O (Form 0/primary)
  - Non-student resources: 2022 PHY II CONFIDENTIAL INSTRUCTION, PHYSICS_CONFIDENTIAL_INSTRUCTION, PHYCS REPORT (MANEB chief examiner report), ROBERT_BLAKE_PHYSICS_CONFIDENTIAL_2021
  - Corrupt/mislabelled: PHYSICS FORM 4 NOTES.docx (corrupt zip), physics_notes_F4 Copy (mislabelled - Chemistry content inside), 300_Physics_Formulas (foreign), EXCELL_PHYSICS_BOOK_4 (kept compressed version instead)
  - Ghost key (not in catalog): ~$20 physics 1 large print.docx (MS Office temp/lock file)
- **Level Tagging Coverage:** 100% Explicit (all 44 retained books have explicit `jce`, `msce`, or `both` level tags)
- **Catalog delta:** 2973 -> 2935 entries (38 deleted from catalog)
- **npm run ids:** 0 new IDs, 38 removed, 67 moved - clean

### 18. Books/Syllabus Reorganization (Subject Subfolders)
- **Goal:** Decentralize syllabuses so that each subject has its own dedicated `Syllabus/` subfolder (e.g., `Books/Biology/Syllabus/`) instead of bundling all syllabuses into a single global folder.
- **Operations:**
  - **Transferred to Subject Subfolders (24 files):**
    - `Books/Additional Mathematics/Syllabus/Additional Mathematics Syllabus Forms 3-4.doc`
    - `Books/Agriculture/Syllabus/Agriculture Form 3 New Syllabus.pdf`
    - `Books/Agriculture/Syllabus/Agriculture Syllabus Forms 3-4.doc`
    - `Books/Agriculture/Syllabus/Agriculture Syllabus Forms 3-4 (MoEST).pdf`
    - `Books/Agriculture/Syllabus/Agriculture Syllabus Forms 1-2.pdf`
    - `Books/Agriculture/Syllabus/Agriculture Syllabus Forms 3-4 (Extended, MoEST).pdf`
    - `Books/Bible Knowledge/Syllabus/Bible Knowledge Syllabus (Forms 3 and 4).pdf`
    - `Books/Biology/Syllabus/Biology Curriculum Syllabus.pdf`
    - `Books/Biology/Syllabus/Biology Syllabus (Forms 3 and 4).doc`
    - `Books/Business Studies/Syllabus/Business Studies Scope and Sequence Chart (Forms 1 to 4).doc`
    - `Books/Business Studies/Syllabus/Business Studies Syllabus (Forms 1 and 2).doc`
    - `Books/Business Studies/Syllabus/Business Studies Syllabus (Forms 3 and 4).doc`
    - `Books/Business Studies/Syllabus/Business Studies Teaching Syllabus (Forms 1 and 2).doc`
    - `Books/Business Studies/Syllabus/Business Studies Teaching Syllabus (Forms 3 and 4).doc`
    - `Books/Chemistry/Syllabus/Chemistry Senior Secondary Syllabus (Forms 3 and 4).pdf`
    - `Books/Chichewa/Syllabus/Chichewa Senior Secondary Syllabus (Forms 3 and 4).pdf`
    - `Books/Chichewa/Syllabus/Chichewa Syllabus (Forms 1 and 2).pdf`
    - `Books/English/Syllabus/English Senior Secondary Syllabus (Forms 3 and 4).doc`
    - `Books/English/Syllabus/English Syllabus (Forms 1 and 2).doc`
    - `Books/English/Syllabus/MANEB English Examination Syllabus.pdf`
    - `Books/Mathematics/Syllabus/Mathematics Syllabus Forms 3-4 (MIE 2013).doc`
    - `Books/Physics/Syllabus/Physics Syllabus - Forms 1-2 (Malawi MoEST, 2013).doc`
    - `Books/Physics/Syllabus/Physics Syllabus - Forms 3-4 (Malawi MoEST, 2013).doc`
    - `Books/Physics/Syllabus/Physics Syllabus - Forms 3-4 (Zimbabwe O-Level, 2015-2022).pdf`
  - **Retained in Central Syllabuses (1 file):**
    - `Books/Syllabuses/MANEB MSCE Examination Regulations and Syllabuses (July 2020).pdf` (216-page complete national multi-subject regulations handbook)
  - **Deleted from R2 (1 file):**
    - `EXAMINATONS_SYLLABI_1.pdf` (149-page truncated, incomplete duplicate scan of the MANEB handbook)

### 19. Ingestion of 14 New Academic Resources (Nov 27, 2026)
- **Goal:** Ingest user-provided high-value study guides, textbooks, and multi-year past paper compilations into the library.
- **New Additions Breakdown (14 files):**
  - **Books (4 files to Bucket 1):**
    - `Books/English/MSCE Revision English Language (Katoto Mtambo).pdf` (160 pages, Level: msce)
    - `Books/English/English Grammar Handbook (Katoto Mtambo).pdf` (104 pages, Level: both)
    - `Books/Agriculture/Excel and Succeed Agriculture Students Book 1.pdf` (222 pages, Level: jce)
    - `Books/Business Studies/Best Approach to Business Studies - Forms 3 and 4.pdf` (65 pages, Level: msce)
  - **Q&A (1 file to Bucket 2):**
    - `Q&A/Business Studies/Business Studies Questions and Answers for MSCE (Boko).pdf` (19 pages)
  - **Exams (9 multi-year compilations to Bucket 2):**
    - `Exams/Agriculture/MSCE Agriculture Past Papers (2001-2026).pdf` (395 pages)
    - `Exams/English/MANEB MSCE English Past Papers (2010-2026).pdf` (330 pages)
    - `Exams/Mathematics/MSCE Mathematics Past Papers (2000-2026).pdf` (671 pages)
    - `Exams/Geography/MSCE Geography Past Papers (2002-2026).pdf` (222 pages)
    - `Exams/Computer Studies/MSCE Computer Studies Past Papers (2006-2026).pdf` (319 pages)
    - `Exams/Biology/MANEB MSCE Biology Papers I and II (2000-2026).pdf` (443 pages)
    - `Exams/Physics/MSCE Physics Past Papers (2019-2026).pdf` (149 pages)
    - `Exams/Chemistry/All MSCE Chemistry Past Papers Compilation.pdf` (141 pages)
    - `Exams/French/MSCE French Papers I, II and III Past Papers Combined.pdf` (117 pages)
- **Library Catalog Total:** 2,948 entries reconciled with stable IDs

### 20. Ingestion of Business Studies Form 3 Notes and Mathematics Topical Model Answers (Nov 27, 2026)
- **New Additions Breakdown (2 files):**
  - **Books (1 file to Bucket 1):**
    - `Books/Business Studies/Business Studies Notes - Form 3 (2020).pdf` (44 pages, Level: msce)
  - **Q&A (1 file to Bucket 2):**
    - `Q&A/Mathematics/MSCE Mathematics Model Answers by Topic (Masiya and Malunga, 2nd Edition).pdf` (278 pages, topical worked solutions by Masiya Books)
- **Library Catalog Total:** 2,950 entries reconciled with stable IDs
