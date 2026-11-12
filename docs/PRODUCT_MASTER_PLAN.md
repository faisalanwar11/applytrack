# ApplyTrack — Product Master Plan

> **Document version:** 1.0  
> **Last reviewed:** 12 November 2026  
> **Product stage:** Early working prototype (v0.1)  
> **Repository:** https://github.com/faisalanwar11/applytrack  
> **Status convention:** **Built** = code exists; **Verified** = tested by a user; **Planned** = not yet implemented; **Hypothesis** = unvalidated business assumption.

---

## 1. Executive summary

**ApplyTrack** is a browser-first job application tracker that helps job seekers capture opportunities, record what they applied for, track application progress, and remember follow-ups without maintaining spreadsheets.

**One-line promise:** *Save the job. Track the application. Know what to do next.*

The first product is a **Chrome Manifest V3 extension** with a compact popup and a full-tab dashboard. It starts **local-first**, without mandatory accounts or a backend. The initial focus is users applying across **Naukri, LinkedIn, Indeed, and company career pages**, particularly in India.

**Critical reality:** Job clipping and tracking are already offered by established competitors. ApplyTrack must earn adoption through reliability, low friction, privacy, India-relevant support, and actionable next steps—not by claiming job tracking is novel.

### Product principles

1. **User controls the truth.** Saving a job does **not** mean applying; only explicit user action or clearly confirmed evidence can set `Applied`.
2. **Fast capture, easy correction.** Prefill when possible; never prevent manual entry.
3. **Privacy by default.** Minimize permissions and data collection; local-first for the initial release.
4. **Portable data.** Provide readable CSV export and complete JSON backup/restore.
5. **Reliable before clever.** Prioritize capture accuracy, duplicate handling, and data safety over AI features.
6. **No false promises.** Do not claim automatic job submission, real-time monitoring, or background reminders unless implemented and verified.

## 2. The problem: why this should exist

Job seekers often use multiple portals, company career sites, referral links, email threads, and different resume versions. They forget which job was saved versus applied for, lose recruiter details, miss follow-ups, revisit duplicates, and struggle to identify which applications are progressing.

Spreadsheets are flexible but require manual copying. Browser bookmarks store URLs but not application state. Full career platforms may feel oversized for users who mainly need a dependable tracker.

**Opportunity hypothesis:** A lightweight, browser-native tracker that works well on Indian job sites and focuses on *next actions* could serve a segment that does not want an all-in-one AI career suite.

**Not proven yet:** Market size, willingness to pay, retention, and whether the proposed differentiation matters enough to switch from free alternatives.

## 3. For whom?

### Primary users
- Active job seekers applying to multiple positions per week.
- Early-career professionals, students, and career switchers.
- India-based users who frequently use Naukri and LinkedIn alongside company sites.
- Users who want a simple personal tracker without learning a complex CRM.

### Secondary users (later)
- High-volume applicants managing multiple resume versions and recruiter conversations.
- Freelance career coaches managing *consented* client workflows, potentially through a separate product.
- International job seekers using Indeed, Greenhouse, Lever, Workday, and other ATS pages.

### Not initially for
- Recruiters and applicant tracking systems.
- Automated mass application campaigns.
- Agencies requiring shared team access.
- Users needing native mobile sync on day one.

### Core jobs to be done
1. “When I see a job, save its details in under 30 seconds.”
2. “When I apply, record the date, resume version, and status accurately.”
3. “When I return, show what needs follow-up today.”
4. “When a recruiter responds, record the interaction and next step.”
5. “When I switch devices or tools, let me export my own data.”

## 4. Product experience

### 4.1 Chrome popup (approximately 380px wide)
- Brand, detection state, current job URL/source.
- Editable title, company, location, work arrangement, job type, and optional salary.
- Status choice: `Saved` or `Applied` at initial capture.
- Save/Update button; duplicate URL detection with **View Existing Job**.
- Manual fallback if extraction fails; explicit errors and confirmation.
- Open Dashboard shortcut.
- Never silently mark a job as applied.

