# ApplyTrack

A local-first Chrome Manifest V3 job application tracker. **Early prototype v0.2.**

See [Product Master Plan](docs/PRODUCT_MASTER_PLAN.md) for the vision, competitor landscape, and roadmap.

## Build and install

1. Install Node.js 20+.
2. Run `npm install` and `npm run build`.
3. Visit `chrome://extensions`, enable Developer mode, click **Load unpacked**, and select this project's `dist` directory.
4. After a code update, rebuild and click **Reload** on the existing extension card. **Do not remove and reinstall the extension** if you want to keep local data.

The Vite build automatically copies `public/manifest.json` into `dist`.

## Available in source

- Job title, company, location, URL extraction from structured JobPosting metadata where available.
- Manual corrections and duplicate URL check when saving from the popup.
- Application dashboard: search, filters, sorting, editable status.
- Detailed application fields: salary, work arrangement, employment type, applied/follow-up dates, recruiter, resume version, notes.
- Timestamped history for future status changes.
- Due follow-up filter, JSON backup/import, CSV export.
- Local extension storage, no accounts or backend.

## Preserving existing v0.1 data

The v0.2 model deliberately continues using the **same `applytrack_jobs_v1` key** in `chrome.storage.local`. Older jobs will display with empty optional fields and empty history (past changes cannot be reconstructed). New status changes are recorded. Your existing jobs should remain available **as long as you update/reload the same installed extension ID**.

**Before upgrading:** Open the v0.1 dashboard and use **Export JSON backup**. Keep the file somewhere safe. Then pull the latest code, rebuild, and reload the extension.

## Test checklist

- [ ] Existing v0.1 saved job remains visible after upgrade
- [ ] Edit an application title, contact, notes and follow-up date; reload dashboard and verify persistence
- [ ] Change status Saved → Applied → Interview; confirm activity timeline entries in Details
- [ ] Verify entering Details and choosing Cancel does not overwrite data
- [ ] Export JSON, open backup file, verify new details/history
- [ ] Export CSV and check fields
- [ ] Try saving the same job URL twice; verify the record updates rather than duplicates
- [ ] Follow-up date today is shown as due
- [ ] Confirm app still works after restarting Chrome

## Known limitations

- The Phase 2 update has been committed but is **not yet independently compiled or browser-tested**; run `npm run build` and report errors.
- Records still use `chrome.storage.local`, not IndexedDB; richer migration is a future decision.
- Existing v0.1 records have no retrospective status history.
- Full history records *status changes*, not every field edit.
- Follow-up due dates are visible; automatic notifications are not implemented.
- Extraction varies by site; no dedicated Naukri/LinkedIn/Indeed adapters yet.
- JSON import is not a hardened schema migration mechanism; only import trusted backups.
- No sync, email integration, AI, billing, or automatic applying.

## Privacy

Job records stay in Chrome extension local storage. The extension does not contact an ApplyTrack backend. Exported files are stored wherever the user chooses to save them.
