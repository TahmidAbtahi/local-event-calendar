# DMV Zouk Calendar

A live community calendar for DC Metro Area Brazilian Zouk events, auto-synced from the [community Google Sheet](https://docs.google.com/spreadsheets/d/1YHB3_Qgpo4lu7fCcDGJ5JwF-NBKxbqX2YjcxSTZa5EE/edit?pli=1&gid=559538023#gid=559538023).

## How it works

- **Next.js server component** fetches the Google Sheet as CSV on each request
- **ISR (Incremental Static Regeneration)** caches the page for 5 minutes, so the site stays fast but updates automatically when the spreadsheet changes
- **No database, no API keys** — the Google Sheet must be "Published to the web" as CSV

## Prerequisites

The Google Sheet owner must publish it:
1. Open the sheet → **File** → **Share** → **Publish to web**
2. Select the **"Upcoming Events"** tab and **CSV** format
3. Click **Publish** (the export URL in `lib/sheets.js` should already work for public sheets)

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel (Easiest)

### Option A: Vercel Git Integration (recommended)
1. Push this repo to GitLab
2. Go to [vercel.com](https://vercel.com) → **New Project** → **Import Git Repository**
3. Connect your GitLab account and select this repo
4. Click **Deploy** — done! Every push to `main` auto-deploys.

### Option B: GitLab CI Pipeline
1. Create a Vercel project: `npx vercel`
2. Add these CI/CD variables in GitLab → Settings → CI/CD → Variables:
   - `VERCEL_TOKEN` — from https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` — from `.vercel/project.json`
   - `VERCEL_PROJECT_ID` — from `.vercel/project.json`
3. Push to `main` and the pipeline will deploy automatically.

## Project Structure

```
├── app/
│   ├── layout.js          # Root layout + metadata
│   ├── globals.css         # Base styles
│   ├── page.js             # Server component (fetches events)
│   └── CalendarApp.js      # Client component (interactive calendar UI)
├── lib/
│   └── sheets.js           # Google Sheets CSV fetcher + parser
├── .gitlab-ci.yml          # GitLab CI → Vercel deploy pipeline
├── next.config.js
└── package.json
```

## Customization

- **Refresh interval**: Change `revalidate` in `app/page.js` (seconds)
- **Event classification**: Edit keywords in `lib/sheets.js` (`FESTIVAL_KEYWORDS`, `SOCIAL_KEYWORDS`)
- **Styling**: All styles are inline in `CalendarApp.js`
