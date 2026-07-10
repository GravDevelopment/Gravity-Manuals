// Maps a course name (grav_coursename in Dataverse, exactly as it appears on
// the course record) to its manual PDF inside public/manuals/.
//
// To add a manual:
//   1. Drop the PDF into public/manuals/
//   2. Add a line here:  'Course Name As In Dataverse': 'the-file.pdf',
//
// Courses without an entry show "Manual not available yet" in the portal.
//
// Sourced July 2026 from SharePoint: Gravity GH / Gravity Data / Gravity
// Training / B Training / Design and Development / Gravity Internal Training
// Course Material — newest English revision per course at the time.
const MANUALS = {
  // Advanced Fall Arrest Rescue — 99 Learner Manual_Rev1.1
  'Advanced Fall Arrest Rescue (Int.)': 'afr.pdf',
  'Advanced Fall Arrest Rescue Specialist': 'afr.pdf',
  // VERIFY: Fall Arrest Rescue courses assumed to share the AFR / US 229999 manual
  'Fall Arrest Rescue': 'afr.pdf',
  'Fall Arrest Rescue (Int.)': 'afr.pdf',

  // Basic Fall Arrest — GLC98LMT Learner Manual_Rev 3
  'Basic Fall Arrest': 'bfa.pdf',
  'Basic Fall Arrest (Int.)': 'bfa.pdf',
  'Basic Fall Arrest (Mines)': 'bfa.pdf',

  // Climbing Equipment Inspection and Management — CEIMLM_MANUAL_Rev4
  'Climbing Equipment Inspection and Management': 'ceim.pdf',

  // Fall Arrest and Basic Rescue — GLC9895LM_LEARNER MANUAL_Rev5
  'Fall Arrest and Basic Rescue': 'fabr.pdf',
  'Fall Arrest & Basic Rescue Technician (Int.)': 'fabr.pdf',
  'Fall Arrest & Basic Rescue Technician (Int.) - Staff': 'fabr.pdf',
  'FABR Bridging Course': 'fabr.pdf',
  'Fall Arrest Bridging Course': 'fabr.pdf',

  // Fall Protection Plan Developer — 94 Manual Rev 3 A4
  'Fall Protection Plan Developer': 'fpp.pdf',
  'Fall Protection Plan Development (Int.)': 'fpp.pdf',
  'E-Learning Fall Protection Plan Developer': 'fpp.pdf',

  // Gravity Horizontal / Vertical System — GLCGLSLM_Rev2.3 GHS & GVS MANUAL
  'Gravity Horizontal System': 'gls.pdf',
  'Gravity Vertical System': 'gls.pdf',

  // Implement a Fall Protection Plan — GLCIFPPLM_Rev 3
  'Implement a Fall Protection Plan': 'ifpp.pdf',

  // Mechanical Lifting — ML_MANUAL_Rev3
  'Mechanical Lifting': 'mechanical-lifting.pdf',
  'Mechanical Lifting (Int.)': 'mechanical-lifting.pdf',

  // Portable Ladder / Pole Climbing — GLCPLPC_MANUAL_Rev4
  'Portable Ladder User': 'plu-plpc.pdf',
  'Portable Ladder User - Solar Structure': 'plu-plpc.pdf',
  'Portable Ladder and Pole Climbing': 'plu-plpc.pdf',

  // Rope Access Level 1 — GLC98&00LM Learner Manual_Rev 3
  'Rope Access Level 1': 'ra-l1.pdf',
  'Rope Access L1 - Recap/Assessment only': 'ra-l1.pdf',

  // Rope Access Levels 2 & 3 — GLC96,97&LM Level 2 & 3 Manual_Rev 2
  'Rope Access Level 2': 'ra-l2-l3.pdf',
  'Rope Access Level 2 Theory': 'ra-l2-l3.pdf',
  'Rope Access Level 2 Test': 'ra-l2-l3.pdf',
  'Rope Access L2 - Recap/Assessment only': 'ra-l2-l3.pdf',
  'Rope Access Level 3': 'ra-l2-l3.pdf',
  'Rope Access Level 3 Theory': 'ra-l2-l3.pdf',
  'Rope Access Level 3 Test': 'ra-l2-l3.pdf',
  'Rope Access L3 - Recap/Assessment only': 'ra-l2-l3.pdf',

  // Radio Frequency Awareness — GLCRFALM02_Rev 2
  'Radio Frequency Awareness': 'rfa.pdf',
  'E-Learning Radio Frequency Awareness': 'rfa.pdf',

  // Rope Rigging — GLC06LM_RR MANUAL_Rev4
  'Rope Rigging': 'rope-rigging.pdf',
  'Rope Rigging (Int.)': 'rope-rigging.pdf',
  'Rope Rigging (Int.) - Staff': 'rope-rigging.pdf',
  'Rope Rigging Bridging Course': 'rope-rigging.pdf',

  // Telecommunication Abseiling — GLCTALM01_Rev3
  'Telecommunication Abseiling': 'telecommunication-abseiling.pdf',

  // Tower Erector — GLCTELM_Rev 3
  'Tower Erector': 'tower-erector.pdf',
  'Assistant Tower Erector': 'tower-erector.pdf',
};

export function getManualUrl(courseName) {
  if (!courseName) return null;
  const file = MANUALS[courseName];
  if (!file) return null;
  return `${process.env.PUBLIC_URL}/manuals/${encodeURIComponent(file)}`;
}
