// Where learners are sent when the portal can't give them what they came for:
// details that don't match, no certificate number on record, or a course whose
// manual isn't loaded yet.
export const SUPPORT_EMAIL = 'certification@gravitygh.co.za';

export function supportMailto(subject) {
  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
