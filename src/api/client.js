const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7071';
const API_FUNCTION_KEY = process.env.REACT_APP_API_FUNCTION_KEY || '';

// The token is an opaque, expiring grant minted by the API for a course the
// learner passed — it carries no ID number, so this is safe to put in a link.
export function manualUrl(manualToken) {
  return `${API_BASE_URL.replace(/\/+$/, '')}/api/manual?t=${encodeURIComponent(manualToken)}`;
}

export async function searchTrainings(idNumber) {
  const url = `${API_BASE_URL.replace(/\/+$/, '')}/api/trainings?idNumber=${encodeURIComponent(idNumber)}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(API_FUNCTION_KEY ? { 'x-functions-key': API_FUNCTION_KEY } : {}),
    },
  });
  if (!response.ok) {
    throw new Error(`Search failed (${response.status})`);
  }
  const body = await response.json();
  return body.trainings ?? [];
}
