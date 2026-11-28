# Wylibrary Folder Cleanup & Audit Baseline Log

This log permanently records the **Before** and **After** baseline numbers for each subject folder during the deep library audit. 
The "After" number represents the clean, frozen count at the moment the folder audit was completed (separate from future additions).

---

## 📊 Subject Folder Audit Summary (Books)

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

## 📝 Exams Folder Audit Summary

| Subject Folder | Status | Before Count | After Clean Exams | Transferred to Books | Transferred to Q&A | Duplicates / Corrupt Deleted | Level Tagging Coverage | Completion Date |
|---|---|---|---|---|---|---|---|---|
| **Exams/Biology** | ✅ Audited | 332 | 318 | 2 | 6 | 6 | 100% Explicit (25 JCE, 117 MSCE, 176 Both) | Nov 28, 2026 |
| **Exams/Mathematics** | ✅ Audited | 272 | 260 | 2 | 4 (+1 to Add Maths) | 3 | 100% Explicit (39 JCE, 128 MSCE, 93 Both) | Nov 28, 2026 (12m 22s) |
| **Exams/Chemistry** | ✅ Audited | 259 | 240 | 1 | 1 (+3 cross-subject) | 13 | 100% Explicit (34 JCE, 106 MSCE, 100 Both) | Nov 28, 2026 (12m 05s) |
| **Exams/English** | ✅ Audited | 251 | 240 | 7 | 2 | 2 | 100% Explicit (47 JCE, 161 MSCE, 32 Both) | Nov 28, 2026 |
| **Exams/Agriculture** | ✅ Audited | 187 | 179 | 0 | 1 | 7 | 100% Explicit (26 JCE, 151 MSCE, 2 Both) | Nov 28, 2026 |
| **Exams/Physics** | ✅ Audited | 178 | 166 | 1 | 3 (+7 to Physical Science) | 1 | 100% Explicit (21 JCE, 145 MSCE, 0 Both) | Nov 28, 2026 |
| **Exams/Geography** | ✅ Audited | 156 | 152 | 1 | 0 | 4 | 100% Explicit (22 JCE, 130 MSCE, 0 Both) | Nov 28, 2026 |
| **Exams/Chichewa** | ✅ Audited | 153 | 149 | 0 | 0 | 4 | 100% Explicit (33 JCE, 116 MSCE, 0 Both) | Nov 28, 2026 |
| **Exams/History** | ✅ Audited | 93 | 101 | 0 | 1 | 2 (+10 from zip) | 100% Explicit (31 JCE, 70 MSCE, 0 Both) | Nov 28, 2026 |
| **Exams/Bible Knowledge** | ✅ Audited | 75 | 74 | 0 | 0 | 1 | 100% Explicit (17 JCE, 57 MSCE, 0 Both) | Nov 28, 2026 |
| **Exams/Computer Studies** | ✅ Audited | 46 | 45 | 1 | 0 | 0 | 100% Explicit (7 JCE, 38 MSCE, 0 Both) | Nov 28, 2026 |

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

### 21. Ingestion of Social Studies Book 1 & Upgraded Physics Book 3 (Nov 27, 2026)
- **New Additions Breakdown:**
  - `Books/Social Studies/Arise with Social Studies Students Book 1.pdf` (187 pages, Level: jce, Bucket 1)
  - Upgraded `Books/Physics/Target in Physics Students Book 3.pdf` with clearer 41.2 MB scan (replacing older 37.8 MB scan).
- **Library Catalog Total:** 2,951 entries

### 22. Password Lock Audit & Removal of Locked Kugwetsa Papers (Nov 27, 2026)
- **Context:** Student reported locked documents in the library. Inspection confirmed 5 commercial mock papers from the 2025 Kugwetsa drop were encrypted with user passwords.
- **Removed from R2 and Catalog (5 files):**
  - `Exams/Biology/Kugwetsa MSCE Biology Practical Exam (2025).pdf`
  - `Exams/Biology/Kugwetsa MSCE Biology Theory Exam (2025).pdf`
  - `Exams/Physics/2025 Kugwetsa physics practical 🔥🔥_1.pdf`
  - `Exams/Physics/PHYSICS KUGWETSA THEORY-1-1_1.pdf`
  - `Q&A/Chemistry/2025 kugwetsa chemistry practical sample-1_1.pdf`
- **Library Catalog Total:** 2,946 entries

