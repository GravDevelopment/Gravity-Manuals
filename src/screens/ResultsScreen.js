import { manualUrl } from '../api/client';
import Logo from '../components/Logo';

function formatRange(training) {
  return `${training.startDate ?? '?'} — ${training.endDate ?? '?'}`;
}

// Why there's no manual to open. The API only issues a link for a course the
// learner is marked Competent on, so say which of those two it is.
function manualNotice(training) {
  if (training.competent) return 'Manual not available yet';
  if (training.status === 'In Training') return 'Available once you are marked competent';
  return 'Not marked competent';
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
        <p className="subtitle">Open the manual for a course you passed</p>
      </header>

      <ul className="course-list">
        {trainings.map((training) => {
          const href = training.manualToken ? manualUrl(training.manualToken) : null;
          return (
            <li key={training.enrollId} className="course-card">
              <div className="card-accent" />
              <div className="card-body">
                <div className="course-name">{training.courseName ?? 'Course'}</div>
                {training.designation && <div className="designation">{training.designation}</div>}
                <div className="card-footer">
                  <span className="dates">
                    {formatRange(training)}
                    {training.status && ` · ${training.status}`}
                  </span>
                  {href ? (
                    <a
                      className="manual-button"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View manual
                    </a>
                  ) : (
                    <span className="manual-missing">{manualNotice(training)}</span>
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
