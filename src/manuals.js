// Maps a course name (grav_coursename in Dataverse, exactly as it appears on
// the course record) to its manual PDF inside public/manuals/.
//
// To add a manual:
//   1. Drop the PDF into public/manuals/
//   2. Add a line here:  'Course Name As In Dataverse': 'the-file.pdf',
//
// Courses without an entry show "Manual not available yet" in the portal.
const MANUALS = {
  // 'First Aid Level 1': 'first-aid-level-1.pdf',
};

export function getManualUrl(courseName) {
  if (!courseName) return null;
  const file = MANUALS[courseName];
  if (!file) return null;
  return `${process.env.PUBLIC_URL}/manuals/${encodeURIComponent(file)}`;
}