### 4.2 Full-tab dashboard
- Clean professional UI: white cards, light gray canvas, blue `#2563EB`, dark `#0F172A`, rounded borders.
- Sidebar: Dashboard, All Applications, Reminders, Settings, Export/Import.
- Summary cards: Total Jobs, Applied, Interviews, Follow-ups Due.
- Search by title/company/location; filters by status/source/date; sorting.
- List/table as default view, with responsive layout and clear empty states.
- Detail view: Overview, Application, Activity, Notes, Follow-up.
- Fast status editing, notes, recruiter contacts, resume version, dates, and history.
- Keyboard/accessibility improvements and clear deletion confirmation.

### 4.3 Application lifecycle
`Saved → Applied → Interview → Offer`, with `Rejected`, `Withdrawn`, and `Archived` as other outcomes. Users can move between states when necessary. Every transition creates an activity event with timestamp and previous/new state.

### 4.4 Reminders
- User-defined follow-up date; suggested intervals only when explicitly enabled.
- In-dashboard **Due / Upcoming / Overdue** views.
- `chrome.alarms` + `chrome.notifications` for local reminders **while Chrome is running**.
- Clear permission controls and reminder dismissal/snooze.
- Never claim guaranteed delivery when Chrome is closed or the OS blocks notifications.

## 5. Competitive landscape (research reviewed November 2026)

These are **documented vendor claims**, not independently benchmarked tests. Features, free limits, and prices can change. Review source pages before public comparisons.

| Competitor | Documented capabilities / standout features | Implication for ApplyTrack |
|---|---|---|
| **Huntr** | Chrome job clipper, job board, contacts, application autofill, resumes and AI matching; its published free plan allows tracking up to 100 jobs, Pro adds unlimited tracking and more AI tools. | A mature all-in-one competitor. We cannot compete by merely adding a tracker. |
| **Teal** | Browser job bookmarking, pipeline tracking, contact management, excitement ratings, keyword extraction, spreadsheet view, templates, resume/job matching. | Prioritization and keyword analysis are already available elsewhere. |
| **Simplify** | Copilot application autofill, resume/cover letter assistance, job matching, tracker; documented workflow keeps final submission with the user. | Strong application-speed competitor; we should not rush into brittle autofill. |
| **Careerflow** | Chrome capture, Kanban tracking, contact CRM, analytics, reminders, follow-up support, AI career tools. | Follow-up reminders and analytics are **not inherently unique**. |

### Sources
- Huntr extension: https://help.huntr.co/en/articles/9859408-the-huntr-chrome-extension
- Huntr plans: https://help.huntr.co/en/articles/10714568-plan-types-and-pricing
- Teal tracker: https://www.tealhq.com/tools/job-tracker
- Simplify Copilot: https://help.simplify.jobs/help/articles/2415391-use-copilot-to-autofill-applications
- Simplify product overview: https://simplify.jobs/
- Careerflow tracker: https://www.careerflow.ai/job-tracker
- Careerflow FAQ: https://www.careerflow.ai/faq

### Competitor takeaways

**What competitors do well:** broad job-board support, autofill, rich dashboards, resumes, AI matching, and contacts.

**Where we might differentiate (hypotheses, not verified competitor deficiencies):**
- Lower cognitive load: fast capture and a focused “What should I do next?” home screen.
- Strong, explicitly tested extraction on **Naukri** and other India-relevant portals.
- Local-first, no-signup initial workflow, understandable permissions, and data portability.
- Clear distinction between *saved*, *applied*, and *confirmed submission*.
- Practical follow-up workflows without requiring AI or a paid subscription.

**Do not claim:** “Only tool with reminders,” “first job tracker for India,” “fully private compared with competitors,” or “works on every job board.” These are unsubstantiated.

## 6. ApplyTrack differentiation strategy

### Candidate differentiators (to validate with users)

**A. India-first reliability**
- Test Naukri deeply, including job title, employer, city, experience, job ID, and canonical URL.
- Add LinkedIn, Indeed, and employer sites; manual fallback everywhere.
- Handle URL tracking parameters and duplicate job IDs.
- Support INR salary notation and India-relevant location formats.

