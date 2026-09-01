import { manualUrl } from '../api/client';
import Logo from '../components/Logo';
import { SUPPORT_EMAIL, supportMailto } from '../support';

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

      {/* Always shown, not just when something is missing — a learner who can't
          find what they came for shouldn't have to work out who to ask. */}
      <div className="notice notice-standing" role="status">
        <p className="notice-help">
          Can't see a manual you're expecting? Email{' '}
          <a href={supportMailto('Learner manuals — manual not available')}>{SUPPORT_EMAIL}</a>{' '}
          with your ID number and the course name, and we'll send it to you.
        </p>
      </div>

      <button className="primary-button back-button" onClick={onBack}>
        Done — back to search
      </button>
    </div>
  );
}
