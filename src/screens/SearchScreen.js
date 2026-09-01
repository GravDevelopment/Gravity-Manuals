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
        {/* Not numeric-only: real learner IDs include passport-style values like
            "T-1304-4144-994-1", "20010519-53220-00001-29" and "GHA7178513565",
            so letters and hyphens must survive, and 20 chars is too short. */}
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
        {/* Certificate numbers look like "287958/26" — keep the slash. */}
        <input
          id="certificateNumber"
          className="id-input cert-input"
          type="text"
          autoComplete="off"
          maxLength={24}
          placeholder="e.g. 287958/26"
          value={certificateNumber}
          onChange={(e) => setCertificateNumber(e.target.value.replace(/[^A-Za-z0-9/-]/g, '').toUpperCase())}
        />
        <p className="field-hint">From any Gravity certificate you have received</p>

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
