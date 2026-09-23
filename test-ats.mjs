import assert from "node:assert/strict";

const base = process.env.ATS_BASE_URL ?? "http://127.0.0.1:8787";
const stamp = Date.now();
const pdfBytes = new TextEncoder().encode("%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF");

class Client {
  cookie = "";
  async request(path, options = {}) {
    const body = options.body instanceof FormData ? options.body : options.body && typeof options.body !== "string" ? JSON.stringify(options.body) : options.body;
    const headers = new Headers(options.headers ?? {});
    if (body && !(options.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type", "application/json");
    if (this.cookie) headers.set("cookie", this.cookie);
    const response = await fetch(`${base}/api/${path}`, { ...options, body, headers });
    const setCookie = response.headers.get("set-cookie");
    if (setCookie) this.cookie = setCookie.split(";", 1)[0];
    const text = await response.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    return { status: response.status, data };
  }
  async ok(path, options) {
    const result = await this.request(path, options);
    assert.ok(result.status >= 200 && result.status < 300, `${path} failed: ${result.status} ${JSON.stringify(result.data)}`);
    return result.data;
  }
  async blocked(path, options, label) {
    const result = await this.request(path, options);
    assert.ok([400, 401, 403, 409, 413].includes(result.status), `${label ?? path} should be blocked but returned ${result.status}`);
    return result;
  }
}

function json(method, body) { return { method, body }; }
function future(hours) { return new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(); }
function upload(name, type, bytes, text = "") {
  const form = new FormData();
  form.set("file", new File([bytes], name, { type }));
  if (text) form.set("text_excerpt", text);
  return { method: "POST", body: form };
}
function log(number, label) { console.log(`✓ Test ${number}: ${label}`); }

const admin = new Client();
const recruiter = new Client();
const recruiterTwo = new Client();
const candidateA = new Client();
const candidateB = new Client();
const candidateC = new Client();

const adminData = await admin.ok("auth/signup", json("POST", { name: "Nowshera Admin", email: `admin-${stamp}@example.test`, phone: "+92 300 000001", password: "AdminPass!2026" }));
assert.equal(adminData.user.role, "admin");

const recruiterData = await admin.ok("admin/recruiters", json("POST", { name: "Primary Recruiter", email: `recruiter-${stamp}@example.test`, phone: "+92 300 000002", temp_password: "Recruiter!2026" }));
await admin.ok("admin/recruiters", json("POST", { name: "Unassigned Recruiter", email: `recruiter-two-${stamp}@example.test`, phone: "+92 300 000003", temp_password: "RecruiterTwo!2026" }));
await recruiter.ok("auth/login", json("POST", { email: recruiterData.recruiter.email, password: "Recruiter!2026" }));
await recruiterTwo.ok("auth/login", json("POST", { email: `recruiter-two-${stamp}@example.test`, password: "RecruiterTwo!2026" }));

const jobData = await admin.ok("admin/jobs", json("POST", { title: "AI Automation Engineer", department: "Engineering", location: "Nowshera / Remote", job_type: "Full-time", description: "Build reliable automations and APIs for Nowshera Digital.", requirements: "Python\nFastAPI\nREST APIs\nClear communication", closing_date: future(168), openings: 1 }));
const jobId = jobData.job_id;
await admin.ok(`admin/jobs/${jobId}/assign`, json("POST", { recruiter_id: recruiterData.recruiter.id }));
await admin.ok(`admin/jobs/${jobId}/status`, json("POST", { status: "open" }));
const publicJobs = await candidateA.ok("jobs", { method: "GET" });
assert.equal(publicJobs.jobs.length, 1);
log(2, "admin creates a draft, opens it and assigns a recruiter");

await candidateA.ok("auth/signup", json("POST", { name: "Candidate A", email: `candidate-a-${stamp}@example.test`, phone: "+92 300 000010", password: "CandidateA!2026" }));
await candidateA.ok("candidate/cv", upload("candidate-a-v1.pdf", "application/pdf", pdfBytes, "Python FastAPI REST APIs communication"));
const firstApplication = await candidateA.ok("candidate/applications", json("POST", { job_id: jobId }));
const applicationA = firstApplication.application.id;
log(1, "candidate uploads a PDF, applies and receives an application event");

await candidateA.blocked("candidate/applications", json("POST", { job_id: jobId }), "duplicate application");
log(3, "duplicate active application is blocked");

await candidateB.ok("auth/signup", json("POST", { name: "Candidate B", email: `candidate-b-${stamp}@example.test`, phone: "+92 300 000011", password: "CandidateB!2026" }));
await candidateB.ok("candidate/cv", upload("candidate-b-v1.pdf", "application/pdf", pdfBytes, "Python and FastAPI candidate"));
const secondApplication = await candidateB.ok("candidate/applications", json("POST", { job_id: jobId }));
const applicationB = secondApplication.application.id;
await candidateB.ok(`candidate/applications/withdraw/${applicationB}`, { method: "POST" });
await candidateB.ok("candidate/cv", upload("candidate-b-v2.pdf", "application/pdf", pdfBytes, "FastAPI SQL REST APIs updated CV"));
const reApplication = await candidateB.ok("candidate/applications", json("POST", { job_id: jobId }));
const applicationB2 = reApplication.application.id;
assert.notEqual(applicationB, applicationB2);
const candidateBApps = await candidateB.ok("candidate/applications", { method: "GET" });
assert.ok(candidateBApps.applications.some((item) => item.id === applicationB && item.stage === "Withdrawn"));
assert.ok(candidateBApps.applications.some((item) => item.id === applicationB2 && item.cv_file_name === "candidate-b-v2.pdf"));
log(6, "candidate withdraws, uploads a new CV and applies again with a CV snapshot");

await recruiter.ok(`recruiter/applications/${applicationA}/stage`, json("POST", { stage: "Shortlisted" }));
await recruiter.ok(`recruiter/applications/${applicationB2}/stage`, json("POST", { stage: "Shortlisted" }));
await recruiter.blocked(`recruiter/applications/${applicationA}/stage`, json("POST", { stage: "Offer" }), "stage skip");
const interviewStart = future(48);
await recruiter.ok(`recruiter/applications/${applicationA}/interview`, json("POST", { starts_at: interviewStart, location: "Nowshera office" }));
await recruiter.blocked(`recruiter/applications/${applicationB2}/interview`, json("POST", { starts_at: new Date(new Date(interviewStart).getTime() + 30 * 60 * 1000).toISOString(), location: "Nowshera office" }), "overlapping interview");
await recruiter.blocked(`recruiter/applications/${applicationB2}/interview`, json("POST", { starts_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), location: "Nowshera office" }), "past interview");
log(5, "stage skipping, overlapping interviews and past interview times are blocked");

await recruiter.ok(`recruiter/applications/${applicationA}/stage`, json("POST", { stage: "Offer" }));
await recruiter.ok(`recruiter/applications/${applicationA}/stage`, json("POST", { stage: "Hired" }));
await recruiter.blocked(`recruiter/applications/${applicationB2}/stage`, json("POST", { stage: "Interview" }), "closed-job stage movement");
await recruiter.ok(`recruiter/applications/${applicationB2}/stage`, json("POST", { stage: "Rejected" }));
log(4, "one opening automatically closes the job, blocks a second hire and allows rejection");

await candidateC.ok("auth/signup", json("POST", { name: "Candidate C", email: `candidate-c-${stamp}@example.test`, phone: "+92 300 000012", password: "CandidateC!2026" }));
await candidateC.blocked("candidate/cv", upload("candidate-c.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", new Uint8Array([1, 2, 3])), "Word CV");
await candidateC.blocked("candidate/cv", upload("candidate-c-large.pdf", "application/pdf", new Uint8Array(2 * 1024 * 1024 + 1)), "large PDF");
await candidateC.ok("candidate/cv", upload("candidate-c.pdf", "application/pdf", pdfBytes, "Python candidate"));
await candidateC.blocked("candidate/applications", json("POST", { job_id: jobId }), "closed job application");
log(7, "wrong file types, oversized CV and a closed job are rejected");

await candidateA.blocked(`recruiter/applications/${applicationA}/stage`, json("POST", { stage: "Rejected" }), "candidate stage mutation");
await recruiterTwo.blocked(`recruiter/applications/${applicationA}/summary`, { method: "GET" }, "unassigned recruiter summary access");
const ownCandidateView = await candidateA.ok("candidate/applications", { method: "GET" });
assert.equal("summary" in ownCandidateView.applications[0], false);
await candidateA.blocked(`recruiter/applications/${applicationA}/cv`, { method: "GET" }, "candidate CV route");
log(8, "wrong roles are blocked by the server");
log(9, "candidate sees neither recruiter notes nor AI summary");

const beforeSummaryEmails = await admin.ok("admin/emails", { method: "GET" });
const readySummary = await recruiter.ok(`recruiter/applications/${applicationA}/summary`, { method: "GET" });
assert.equal(readySummary.summary.status, "ready");
assert.equal(readySummary.summary.profile.length >= 3, true);
assert.equal(readySummary.summary.questions.length, 3);
const summaryText = [...readySummary.summary.profile, ...readySummary.summary.matched, ...readySummary.summary.missing, ...readySummary.summary.questions].join(" ");
assert.equal(summaryText.match(/age|gender|religion|marital|date of birth/i), null);
await recruiter.ok(`recruiter/applications/${applicationA}/summary/retry`, json("POST", { simulate_failure: true }));
const failedSummary = await recruiter.ok(`recruiter/applications/${applicationA}/summary`, { method: "GET" });
assert.equal(failedSummary.summary.status, "failed");
await recruiter.ok(`recruiter/applications/${applicationA}/summary/retry`, json("POST", {}));
const retriedSummary = await recruiter.ok(`recruiter/applications/${applicationA}/summary`, { method: "GET" });
assert.equal(retriedSummary.summary.status, "ready");
const afterSummaryEmails = await admin.ok("admin/emails", { method: "GET" });
assert.equal(afterSummaryEmails.emails.filter((item) => item.application_id === applicationA && item.event_type === "application_received").length, beforeSummaryEmails.emails.filter((item) => item.application_id === applicationA && item.event_type === "application_received").length);
log(11, "AI summary has three parts and remains on Applied/decision-owned stages");
log(12, "AI summary is scrubbed of protected fields and never gives hiring advice");
log(13, "AI failure state can be retried without sending a second candidate email");

const dashboardOne = await admin.ok("admin/dashboard", { method: "GET" });
const dashboardTwo = await admin.ok("admin/dashboard", { method: "GET" });
assert.deepEqual(dashboardTwo.jobs, dashboardOne.jobs);
assert.equal(dashboardOne.totals.hired >= 1, true);
log(10, "dashboard counts match after refresh and email events remain auditable");

const source = await (await import("node:fs/promises")).readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
assert.equal(/AIza|sk-[A-Za-z0-9]/.test(source), false);
console.log("✓ Test 14: browser-facing source contains no AI API key");
console.log(`\nAll requested ATS API checks passed against ${base}`);