**B. Next-action dashboard**
- Default view prioritizes overdue follow-ups, unanswered applications, upcoming interviews, and records missing critical details.
- Each record shows a clear suggested action; no artificial “AI score” required.

**C. Privacy and portability**
- No account required in the initial release.
- Local storage with CSV and JSON exports; explicit import preview and validation.
- Clear disclosure that browser profile loss can destroy local data unless backed up.

**D. Application evidence trail**
- Distinguish user-entered status from verified submission.
- Timestamp status transitions, contacts, notes, resume versions, and follow-ups.
- Optional later feature: attach or link application confirmation evidence with user consent.

**E. Focused, affordable product**
- Keep the essential tracker usable without paying.
- Avoid stuffing unrelated AI resume tools into the MVP.

### Proposed unique positioning

> **ApplyTrack is the lightweight, India-friendly job application command center: capture jobs quickly, maintain an accurate history, and see your next action—without mandatory signup.**

This is a **positioning proposal**, not proof of unique market ownership. Validate it through interviews and usage.

## 7. Scope: MVP, next releases, and exclusions

### MVP / v0.1–v0.3
- Chrome MV3 extension shell.
- Popup extraction with editable fields and manual fallback.
- Job saving and normalized URL duplicate handling.
- Local persistence.
- Dashboard with search, filters, sorting, and status editing.
- Full application details, notes, contacts, and follow-up dates.
- Status history and activity timeline.
- Local notifications and reminder controls.
- CSV export; JSON export and validated import.
- Privacy policy, basic tests, and error states.

### Later releases
- Optional encrypted cross-device sync.
- Browser support beyond Chrome.
- Optional Gmail integration **only with explicit consent**, narrow scopes, and a clear privacy explanation.
- Optional calendar integration for interviews/follow-ups.
- Resume version library and application confirmation attachment.
- Rule-based insights, conversion funnel, and user-controlled weekly summary.
- Optional AI job-description summarization or matching, only after privacy and cost evaluation.
- Optional supported-form autofill with user review before submission.

### Explicitly out of MVP
- Auto-apply or bulk submission.
- Continuous cloud scraping or job discovery.
- AI-generated resumes and cover letters.
- Payment processing and subscriptions.
- Shared recruiter/team accounts.
- Guaranteed job interview or hiring outcomes.

## 8. Technical architecture

### Initial stack
- **Chrome Manifest V3**.
- **React + TypeScript + Vite**.
- **Popup** and **dashboard** as extension pages.
- **Extraction**: JobPosting JSON-LD → site-specific adapters → generic metadata → manual entry.
- **Persistence**: current prototype uses `chrome.storage.local`; planned review/migration to **IndexedDB** for richer records and event history.
- **Background service worker**: reminders, alarms, notifications (planned).
- **Testing**: TypeScript build, unit tests for normalization and storage, browser-based E2E tests, manual site test matrix.

### Why local-first?
- Faster onboarding and lower initial infrastructure cost.
- Reduced account-management and backend-security complexity.
- Offline access to saved records.

### Tradeoffs
- No automatic sync across devices.
- Data may be lost if the browser profile/extension storage is deleted.
- Notifications depend on browser and OS behavior.
- Local storage is **not equivalent to encrypted-at-rest protection** against anyone with access to the browser profile.
- Extension store review and privacy disclosures still matter.

### Proposed data model

```text
Application
  id: UUID
  title, company, url, normalizedUrl, source
  location, workMode, employmentType, salary?
  status: Saved|Applied|Interview|Offer|Rejected|Withdrawn|Archived
  savedAt, appliedAt?, followUpAt?
  resumeVersion?, recruiterContact?, notes?
  createdAt, updatedAt

ActivityEvent
  id, applicationId, type, previousValue?, nextValue?
  note?, createdAt

Reminder
  id, applicationId, dueAt, status, notifiedAt?, snoozedUntil?

Settings
  notificationsEnabled, defaultFollowUpDays, timezone, exportPreferences
```

Indexes: normalized URL, source/job ID where available, status, follow-up date, created date. Use schema versioning and migration tests.

