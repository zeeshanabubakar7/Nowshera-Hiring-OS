# Nowshera Hire OS — 14 acceptance checks

The automated API suite is `scripts/test-ats.mjs`. It starts with a fresh D1 database, creates made-up users and CVs, and verifies the server rules instead of relying on hidden buttons in the UI.

Run it locally:

```bash
node "$SITES_PNPM_BIN" build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_huge_demogoblin.sql
bash -lc 'node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js dev dist/server/index.js --no-bundle --local --config dist/server/wrangler.json --persist-to .wrangler/state --ip 127.0.0.1 --port 8787 --inspector-port 0 --show-interactive-dev-session=false >/tmp/ats.log 2>&1 & p=$!; trap "kill $p 2>/dev/null || true" EXIT; for i in 1 2 3 4 5 6 7 8 9 10; do curl -fsS http://127.0.0.1:8787/ >/dev/null 2>&1 && break; sleep 1; done; ATS_BASE_URL=http://127.0.0.1:8787 node scripts/test-ats.mjs'
```

Expected result:

```text
All requested ATS API checks passed
```

| # | Check | Verified behavior |
|---:|---|---|
| 1 | Apply | PDF upload, application saved as Applied, application email event queued once. |
| 2 | Create and hire | Draft is hidden, opened job is visible, assigned recruiter advances the application. |
| 3 | Duplicate apply | A second active application for the same job returns a clear conflict. |
| 4 | Openings filled | Hired count closes the job; a second hire is blocked while rejection still works. |
| 5 | Stage rules | Skip, backwards moves, closed-job movement, and invalid interview actions are blocked. |
| 6 | Withdraw and new CV | Withdrawn application keeps the old CV; re-application uses the new CV snapshot. |
| 7 | File/time validation | Word files, over-2 MB PDFs, past interviews, and overlapping interviews are rejected. |
| 8 | Role enforcement | Candidate stage mutation and unassigned recruiter access return server-side errors. |
| 9 | Privacy | Candidate sees own applications only; notes, summaries, and other CVs are not exposed. |
| 10 | Dashboard/email audit | Dashboard is stable after refresh and email events remain auditable. |
| 11 | AI summary | Three-part summary is available without moving the application stage. |
| 12 | AI safety | Protected personal fields are scrubbed; there is no score, ranking, or hire/reject advice. |
| 13 | AI failure | Failed summary can be retried and does not create another candidate email. |
| 14 | Secret separation | Browser-facing source has no Gemini/Resend key pattern; automation is server-side only. |

For a visual walkthrough, use the Urdu script in `docs/urdu-walkthrough.md` with made-up CVs only.
