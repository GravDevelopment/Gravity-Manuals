import Logo from '../components/Logo';
import { getManualUrl } from '../manuals';

function formatRange(training) {
  return `${training.startDate ?? '?'} — ${training.endDate ?? '?'}`;
}

export default function ResultsScreen({ trainings, onBack }) {
  const firstName = trainings[0]?.firstName || 'there';

  return (
    <div className="results-screen">
      <div className="logo-row">
        <Logo size="small" />
      </div>
      <header className="results-header">
        <div className="accent-bar" />
        <div className="step-label">Your trainings</div>
        <h1 className="title">Hi {firstName}</h1>
        <p className="subtitle">Open the manual for a course you attended</p>
      </header>

      <ul className="course-list">
        {trainings.map((training) => {
          const manualUrl = getManualUrl(training.courseName);
          return (
            <li key={training.enrollId} className="course-card">
              <div className="card-accent" />
              <div className="card-body">
                <div className="course-name">{training.courseName ?? 'Course'}</div>
                {training.designation && <div className="designation">{training.designation}</div>}
                <div className="card-footer">
                  <span className="dates">{formatRange(training)}</span>
                  {manualUrl ? (
                    <a
                      className="manual-button"
                      href={manualUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View manual
                    </a>
                  ) : (
                    <span className="manual-missing">Manual not available yet</span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="primary-button back-button" onClick={onBack}>
        Done — back to search
      </button>
    </div>
  );
}
