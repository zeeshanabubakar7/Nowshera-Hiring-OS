# Nowshera Hire OS — Applicant Tracking System

Full-stack portfolio build for Nowshera Digital. The project includes a responsive candidate portal, recruiter pipeline, admin control room, D1 database, R2 CV storage, server-side role checks, CV snapshotting, AI-summary fallback, n8n export, interview conflict prevention and transactional email events.

## Production Site

The verified owner-private deployment is available at:

`https://nowshera-hire-os.zeeshanabubakar5622.chatgpt.site`

The first account created becomes the admin. Site access is intentionally owner-private in this handoff; the API, D1 data and R2 CVs still enforce role boundaries independently.

## Local run

```bash
node "$SITES_PNPM_BIN" db:generate
node "$SITES_PNPM_BIN" build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_huge_demogoblin.sql
node "$SITES_PNPM_BIN" start
```

The first account created becomes the admin. Additional sign-ups are candidates. An admin can create recruiters and assign them to jobs.

## Data boundaries

- D1 stores accounts, sessions, jobs, applications, stage history, interviews, notes, summaries and email events.
- R2 stores private PDF CV bytes. CV routes require the owning candidate, an assigned recruiter, or the admin role.
- The frontend only calls `/api/*`; AI and email keys stay in n8n/server environment variables.
- The local fallback writes an AI-style summary so the full product can be tested without an n8n account. Set `ATS_ENABLE_N8N=true` and configure the webhook to use the real automation.

## 14-test coverage

The route rules cover duplicate applications, automatic closure by date/openings, ordered stages, withdrawals and re-application with a new CV, PDF/2 MB validation, interview overlap and past-time checks, server-side role boundaries, private CV/notes/summary access, dashboard counts, AI protected-field scrubbing, retry after failure, and secret-key separation. `scripts/test-ats.mjs` exercises the critical API paths against a local server.

## n8n

Import `n8n/workflow.json` and follow `n8n/README.md`. The exported workflow contains no credentials or API keys.

The project includes the complete importable n8n workflow and a local fallback so the deployed app remains testable even before an n8n workspace, Gemini key and Resend sender are connected. A live n8n webhook URL is deployment-specific and must be supplied by the n8n workspace owner; it is not hard-coded or fabricated here.
