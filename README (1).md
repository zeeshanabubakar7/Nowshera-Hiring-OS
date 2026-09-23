# n8n automation setup

Import `workflow.json` into n8n. The workflow has one webhook that handles two events sent by the ATS:

1. `application.created` → Gemini writes the three-part CV summary → the summary is saved through the protected ATS callback.
2. `email.queued` → Resend sends the candidate email → the email event is marked `sent`.

Set these values in the n8n environment (never commit them):

```text
ATS_BASE_URL=https://your-ats-site.example
ATS_AUTOMATION_SECRET=the-same-random-secret-configured-in-the-ATS
GEMINI_API_KEY=your-gemini-key
RESEND_API_KEY=your-resend-key
RESEND_FROM_EMAIL=Nowshera Digital <hiring@your-domain.example>
```

The browser never receives `GEMINI_API_KEY`, `RESEND_API_KEY`, or `ATS_AUTOMATION_SECRET`. The ATS sends only server-side webhook events. Use made-up CVs for testing.
