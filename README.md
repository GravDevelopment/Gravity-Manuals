# Gravity Learner Manuals Portal

Web portal where a learner types their ID number and sees the manuals for the
trainings they attended. Looks and works like the learner sign-in kiosk tablet
app, and reuses its Dataverse connection.

## How it works

- **Front-end** (this folder): Create React App. Search screen → course cards →
  "View manual" opens the PDF. Styling mirrors `learner-signin-kiosk/app`
  (white background, red `#d32027` accent).
- **API** ([api/](api/)): Azure Functions (Node/TypeScript), same pattern as the
  kiosk's API. Holds the Dataverse client-credentials secret and exposes one
  endpoint: `GET /api/trainings?idNumber=...` — returns every enrollment in
  `tct_enrolls` for that learner ID whose booking has already started, newest
  first.
- **Manuals**: PDFs live in [public/manuals/](public/manuals/) and are mapped to
  course names in [src/manuals.js](src/manuals.js). Courses without a mapped
  PDF show "Manual not available yet".

## Run locally

```
# Terminal 1 — API (needs Azure Functions Core Tools)
cd api
npm install
npm start          # serves http://localhost:7071/api/trainings

# Terminal 2 — front-end
npm install
npm start
```

`api/local.settings.json` (gitignored) needs the same values as the kiosk API:
`TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `DATAVERSE_URL`.

## Deploy

- Deploy `api/` as an Azure Function App with those four settings, plus CORS
  for the portal's origin.
- Build the front-end with `REACT_APP_API_BASE_URL` and
  `REACT_APP_API_FUNCTION_KEY` set (see [.env](.env)), then host the `build/`
  folder anywhere static (GitHub Pages, Azure Static Web Apps, ...).

## Adding a manual

1. Drop the PDF into `public/manuals/`.
2. Add a line to `src/manuals.js`: `'Course Name As In Dataverse': 'file.pdf'`.