### 23. Library-Wide Automated PDF Lock Scan Benchmark (Nov 27, 2026)
- **Tool:** `scripts/scan-pdf-locks.py` using asynchronous HTTP byte-range requests (last 4 KB per PDF) with concurrency of 25 connections.
- **Scope:** 2,094 PDF files (out of 2,946 total catalog entries; remaining 852 are `.docx`, `.pptx`, `.zip`).
- **Performance Benchmark:**
  - **Total PDFs Scanned:** 2,094
  - **Total Elapsed Time:** 121.38 seconds (2.02 minutes)
  - **Average Throughput:** 17.3 files/second
  - **Total Data Transferred:** 8.13 MB (efficient trailer-only range sampling)
- **Findings:**
  - **Locked files found:** 0
  - **Accessible:** 100% of all PDF resources in Wylibrary are completely open and readable.
- **Safeguard Added:** Automated sub-20ms password detection integrated directly into `scripts/ingest.mjs` to block any future locked files at ingest time.

### 24. Exams/Biology Folder Audit (Nov 28, 2026)
- **Initial Count:** 332 files (281 in `Exams/Biology/`, 51 in `Exams/Biology/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 318 clean examination papers (25 JCE, 117 MSCE, 176 Both)
- **Transferred to Books (2 files to Bucket 1):**
  - `Books/Biology/MSCE Biology Form 3 Study Notes (Paul Nsona).pdf` (164 pages complete curriculum textbook)
  - `Books/Biology/MSCE Biology Form 4 Study Notes (Paul Nsona).pdf` (102 pages complete curriculum textbook)
- **Transferred to Q&A (6 files to Bucket 2):**
  - `Q&A/Biology/MSCE Biology Topical Questions and Model Answers (Thokozanie Mkandawire).pdf` (183 pages comprehensive topical question bank)
  - `Q&A/Biology/MSCE Biology Questions and Suggested Solutions (Team Legends).pdf` (66 pages worked solutions)
  - `Q&A/Biology/MSCE Biology MANEB Past Essay Questions.pdf` (targeted essay questions)
  - `Q&A/Biology/MSCE Biology Topical Questions - Genetics (Whosper).pdf` (10 pages genetics revision workbook)
  - `Q&A/Biology/MSCE Biology Practical Questions and Answers 2025 (Sir Chidzara).pdf` (16 pages practical Q&A)
  - `Q&A/Biology/MSCE Biology Past Papers Questions Analysis and Solutions (2003-2013).pdf` (169 pages past papers worked solutions)
- **Deleted from R2 (6 files from Bucket 2):**
  - `Exams/Biology/2020_BIOLOGY_PAPER_I-1.pdf` (0-byte corrupt upload remnant)
  - `Exams/Biology/2024_Biology_P2_Maneb-1.pdf` (exact byte duplicate of `2024 MANEB Biology II.pdf`)
  - `Exams/Biology/Bio MSCE paper MANNEB_1.zip` (raw zip archive containing non-biology setbooks and duplicates)
  - `Exams/Biology/biology past p_1.zip` (50.3 MB raw zip drop of 60 individual files already in library, plus foreign Kenyan papers)
  - `Exams/Biology/2024 MADISI CLUSTER BIO JCE MOCK_1.pdf` (duplicate 450KB copy of Madisi Cluster Mock)
  - `Exams/Biology/2022 JCE BIO MANEB_1.pdf` (duplicate 4.0MB scan of 2022 MANEB JCE Biology)
- **Renamed within Exams (46 files):**
  - Standardized all cryptic filenames, stripping raw suffixes (`_1`, `(1)`, `-Copy`), Unicode Roman numerals (`Ⅰ`, `Ⅱ` -> `I`, `II`), and uninformative abbreviations to clean titles.
- **Q&A Normalization (1 file):**
  - Renamed `Q&A/Biology/BIOLOGY_ESSAY_QUESTIONS_AND_ANSWERS(1)-1-1-2-2-1.pdf` -> `Q&A/Biology/MSCE Biology Essay Questions and Answers (Thokozanie Mkandawire).pdf`
- **Catalog delta:** 2,946 -> 2,940 entries. Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,939 kept, 55 moved, 6 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (25 JCE, 117 MSCE, 176 Both).

### 25. Exams/Mathematics Folder Audit (Nov 28, 2026) [Timed Benchmark: 12m 22s]
- **Timing & Throughput:**
  - **Started:** 00:23:58 CAT
  - **Completed:** 00:36:20 CAT
  - **Total Elapsed Duration:** 12 minutes 22 seconds (742 seconds)
  - **Scope:** 272 files deep-scanned, 3 deleted from R2, 2 transferred to Books, 1 transferred to Additional Maths, 4 transferred to Q&A, and 118 files renamed in R2 and dual catalogs.
- **Initial Count:** 272 files (230 in `Exams/Mathematics/`, 42 in `Exams/Mathematics/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 260 clean examination papers (39 JCE, 128 MSCE, 93 Both)
- **Transferred to Books (2 files to Bucket 1):**
  - `Books/Mathematics/MSCE Mathematics Form 3 Study Notes.pdf` (125 pages complete senior secondary textbook)
  - `Books/Mathematics/MSCE Mathematics Form 4 Study Notes.pdf` (89 pages complete senior secondary textbook)
- **Transferred to Additional Mathematics (1 file to Bucket 2):**
  - `Exams/Additional Mathematics/2025 MSCE Additional Mathematics Paper I Mock Exam.pdf` (15 pages mock exam)
- **Transferred to Q&A (4 files to Bucket 2):**
  - `Q&A/Mathematics/MSCE Mathematics Paper 2 - Coordinate Geometry Model Solutions.pdf` (topical worked solutions)
  - `Q&A/Mathematics/MSCE Mathematics Paper 1 Topical Worked Answers.pdf` (58 pages topical worked solutions)
  - `Q&A/Mathematics/MSCE Mathematics Practice Questions and Model Answers (MIE).pdf` (71 pages worked practice book by MIE)
  - `Q&A/Mathematics/MSCE Mathematics Questions and Answers Compilation.pdf` (131 pages worked questions and answers book)
- **Deleted from R2 (3 files from Bucket 2):**
  - `Exams/Mathematics/2015%20MATHS%20MSCE%20MOCK%20EXAMS-1.pdf` (131-byte corrupt upload remnant)
  - `Exams/Mathematics/MSCE_MATHS_MODEL_ANS_(1990-2021) - Copy - Copy_1.pdf` (8.9 MB exact duplicate of Masiya Model Answers already in Q&A)
  - `Exams/Mathematics/MATHEMATICS_PSLCE_2010-2021_QUESTIONS_&_MODEL_ANSWERS_1.pdf` (primary school Standard 8 past papers booklet)
- **Renamed within Exams (118 files):**
  - Standardized all cryptic filenames, stripping raw suffixes (`_1`, `(1)`, `-Copy`, `%20`), Unicode Roman numerals (`Ⅰ`, `Ⅱ` -> `I`, `II`), and uninformative abbreviations to clean titles.
- **Catalog delta:** 2,940 -> 2,935 entries. Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,817 kept, 118 moved, 5 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (39 JCE, 128 MSCE, 93 Both).

### 26. Exams/Chemistry Folder Audit (Nov 28, 2026) [Timed Benchmark: 12m 05s]
- **Timing & Throughput:**
  - **Started:** 00:43:45 CAT
  - **Completed:** 00:55:50 CAT
  - **Total Elapsed Duration:** 12 minutes 05 seconds (725 seconds)
  - **Scope:** 259 files deep-scanned, 13 deleted from R2, 1 transferred to Books, 1 transferred to Q&A, 3 transferred to cross-subjects (Maths/Physics), and 70 files renamed in R2 and dual catalogs.
- **Initial Count:** 259 files (198 in `Exams/Chemistry/`, 61 in `Exams/Chemistry/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 240 clean examination papers (34 JCE, 106 MSCE, 100 Both)
- **Transferred to Books (1 file to Bucket 1):**
  - `Books/Chemistry/MSCE Chemistry Form 4 Study Notes.pdf` (81 pages complete senior secondary textbook)
- **Transferred to Q&A (1 file to Bucket 2):**
  - `Q&A/Chemistry/Complete MSCE Chemistry Questions and Answers (Gelson Kalombola).pdf` (72 pages comprehensive Q&A book)
- **Cross-Subject Transfers (3 files to Bucket 2):**
  - `Exams/Mathematics/Marking Keys/MSCE Mathematics Paper I Marking Scheme.docx` (transferred from Chemistry)
  - `Exams/Physics/Marking Keys/MSCE Physics Paper I Marking Scheme.docx` (transferred from Chemistry)
  - `Exams/Physics/Marking Keys/MSCE Physics Paper I Marking Scheme.pdf` (transferred from Chemistry)
- **Deleted from R2 (13 files from Bucket 2):**
  - `Exams/Chemistry/END OF TERM RESULTS FORM 3 CHEMISTRY.pdf` (private student names, marks, and percentages marksheet)
  - `Exams/Chemistry/chemistry form 4_1.pdf` (handwritten student grade roster)
  - `Exams/Chemistry/Marking Keys/KASUNGU DISTRICT SCHEMES FORM 1 TO 4 (MR MTAMBO 2024-2025)_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/SCHEMES OF WORK TERM 2_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/SCHEMESWORD_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/Schemes term1_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/TERM 1 SCHEMES_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/Term 2 schemes mzimba north_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/Term 3 schemes secondary _1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/schemes for term 1_1.zip` (teachers' term lesson planning scheme of work)
  - `Exams/Chemistry/Marking Keys/SCHEME OF WORK FORM 3 T3.docx` (teacher lesson plan template)
  - `Exams/Chemistry/2025_Chemistry_P1_Maneb-1.pdf` (exact duplicate of 2025 MSCE CHEMISTRY MANEB.pdf)
  - `Exams/Chemistry/Marking Keys/Chemistry II  2026 SEED MOCK PROVISIONAL MARKING KEY.doc` (exact duplicate of Chemistry II 2026 SEED MOCK PROVISIONAL MARKING KEY.pdf)
- **Renamed within Exams (70 files):**
  - Standardized all cryptic filenames, stripping raw suffixes (`_1`, `(1)`, `-Copy`), and uninformative abbreviations to clean titles.
- **Catalog delta:** 2,935 -> 2,921 entries. Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,847 kept, 74 moved, 0 renamed, 0 new, 14 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (34 JCE, 106 MSCE, 100 Both).

### 27. Exams/English Folder Audit (Nov 28, 2026)
- **Scope:** 251 files deep-scanned, 2 deleted from R2, 7 transferred to Books, 2 transferred to Q&A, 5 internal marking scheme moves, and 156 files renamed in R2 and dual catalogs (161 renames total).
- **Initial Count:** 251 files (all on Bucket 2)
- **Clean Exams Retained:** 240 clean examination papers (47 JCE, 161 MSCE, 32 Both)
- **Transferred to Books (7 files to Bucket 1):**
  - `Books/English/MSCE English Grammar Study Guide (Wongani Chipeta).pdf` (1.5 MB complete study guide)
  - `Books/English/The Farlex Grammar Book - Complete English Grammar Rules.pdf` (3.6 MB grammar textbook)
  - `Books/English/MSCE English Grammar Notes (Katoto Secondary School).pdf` (6.5 MB school grammar textbook)
  - `Books/English/MSCE English Grammar Form 3 and 4 Study Notes.pdf` (1.5 MB senior secondary study notes)
  - `Books/English/CEED English Teachers and Students Training Manual.docx` (80 KB training manual)
  - `Books/English/JCE English Book for Success (Griffin Theu).pdf` (1.9 MB 125-page textbook)
  - `Books/English/MSCE English Grammar (Katoto Mtambo).pdf` (102.3 MB 154-page comprehensive grammar textbook)
- **Transferred to Q&A (2 files to Bucket 2):**
  - `Q&A/English/MSCE English Macbeth Essay Questions Compilation (M.J. MASS).pdf` (essay questions compilation)
  - `Q&A/English/MSCE English Macbeth Test Preparation and Practice Questions.pdf` (38-page test preparation guide)
- **Internal Moves to Marking Keys (5 files within Bucket 2):**
  - `Exams/English/Marking Keys/2026 SHED MSCE English Paper III Marking Scheme.docx`
  - `Exams/English/Marking Keys/2026 SHED MSCE English Paper III Provisional Marking Scheme (Draft).docx`
  - `Exams/English/Marking Keys/2026 SHED MSCE English Paper III Marking Scheme.pdf`
  - `Exams/English/Marking Keys/2026 SHED MSCE English Paper II Marking Scheme.docx`
  - `Exams/English/Marking Keys/2026 SHED MSCE English Paper II Marking Scheme.pdf`
- **Deleted from R2 (2 files from Bucket 2):**
  - `Exams/English/2025 English SHED MOCK.zip` (91 KB archive whose 3 standalone documents were already present in catalog)
  - `Exams/English/2022_ENGLISH_PAPER_III(0).pdf` (exact duplicate of 2022_ENGLISH_PAPER_III(0)_(1).pdf)
- **Renamed within Exams (156 files):**
  - Standardized cryptic filenames, stripped raw suffixes (`_1`, `(1)`, `kk_1`), and normalized naming according to the curriculum standard.
- **Catalog delta:** 2,921 -> 2,919 entries (-2 deleted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,749 kept, 170 moved, 0 renamed, 0 new, 2 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (47 JCE, 161 MSCE, 32 Both).

### 28. Exams/Agriculture Folder Audit (Nov 28, 2026)
- **Scope:** 187 files deep-scanned, 7 deleted from R2, 1 transferred to Q&A, 2 internal marking scheme moves from root, 1 corrupted docx repaired on R2, and 174 files renamed in R2 and dual catalogs (177 renames/marking moves total).
- **Initial Count:** 187 files (154 in `Exams/Agriculture/`, 33 in `Exams/Agriculture/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 179 clean examination papers (26 JCE, 151 MSCE, 2 Both)
- **Transferred to Q&A (1 file to Bucket 2):**
  - `Q&A/Agriculture/JCE Agriculture Questions and Model Answers (ChitsekoFH).pdf` (3.0 MB, 71 pages comprehensive Q&A book)
- **Internal Moves to Marking Keys (2 files within Bucket 2):**
  - `Exams/Agriculture/Marking Keys/2019 MANEB MSCE Agriculture Chief Examiners Report Paper I and II.pdf`
  - `Exams/Agriculture/Marking Keys/2021 MANEB MSCE Agriculture Chief Examiners Report Paper I and II.pdf`
- **Repaired on R2 (1 file):**
  - `Exams/Agriculture/Marking Keys/Form 3 Agriculture Paper 1 Marking Key.docx` (resolved CRC image corruption while preserving full 129 paragraphs of exam marking scheme)
- **Deleted from R2 (7 files from Bucket 2):**
  - `Exams/Agriculture/H` (1-byte empty dummy file)
  - `Exams/Agriculture/MSCE Questions and Model Answera Agric KAMPHONJE.pdf` (exact duplicate of Kamphonje Q&A already preserved in Q&A/Agriculture)
  - `Exams/Agriculture/JCE AGRICULTURE QUESTIONS & ANSWERS_1.pdf` (incomplete 26-page partial excerpt of ChitsekoFH 71-page Q&A)
  - `Exams/Agriculture/AGRICULTURE_4&3_COMBINED-1-1-1-1-1_(1).pdf` (duplicate of 114-page senior secondary textbook already in Books/Agriculture)
  - `Exams/Agriculture/AGRICULTURE_4&3_COMBINED.pdf` (duplicate of 114-page senior secondary textbook already in Books/Agriculture)
  - `Exams/Agriculture/2026 CEED AGRICULTURE II .pdf` (duplicate copy with trailing whitespace in filename)
  - `Exams/Agriculture/2026 CEED AGRICULTURE I.rtf.pdf` (incomplete 6-page draft of CEED Biology Paper I misfiled in Agriculture)
- **Renamed within Exams (174 files):**
  - Standardized all cryptic filenames, corrected size metadata for `2022 Form 4 MSCE Agriculture Paper II Term 3 Mock Exam.pdf`, stripped raw upload suffixes (`_1`, `(1)`, `-Copy`), and normalized titles according to curriculum standards.
- **Catalog delta:** 2,919 -> 2,912 entries (-7 deleted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,734 kept, 178 moved, 0 renamed, 0 new, 7 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (26 JCE, 151 MSCE, 2 Both).

### 29. Exams/Physics Folder Audit (Nov 28, 2026)
- **Scope:** 178 files deep-scanned, 1 deleted from R2, 1 transferred to Books (Bucket 1), 3 transferred to Q&A (Bucket 2), 7 transferred to Exams/Physical Science (Bucket 2), 3 internal moves to Marking Keys, and 163 clean renames across Exams/Physics/ and Marking Keys/ (166 clean Physics retained).
- **Initial Count:** 178 files (146 in root `Exams/Physics/`, 32 in `Exams/Physics/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 166 clean examination papers (21 JCE, 145 MSCE, 0 Both)
- **Transferred to Books (1 file cross-bucket to Bucket 1):**
  - `Books/Physics/Senior Secondary Physics Experiments Manual.pdf` (2.1 MB, 146 pages comprehensive syllabus experiments guide)
- **Transferred to Q&A (3 files to Bucket 2):**
  - `Q&A/Physics/Senior Secondary School Physics Model Questions and Answers (Kumwenda).pdf` (3.1 MB, 122 pages revision book)
  - `Q&A/Physics/MSCE Physical Science Past Papers Questions Analysis and Solutions (2003-2013).pdf` (11.1 MB, 179 pages past papers analysis)
  - `Q&A/Physics/MSCE Physical Science Revision Questions and Answers (St Michaels).pdf` (1.9 MB, 72 pages St Michaels revision book)
- **Transferred to Exams/Physical Science (7 files within Bucket 2):**
  - `Exams/Physical Science/1999 MANEB MSCE Physical Science Paper II.pdf`
  - `Exams/Physical Science/2002 MANEB MSCE Physical Science Paper I.pdf`
  - `Exams/Physical Science/2008 MANEB MSCE Physical Science Paper II.pdf`
  - `Exams/Physical Science/2015 MANEB MSCE Physical Science Paper I.doc`
  - `Exams/Physical Science/2017 MANEB MSCE Physical Science Paper I.docx`
  - `Exams/Physical Science/2018 MANEB MSCE Physical Science Paper II.pdf`
  - `Exams/Physical Science/Balaka Mock MSCE Physical Science Paper II.docx`
- **Internal Moves to Marking Keys (3 files within Bucket 2):**
  - `Exams/Physics/Marking Keys/2022 MANEB MSCE Physics Chief Examiners Report Paper I.pdf`
  - `Exams/Physics/Marking Keys/2020 MANEB MSCE Physics Chief Examiners Report Paper I.doc`
  - `Exams/Physics/Marking Keys/2020 MANEB MSCE Physics Chief Examiners Report Paper II.doc`
- **Deleted from R2 (1 file from Bucket 2):**
  - `Exams/Physics/2024 SHED MSCE PHYSICS MOCK PAPER 2.pdf` (16 KB, 1-page cover dummy stub; full 7-page paper preserved from (1).pdf)
- **Renamed within Exams (163 files):**
  - Stripped raw upload suffixes (`_1`, `(1)`, `-1-1`), eliminated double spaces, normalized unicode Roman numerals (`I`/`II`), and standardized titles according to Malawian secondary curriculum standards.
- **Catalog delta:** 2,918 -> 2,917 entries (-1 deleted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,742 kept, 175 moved, 0 renamed, 0 new, 1 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (21 JCE, 145 MSCE, 0 Both).

### 30. Exams/Geography Folder Audit (Nov 28, 2026)
- **Scope:** 156 files deep-scanned, 1 zip archive extracted to standalone PDF (`2002-2022 MANEB MSCE Human Geography Past Papers Compilation (R Walapa).pdf`, 58.8 MB), 4 files deleted from R2, 1 transferred to Books (Bucket 1), 1 internal move to Marking Keys, and 150 clean renames across Exams/Geography/ and Marking Keys/ (152 clean Geography retained).
- **Initial Count:** 156 files (144 in root `Exams/Geography/`, 12 in `Exams/Geography/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 152 clean examination papers (22 JCE, 130 MSCE, 0 Both)
- **Transferred to Books (1 file cross-bucket to Bucket 1):**
  - `Books/Geography/Complete JCE Geography Notes and Map Work (GGK Production).pdf` (8.2 MB, 127 pages comprehensive curriculum module by G. Mhango)
- **Extracted from Zip Archive (1 file added to Bucket 2):**
  - `Exams/Geography/2002-2022 MANEB MSCE Human Geography Past Papers Compilation (R Walapa).pdf` (58.8 MB extracted standalone PDF)
- **Deleted from R2 (4 files from Bucket 2):**
  - `Exams/Geography/2026 SHIRE HIGHLANDS GEOGRAPHY P1.zip` (Redundant container; all 5 contained mock exam files are already standalone in catalog)
  - `Exams/Geography/Geography_Paper_1_Q (1).pdf` (Exact duplicate of Geography_Paper_1_Q.pdf - 2020 Nsanje District Mock)
  - `Exams/Geography/Geography I 2026 SEED MOCK.doc` (Incomplete duplicate missing front page; Geography I 2026 SEED MOCK -front page.doc has full exam)
  - `Exams/Geography/Human Geography MSCE Maneb Paper.zip` (Redundant zip archive superseded by extracted standalone PDF)
- **Internal Moves to Marking Keys (1 file within Bucket 2):**
  - `Exams/Geography/Marking Keys/2019 MANEB MSCE Geography Chief Examiners Report Paper II.pdf`
- **Renamed within Exams (150 files):**
  - Stripped raw upload suffixes (`_1`, `(1)`), eliminated double spaces, standardized paper designations (Paper I / Paper II), and normalized titles according to Malawian secondary curriculum standards.
- **Catalog delta:** 2,917 -> 2,914 entries (-3 net: -4 deleted, +1 extracted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,764 kept, 149 moved, 0 renamed, 1 new, 4 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (22 JCE, 130 MSCE, 0 Both).

### 31. Exams/Chichewa Folder Audit (Nov 28, 2026)
- **Scope:** 153 files deep-scanned, 4 deleted from R2, 1 misplaced marking key moved from root to Marking Keys, 4 SHED marking scheme files moved to Marking Keys, and 149 clean renames across Exams/Chichewa/ and Marking Keys/ (149 clean Chichewa retained).
- **Initial Count:** 153 files (125 in root `Exams/Chichewa/`, 28 in `Exams/Chichewa/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 149 clean examination papers (33 JCE, 116 MSCE, 0 Both)
- **Deleted from R2 (4 files from Bucket 2):**
  - `Exams/Chichewa/2022 CHICHEWA FOR KASUNGU DISTRICT EXAMINATIONS BOARD STD 8.pdf` (Primary school PSLCE exam - KADEB Standard 8, not secondary curriculum)
  - `Exams/Chichewa/Kamuzu Barracks Chichewa Mock Examination.docx` (Primary school mock exam - Kamuzu Barracks Primary School 2018-19, not secondary curriculum)
  - `Exams/Chichewa/2022  JCE CHICHEWA PAPER I  MOCK.pdf` (Exact duplicate of 2022 Aiming High Private Secondary JCE Paper I - identical 9-page exam)
  - `Exams/Chichewa/MSCE CHICHEWA PAPER I - MAFUNSO- edited.docx` (Edited duplicate of MSCE CHICHEWA PAPER I - MAFUNSO.pdf - both are 2025 CWED Paper I)
- **Internal Moves to Marking Keys (5 files within Bucket 2):**
  - `Exams/Chichewa/Chichewa III 2026 SEED MOCK MARKING_KEY.doc` (misplaced marking key in root)
  - `Exams/Chichewa/2026 SHED CHICHEWA MS P1.docx` (marking scheme)
  - `Exams/Chichewa/2026 SHED CHICHEWA MS P1.pdf` (marking scheme)
  - `Exams/Chichewa/2026 SHED MOCK CHICHEWA MS P2.docx` (marking scheme)
  - `Exams/Chichewa/2026 SHED MOCK CHICHEWA MS P2.pdf` (marking scheme)
- **Renamed within Exams (149 files):**
  - Stripped raw upload suffixes (`_1`, `(1)`, `-1`), eliminated double spaces, removed archivetemp prefix, standardized paper designations (Paper I / Paper II / Paper III), and normalized titles according to Malawian secondary curriculum standards. The two large past paper compilations (MANEB MSCE 70 MB, MANEB JCE 30 MB) are retained with clean names.
- **Catalog delta:** 2,914 -> 2,910 entries (-4 deleted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,763 kept, 147 moved, 0 renamed, 0 new, 4 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (33 JCE, 116 MSCE, 0 Both).

### 32. Exams/History Folder Audit (Nov 28, 2026)
- **Scope:** 93 files deep-scanned, 1 zip archive extracted to 10 standalone JCE past papers (`2008-2024 MANEB JCE History Papers`), 1 zip container deleted from R2, 1 transferred to Q&A (`MSCE History Questions and Model Answers.pdf`, 68.7 MB), 3 internal moves to Marking Keys, and 91 clean renames across Exams/History/ and Marking Keys/ (101 clean History retained).
- **Initial Count:** 93 files (68 in root `Exams/History/`, 25 in `Exams/History/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 101 clean examination papers (31 JCE, 70 MSCE, 0 Both)
- **Transferred to Q&A (1 file within Bucket 2):**
  - `Q&A/History/MSCE History Questions and Model Answers.pdf` (68.7 MB comprehensive model exam answers compilation)
- **Extracted from Zip Archive (10 files added to Bucket 2):**
  - `Exams/History/2008 MANEB JCE History Paper.pdf`
  - `Exams/History/2009 MANEB JCE History Paper.pdf`
  - `Exams/History/2010 MANEB JCE History Paper.pdf`
  - `Exams/History/2011 MANEB JCE History Paper.pdf`
  - `Exams/History/2015 MANEB JCE History Paper.pdf`
  - `Exams/History/2016 MANEB JCE History Paper.pdf`
  - `Exams/History/2021 MANEB JCE History Paper.pdf`
  - `Exams/History/2022 MANEB JCE History Paper 2.pdf`
  - `Exams/History/2023 MANEB JCE History Paper 2.pdf`
  - `Exams/History/2024 MANEB JCE History Paper.pdf`
- **Deleted from R2 (1 file from Bucket 2):**
  - `Exams/History/HISTORY JCE PAST PAPERS.zip` (Redundant zip container; 10 contained past papers extracted as standalone PDFs)
- **Internal Moves to Marking Keys (3 files within Bucket 2):**
  - `Exams/History/Marking Keys/2025 CWED MSCE History Paper I Mock Exam Marking Key.docx`
  - `Exams/History/Marking Keys/2025 CWED MSCE History Paper II Mock Exam Marking Key.docx`
  - `Exams/History/Marking Keys/2025 CWED MSCE History Paper II Mock Exam Marking Key.pdf`
- **Renamed within Exams (91 files):**
  - Cleaned `History_PII_-_Final_Copy.pdf` (clearing library audit flag), removed raw upload suffixes (`_1`, `(1)`, `(2)`, `25252525`), eliminated double spaces, and standardized titles according to Malawian secondary curriculum standards.
- **Level Tagging Coverage:** 100% Explicit (31 JCE, 70 MSCE, 0 Both).

### 33. Exams/Bible Knowledge Folder Audit (Nov 28, 2026)
- **Scope:** 75 files deep-scanned, 1 personal student invoice receipt deleted from R2, 2 internal moves to Marking Keys, and 74 clean renames across Exams/Bible Knowledge/ and Marking Keys/ (74 clean Bible Knowledge retained).
- **Initial Count:** 75 files (51 in root `Exams/Bible Knowledge/`, 24 in `Exams/Bible Knowledge/Marking Keys/`, all on Bucket 2)
- **Clean Exams Retained:** 74 clean examination papers (17 JCE, 57 MSCE, 0 Both)
- **Deleted from R2 (1 file from Bucket 2):**
  - `Exams/Bible Knowledge/Invoice-2026MSCE-ISAIAH-NGULUWE-30612072601557_1.pdf` (Personal MANEB MSCE candidate exam entry invoice fee receipt - personal clutter)
- **Internal Moves to Marking Keys (2 files within Bucket 2):**
  - `Exams/Bible Knowledge/Marking Keys/2026 SHED MSCE Bible Knowledge Paper II Marking Key.docx`
  - `Exams/Bible Knowledge/Marking Keys/2026 SHED MSCE Bible Knowledge Paper II Marking Key.pdf`
- **Renamed within Exams (74 files):**
  - Stripped raw upload suffixes (`_1`, `111111`, `edited`), standardized paper numbers (Paper I / Paper II), and normalized titles according to curriculum standards.
- **Level Tagging Coverage:** 100% Explicit (17 JCE, 57 MSCE, 0 Both).

### 34. Exams/Computer Studies Folder Audit (Nov 28, 2026)
- **Scope:** 46 files deep-scanned across duplicate folders (`Exams/Computer studies` [42] and `Exams/Computer Studies` [4]), 1 reference manual transferred to Books (`Books/Computer studies/500+ Computer Shortcuts for PC.pdf`), unified 100% of files under standard capitalized directory `Exams/Computer Studies/` (eliminating library casing inconsistency), and 45 clean renames across Exams and Marking Keys (45 clean Computer Studies retained).
- **Initial Count:** 46 files (42 in `Exams/Computer studies/`, 4 in `Exams/Computer Studies/`)
- **Clean Exams Retained:** 45 clean examination papers (7 JCE, 38 MSCE, 0 Both)
- **Transferred to Books (1 file cross-bucket to Bucket 1):**
  - `Books/Computer studies/500+ Computer Shortcuts for PC.pdf` (47-page reference book)
- **Folder Casing Normalization:**
  - Unified all 42 files from lowercase `Exams/Computer studies/` into standard `Exams/Computer Studies/`, resolving the folder casing inconsistency warning.
- **Renamed within Exams (45 files):**
  - Stripped raw upload suffixes (`_1`, `-1`), clarified institutional mocks (CEED, SHED, Bwaila, Machinga, Marymount, NED, Nagwengwere, Lilongwe Girls), and normalized titles.
- **Catalog delta (Batch 1 total):** 2,910 -> 2,918 entries (+8 net: -2 deleted, +10 extracted). Dual catalogs synchronized byte-for-byte (`files-index.json` and `public/files-index.json`).
- **Stable IDs:** 2,917 kept, 1 moved, 0 renamed, 0 new, 0 removed recorded in `public/id-map.json`.
- **Level Tagging Coverage:** 100% Explicit (7 JCE, 38 MSCE, 0 Both).




