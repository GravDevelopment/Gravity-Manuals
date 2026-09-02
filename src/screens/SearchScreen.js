import { useState } from 'react';
import { searchTrainings } from '../api/client';
import Logo from '../components/Logo';
import { SUPPORT_EMAIL, supportMailto } from '../support';

export default function SearchScreen({ onResults }) {
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runSearch(event) {
    event.preventDefault();
    const id = idNumber.trim();
    if (!id || loading) return;
    setLoading(true);
    setError(null);
    try {
      const trainings = await searchTrainings(id);
      if (trainings.length === 0) {
        setError("We couldn't find any trainings for that ID number. Please check it and try again.");
      } else {
        onResults(trainings);
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
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
          Type your ID number to see the manuals
          <br />
          for the trainings you passed
        </p>
      </div>

      <form className="search-column" onSubmit={runSearch}>
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
