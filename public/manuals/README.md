# Course manuals

Drop the manual PDFs in this folder, then register each one in
`src/manuals.js`:

```js
const MANUALS = {
  'First Aid Level 1': 'first-aid-level-1.pdf',
};
```

The key must match the course name exactly as it appears in Dataverse
(`grav_coursename`). Courses without an entry show "Manual not available yet"
in the portal.
