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
  - `GET /api/trainings?idNumber=…` — the learner's enrolments whose booking has
    already started, newest first. Each carries its `status` and, **only if that
    status is Competent and a manual is mapped**, a `manuals` array with one
    signed token per available language.
  - `GET /api/manual?t=…` — streams the PDF the token grants.
- **Manuals**: PDFs live in [api/manuals/](api/manuals/) and are mapped to course
  names in [api/src/manuals.ts](api/src/manuals.ts).

### Who can read a manual

The PDFs are deliberately **not** in the front-end's `public/` folder — anything
there is fetchable by URL with no check. Instead:

1. **There is no identity check.** An ID number alone returns that learner's
   record. A certificate-number second factor was built and then removed on
   request, so anyone who knows or guesses an ID number can read someone's
   training history and open their manuals. Restoring it means putting the check
   back in `dataverse.ts` and the field back on the search screen — see the
   commit that removed it.
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
secret scanning rejects that, and DevTools would show it anyway). CORS limits
browser callers to the portal's origins but does not stop a direct request, so
treat this endpoint as world-readable given an ID number. No secret of any kind
ships to the browser — the Dataverse credential and the manual-signing key stay
in the Function App's settings.

The site is live at **https://gravitymanuals.co.za**.

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

## Checking SharePoint for manual changes

The manuals are a snapshot, so nothing updates on its own. The
[SharePoint `Manuals` folder](https://gravitygh.sharepoint.com/sites/GravityGH/Gravity%20GH/Forms/AllItems.aspx?id=%2Fsites%2FGravityGH%2FGravity%20GH%2FGravity%20Data%2FGravity%20Training%2FB%20Training%2FDesign%20and%20Development%2FManuals)
is the single source of truth, and `api/manuals/BASELINE.json` records exactly
what it held at the last import. To see what has moved since:

```bash
cd api
node check-manuals.js --snippet     # prints a browser-console snippet
node check-manuals.js listing.json  # diffs that listing against the baseline
```

It reports new, removed and revised files, and exits non-zero when anything has
drifted, so it can be wired to a schedule later. The snippet route needs no
special permission — it runs in a session that can already see the folder.

Fully automatic checking (a nightly timer inside the Function App) needs a
tenant admin to grant the app registration Microsoft Graph **`Sites.Selected`**
on the GravityGH site. Until then the check is on demand.

## Adding or updating a manual

1. Put the PDF in the SharePoint `Manuals` folder — that stays the source.
2. Copy it into `api/manuals/`, named `lowercase-with-hyphens.pdf`
   (add a language suffix for translations, e.g. `bfa-fr.pdf`).
3. Map it in `api/src/manuals.ts` — `MANUALS` for the file, `COURSE_MANUAL` for
   the Dataverse course names that should get it.
4. Update the table in `api/manuals/SOURCES.md` and refresh `BASELINE.json`.
5. Deploy: `cd api && func azure functionapp publish gravity-manuals-api`
   (no site rebuild — PDFs ship with the API).
