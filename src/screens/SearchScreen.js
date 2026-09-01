import { useState } from 'react';
import { NoMatchError, searchTrainings } from '../api/client';
import Logo from '../components/Logo';
import { SUPPORT_EMAIL, supportMailto } from '../support';

export default function SearchScreen({ onResults }) {
  const [idNumber, setIdNumber] = useState('');
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runSearch(event) {
    event.preventDefault();
    const id = idNumber.trim();
    const cert = certificateNumber.trim();
    if (!id || !cert || loading) return;
    setLoading(true);
    setError(null);
    try {
      const trainings = await searchTrainings(id, cert);
      if (trainings.length === 0) {
        setError("We couldn't find any trainings for you yet.");
      } else {
        onResults(trainings);
      }
    } catch (e) {
      // The API deliberately can't tell us which detail was wrong, so this covers
      // every case — including learners with no certificate number on record.
      setError(
        e instanceof NoMatchError
          ? "Those details don't match. Please check your ID number and certificate number."
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-screen">
      <div className="search-column">
        <Logo size="large" />
        <div className="accent-bar accent-bar-centered" />
        <div className="step-label">Learner manuals</div>
        <h1 className="title">Welcome</h1>
        <p className="subtitle">
          Enter your ID number and a certificate
          <br />
          number to see your manuals
        </p>
      </div>

      <form className="search-column" onSubmit={runSearch}>
        <label className="field-label" htmlFor="idNumber">
          ID number
        </label>
        {/* Not numeric-only: learner IDs are not all South African 13-digit
            numbers. Other formats in use carry letters and hyphens and run past
            20 characters — roughly "A-1234-5678-901-2",
            "19990101-12345-00001-11" and "ABC1234567890" in shape — so those
            characters must survive and the limit has to be generous.
            (Shapes only. Never put a real learner's identifier in this repo:
            it is public.) */}
        <input
          id="idNumber"
          className="id-input"
          type="text"
          autoComplete="off"
          maxLength={40}
          placeholder="ID number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.replace(/[^A-Za-z0-9/-]/g, '').toUpperCase())}
          autoFocus
        />

        <label className="field-label" htmlFor="certificateNumber">
          Certificate number
        </label>
        {/* Certificate numbers contain a slash, so keep it. No example value here:
            this placeholder renders on a public page, and any realistic-looking
            certificate number is likely to be a real learner's. */}
        <input
          id="certificateNumber"
          className="id-input cert-input"
          type="text"
          autoComplete="off"
          maxLength={24}
          placeholder="Certificate number"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value.replace(/[^A-Za-z0-9/-]/g, '').toUpperCase())}
        />
        <p className="field-hint">
          Exactly as printed on any Gravity certificate you have received
        </p>

        {error && (
          <div className="notice" role="alert">
            <p className="error-text">{error}</p>
            <p className="notice-help">
              Still can't see your manuals? Email{' '}
              <a href={supportMailto('Learner manuals — cannot access my manuals')}>{SUPPORT_EMAIL}</a>{' '}
              and we'll help you.
            </p>
          </div>
        )}

        {loading ? (
          <div className="spinner" aria-label="Searching" />
        ) : (
          <button className="primary-button" type="submit">
            Search
          </button>
        )}
      </form>
    </div>
  );
}