### Permissions and security
- Ask only for required Chrome permissions.
- Prefer `activeTab` and user-initiated extraction over broad host access.
- Sanitize and validate imported records; enforce reasonable size limits.
- Avoid rendering extracted HTML as trusted HTML.
- Do not execute remote code in the extension.
- Avoid logging resume contents, emails, or sensitive application data.
- Explain precisely what is stored and whether any information leaves the device.

## 9. Development phases and exit criteria

### Phase 1 — Foundation **(core workflow verified)**
**Deliverables:** GitHub repository, React/TypeScript/Vite build, MV3 popup, dashboard, local save, initial extraction.

**Observed test:** A Naukri **Docker Engineer** listing from **Training Basket**, **Noida**, populated the popup and appeared in the dashboard after saving. This verifies one real-world capture/save path—not general site coverage.

**Remaining validation:** browser restarts, duplicate URL handling, invalid pages, import/export, and error paths.

### Phase 2 — Application management **(next)**
**Deliverables:** structured detail screen, full application fields, status history, contacts, notes, follow-up dates, source/job ID, storage migration decision.

**Exit criteria:** status changes produce immutable activity entries; users can edit without losing earlier data; records survive restart and migration; duplicate saves do not silently create new records.

### Phase 3 — Reliability and reminders
**Deliverables:** notifications, alarm scheduling, reminder settings, stronger extraction adapters for Naukri/LinkedIn/Indeed, manual fallback, CSV export, validated JSON import, tests.

**Exit criteria:** reminders fire when Chrome is running and notifications are allowed; clear blocked-notification behavior; backup/restore tested; site compatibility documented.

### Phase 4 — Beta and public launch
**Deliverables:** accessibility pass, permissions audit, privacy policy, screenshots, onboarding, support contact, Chrome Web Store submission, telemetry decision (opt-in only if added).

**Exit criteria:** no known critical data-loss bugs; tested on target Chrome versions; meaningful feedback from initial users; privacy disclosures match actual code.

### Phase 5 — Retention and differentiation
**Deliverables:** next-action dashboard, better India-focused extraction, application evidence trail, optional resume version organization, lightweight insights.

**Exit criteria:** repeat weekly use, reliable reminder completion, measurable time saved, and users expressing a clear reason to prefer ApplyTrack.

### Phase 6 — Monetization experiments (conditional)
**Deliverables:** pricing experiments, optional paid convenience features, payment/security architecture only if demand exists.

**Exit criteria:** evidence of repeat usage and willingness to pay. Do not build billing just because the extension can technically support it.

## 10. Current implementation audit

| Capability | Current state |
|---|---|
| MV3 extension, popup, dashboard | **Built and visually verified** |
| Naukri capture on one listing | **Verified** |
| Save job and show in dashboard | **Verified** |
| Search/filter, notes, dates, status editing | **Built; needs systematic testing** |
| Duplicate normalized URL detection | **Basic code exists; needs tests** |
| JSON export/import | **Basic code exists; needs robust validation/testing** |
| IndexedDB | **Not implemented** |
| Status/activity history | **Not implemented** |
| Chrome alarm notifications | **Not implemented** |
| CSV export | **Not implemented** |
| Site-specific Naukri/LinkedIn/Indeed adapters | **Not implemented** |
| Account sync, Gmail, AI, payments | **Not implemented / out of MVP** |

**Important architecture correction:** The current code uses `chrome.storage.local`, not IndexedDB. Decide and implement a migration before shipping event history and richer records. The current prototype should not be described as production-ready.

## 11. Validation and success metrics

### User research before public release
- Interview 10–15 active job seekers using Naukri/LinkedIn.
- Observe them tracking five real applications with their current workflow.
- Test whether “next action” and local-first privacy are actually valued.
- Ask what they currently use, what they dislike, and whether they would switch.
- Avoid leading questions such as “Would you love an India-first tracker?”

