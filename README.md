# ApplyTrack

A local-first Chrome Manifest V3 job application tracker (early prototype).

## Build and install

1. Install Node.js 20+.
2. Run `npm install` and `npm run build`.
3. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select the generated `dist` directory.

The extension manifest is copied automatically from `public/manifest.json` during the Vite build.

## Implemented in source

- Popup with editable job details, current page URL and basic JobPosting JSON-LD extraction.
- Save or update application records using Chrome local extension storage.
- Dashboard with search, status filters, editing, notes, follow-up dates, deletion and JSON export/import.

## Limitations

- Not yet compiled or tested in Chrome; functionality is provisional.
- Automatic reminders, activity history, CSV export, and dedicated site adapters are not implemented.
- Job title fallback from browser tab title may be inaccurate.
- JSON import has basic shape checks only; only import trusted backups.
- No cloud sync, user accounts, payments, AI, or automatic application submission.

## Privacy

The prototype does not send job data to any backend. It stores records in the extension's local Chrome storage. Exported backups are stored wherever the user saves them.
