# Where these manuals came from

**These files are a snapshot, not a live feed.** They were pulled from SharePoint
on **2026-07-10** and committed to this repo. Nothing re-fetches them, so if a
course manual is revised in SharePoint the portal keeps serving the old one until
someone repeats the steps below.

Source library (all paths below are relative to it):

**[Open the source library in SharePoint](https://gravitygh.sharepoint.com/sites/GravityGH/Gravity%20GH/Forms/AllItems.aspx?id=%2Fsites%2FGravityGH%2FGravity%20GH%2FGravity%20Data%2FGravity%20Training%2FB%20Training%2FDesign%20and%20Development%2FGravity%20Internal%20Training%20Course%20Material)**

> `gravitygh.sharepoint.com/sites/GravityGH` → Gravity GH → Gravity Data →
> Gravity Training → B Training → Design and Development →
> **Gravity Internal Training Course Material**

Each course has its own folder there, with the manual under a `Manual/`
subfolder (older ones sit in `Manual/Previous Revision/` or `Archive/`).

Selection rule used: newest English revision per course, excluding anything under
`Archive/` or `Previous Revision/`, and excluding facilitator guides, assessments,
memos and translations. "Doc code" is the revision string printed inside the PDF
itself — the reliable way to tell which revision a file really is, since filenames
drift.

| Served as | Source folder | Source file | Doc code | Bytes | sha256 (first 16) |
|---|---|---|---|---|---|
| afr.pdf | AFR & US 229999 | 99 Learner Manual_Rev1.1.pdf | GT9800LM01 Rev_1.1 | 24601143 | f7a7c1c2dd9bfee8 |
| bfa.pdf | BFA & US 229998 | GLC98LMT - Learner Manual_Rev 3.pdf | GLC98LM_Rev 3 | 6166177 | a916d515c5598703 |
| ceim.pdf | CEIM | CEIMLM_MANUAL_Rev4.pdf | GLCCEIMLM_Rev 4 | 1196645 | eaa3f006e5bda7f1 |
| fabr.pdf | FABR & US 229998 & 229995 | GLC9895LM_LEARNER MANUAL_Rev5.pdf | GLC9895LM_Rev 5.0 | 8496835 | 4a4f0d2ecd2d93dd |
| fpp.pdf | FPP & US 229994 | 94 Manual Rev 3 A4.pdf | GT94LM01 Rev_3.0 | 5232363 | 61dae22d59a804a9 |
| gls.pdf | GLS (Gravity Lifeline Systems) | GLCGLSLM_Rev2.3 - GHS & GVS MANUAL.pdf | GLCGLSLM_Rev 2.3 | 3820437 | fb3174c531bbb3d2 |
| ifpp.pdf | IFPP | GLCIFPPLM_Rev 3- IFPP Manual.pdf | GLCIFPPLM_Rev 3 | 1161781 | 96a7bfb29eb559ce |
| mechanical-lifting.pdf | Mechanical Lifting & US 253582 | ML_MANUAL_Rev3.pdf | ML_M_Rev 3 | 2152133 | 1b378eb15f8aab4e |
| plu-plpc.pdf | PLU & PLPC | GLCPLPC_MANUAL_Rev4.pdf | GLCPLPC_Rev 4 | 2565910 | 40279085d135091b |
| ra-l1.pdf | RA L1 US 229998 & 230000 | GLC98&00LM - Learner Manual_Rev 3.pdf | GLC98&00LM_Rev 3 | 6056066 | 8742e4f4f31936cf |
| ra-l2-l3.pdf | RA L2 US 229996 | GLC96,97&LM - Level 2 & 3 Manual_Rev 2.pdf | GLC96,97&LM_Rev 2 | 13201535 | 003f0760e46aedaa |
| rfa.pdf | RFA | GLCRFALM02_RFA Learner Manual_Rev 2.pdf | GLCRFALM02_Rev 2.0 | 1042543 | 05343cba21855426 |
| rope-rigging.pdf | RR & US 14706 | GLC06LM_RR MANUAL_Rev4.pdf | GLC06M_Rev 4 | 2015851 | f61a9f58c4c5e9d2 |
| telecommunication-abseiling.pdf | Telecommunication Abseiling | GLCTALM01_Telecommmunication Abseiling Manual_Rev3.pdf | GLCTALM01_Rev 3 | 2159621 | 835a444a37bfbf13 |
| tower-erector.pdf | Tower Erector | GLCTELM_TOWER ERECTOR MANUAL_Rev 3.pdf | GLCTELM_Rev 3 | 2264645 | 18af4b9e10d09c13 |

## Known gaps

- **ra-l1.pdf** opens with a "Fall Arrest & Basic Rescue" course-overview page.
  The body is genuinely the Rope Access L1 manual (correct 98&00 doc code, RA
  logbook at the back) — the stray page is in Gravity's source PDF, so it has to
  be fixed there.
- **Fall Arrest Rescue** (the non-Advanced course) is mapped to `afr.pdf`, the
  US 229999 *Advanced* manual. Flagged `VERIFY` in `../src/manuals.ts` — a
  training-department call, not a technical one.
- Courses with no manual here at all: Rope Access L3 (covered by the combined
  L2 & L3 manual), Scaffolding, Supervisor Course, GVS Installation / Gravity
  Vertical System Installer, IRATA, Tower Verticality, Confined Space.

## Refreshing a manual

1. Find the course's folder in the source library above.
2. Take the newest English revision outside `Archive/` and `Previous Revision/`.
3. Open it and check the doc code on an inside page against the table — filenames
   lie, doc codes don't.
4. Replace the file here, keeping the served name, and update the row above
   (bytes + `sha256sum`).