### Suggested product metrics
- **Capture success rate** on target job pages.
- **Median time to save** a valid job (target: under 30 seconds when extractable).
- **Duplicate detection accuracy** on URL variants.
- **Weekly active users / retained users**, if measured with consent or privacy-preserving self-reports.
- **Percentage of saved records later updated** to Applied/Interview/etc.
- **Follow-up actions completed**, not merely notifications shown.
- **Backup/restore success rate** and critical data-loss incidents.
- **User-reported value** versus spreadsheet and competitor alternatives.

### Initial quality gates
- No unrelated browsing history collected.
- All status changes explicitly user-controlled.
- Save and restore tested across browser restart.
- Export and import round-trip preserves records and activity.
- Permissions and privacy statement match the implementation.

## 12. Monetization and business model

### Initial approach
- **Free MVP** to establish trust, collect feedback, and validate retention.
- Avoid locking core tracking, notes, and basic export behind a paywall.

### Potential premium value (hypotheses)
- Optional encrypted sync across devices.
- Advanced workflow automation and configurable reminders.
- Advanced analytics and export templates.
- Optional email/calendar integrations, subject to permission, cost, and privacy review.
- Resume/document version management.

**Exploratory price hypothesis:** ₹199/month for an India-focused premium tier, **not validated**. Compare willingness to pay with free competitor alternatives, support costs, taxes, payment processing, and retention before adopting this price.

### Distribution
- Chrome Web Store listing and search optimization.
- Clear landing page with a short product demo.
- Honest developer build logs, GitHub README, and relevant communities.
- Referral from genuine users; avoid spam.
- Public roadmap and bug-reporting channel.

### Business risks
- Established competitors offer free trackers.
- Job-board markup and policies can change.
- Chrome permissions and store review can constrain functionality.
- Users may abandon tracking once they find a job; retention is naturally cyclical.
- Privacy or data-loss incidents would severely damage trust.
- Subscription revenue may not cover support and integration maintenance.

## 13. Prioritized backlog

### P0 — Must fix before public release
- Storage design and migration tests.
- Duplicate handling with canonical URLs/job IDs.
- Full record edit and activity history.
- Data validation and reliable backup/restore.
- Explicit save vs applied distinction.
- Security/privacy review and error states.
- Automated build/test workflow.

### P1 — Valuable for beta
- Naukri, LinkedIn, Indeed adapter tests.
- Reminders and in-app due list.
- CSV export and sorting.
- Better detail screen and next-action dashboard.
- Accessibility, keyboard navigation, responsive polish.

### P2 — After evidence of demand
- Email/calendar integrations.
- Optional sync.
- Resume version and confirmation evidence.
- Analytics and premium experiments.

## 14. Immediate next sprint

1. Audit existing repo and write a minimal automated test suite.
2. Define versioned application/activity/reminder schemas.
3. Implement status change history and a usable application detail view.
4. Decide IndexedDB migration and preserve existing `chrome.storage.local` records.
5. Test duplicate saves and the Naukri capture flow again.
6. Then implement notifications, export hardening, and other site adapters.

**Do not start with AI, billing, or a hosted backend.** The next milestone is a trustworthy application record with a complete history.

## 15. Decisions and open questions

### Locked decisions
- Name: **ApplyTrack** (working brand).
- Primary platform: Chrome extension.
- UI: Clean Professional, blue/white, full-tab dashboard.
- Default dashboard representation: list/table, not Kanban.
- Local-first, no mandatory login for MVP.
- Manual confirmation of application status.

### Open decisions
- Whether to fully migrate to IndexedDB or use a hybrid IndexedDB + chrome.storage settings design.
- Whether the public free product has any record limit (recommend none initially).
- What premium feature is valuable enough to charge for.
- Whether to support Firefox/Edge and when.
- Whether optional sync can be delivered with an acceptable privacy/security model.
- Whether the user research supports India-first positioning or a broader lightweight-tracker angle.

## 16. Product definition of done

ApplyTrack v1 is ready for public users when someone can install it, capture a real job, correct the details, record an application, see an accurate status history, schedule a follow-up, find that record later, and export/restore their data **without confusion or data loss**.

**Guiding question for every feature:** Does this make job tracking more accurate, faster, or more actionable for a real user? If not, defer it.
