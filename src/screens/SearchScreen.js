import { useState } from 'react';
import { searchTrainings } from '../api/client';
import Logo from '../components/Logo';

export default function SearchScreen({ onResults }) {
  const [idNumber, setIdNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function runSearch(event) {
    event.preventDefault();
    const value = idNumber.trim();
    if (!value || loading) return;
    setLoading(true);
    setError(null);
    try {
      const trainings = await searchTrainings(value);
      if (trainings.length === 0) {
        setError("We couldn't find any trainings for that ID number. Please check and try again — or contact Gravity for help.");
        setIdNumber('');
      } else {
        onResults(trainings);
      }
    } catch (e) {
      setError('Something went wrong. Please try again — or contact Gravity for help.');
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
          for the trainings you attended
        </p>
      </div>

      <form className="search-column" onSubmit={runSearch}>
        <input
          className="id-input"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          maxLength={20}
          placeholder="ID number"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value.replace(/[^0-9]/g, ''))}
          autoFocus
        />

        {error && <p className="error-text">{error}</p>}

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
