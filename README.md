# Gravity Learner Manuals Portal

Web portal where a learner types their ID number and gets the manuals for the
trainings they **passed**. Looks and works like the learner sign-in kiosk tablet
app, and reuses its Dataverse connection.

## How it works

- **Front-end** (this folder): Create React App. Search screen → course cards →
  "View manual". Styling mirrors `learner-signin-kiosk/app` (white background,
  red `#d32027` accent).
- **API** ([api/](api/)): Azure Functions (Node/TypeScript), same pattern as the
  kiosk's API. Holds the Dataverse client-credentials secret.
  - `GET /api/trainings?idNumber=…&cert=…` — the learner's enrolments whose booking
    has already started, newest first, but **only if the certificate number matches
    one recorded against them**. Each carries its `status` and, **only if that status
    is Competent and a manual is mapped**, a `manualToken`.
  - `GET /api/manual?t=…` — streams the PDF the token grants.
- **Manuals**: PDFs live in [api/manuals/](api/manuals/) and are mapped to course
  names in [api/src/manuals.ts](api/src/manuals.ts).

### Who can read a manual

The PDFs are deliberately **not** in the front-end's `public/` folder — anything
there is fetchable by URL with no check. Instead:

1. The caller proves identity with an **ID number plus a certificate number** that
   Dataverse holds against one of their enrolments (any of theirs — it identifies
   the person, it doesn't pick a course). Names can't do this job: 61% of
   `grav_learnerfirstname` values hold more than one word and many learners come
   from countries without surnames. Certificate numbers are on 98% of Competent
   enrolments. Every failure returns the same 404 so the endpoint can't be used to
   discover which ID numbers exist.
2. `/api/trainings` mints a manual token only for an enrollment Dataverse marks
   **Competent** (`tct_assessmentstatus` = 1). Ignore `tct_passfail`; it looks
   like the right column but is null on every row.
3. The token is an HMAC-signed grant to read one filename, valid one hour. It
   holds no learner data, so it rides in a plain link without putting an ID
   number in a URL or a server log.
4. `/api/manual` serves a PDF only against a valid, unexpired token. Forged,
   tampered and expired tokens all get a 403 — see
   [api/src/token.check.ts](api/src/token.check.ts) (`cd api && npm run check`).

`/api/trainings` is `authLevel: "anonymous"` on purpose: it is called from the
browser, so any function key would be baked into the public JS bundle (GitHub's
secret scanning rejects that, and DevTools would show it anyway). The ID +
certificate pair is the access control. No secret of any kind ships to the
browser — the Dataverse credential and the manual-signing key stay in the
Function App's settings.

## Run locally

```
# Terminal 1 — API (needs Azure Functions Core Tools)
cd api
npm install
npm start          # http://localhost:7071

# Terminal 2 — front-end
npm install
npm start
```

`api/local.settings.json` (gitignored) needs the kiosk's Dataverse values —
`TENANT_ID`, `CLIENT_ID`, `CLIENT_SECRET`, `DATAVERSE_URL` — plus
`MANUAL_TOKEN_SECRET` for signing manual links (falls back to `CLIENT_SECRET`).

## Deploy

- Deploy `api/` as an Azure Function App with those settings, plus CORS for the
  portal's origin. Set a real `MANUAL_TOKEN_SECRET` there — rotating it
  immediately invalidates every outstanding manual link.
- Build the front-end with `REACT_APP_API_BASE_URL` and
  `REACT_APP_API_FUNCTION_KEY` set (see [.env](.env)), then host `build/`
  anywhere static (GitHub Pages, Azure Static Web Apps, …).

## Adding a manual

1. Drop the PDF into `api/manuals/`, named `lowercase-with-hyphens.pdf`.
2. Add a line to `api/src/manuals.ts`:
   `'Course Name As In Dataverse': 'file.pdf'`.
