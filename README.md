# BMI Buddy — Setup Guide

## 1. Deploy
Push these files (keep folder structure intact) to GitHub, then import the
repo into Vercel (vercel.com → Add New → Project). Vercel auto-detects
the `/api` folder as serverless functions — no config needed.

## 2. Turn on the "Get health tips" AI button
This button calls `/api/tips.js`, which calls Google Gemini's free API.
The key never touches the browser — it's a server-side environment
variable.

1. Get a free key: https://aistudio.google.com/apikey (Google account, no
   credit card needed for the free tier).
2. In your Vercel project: **Settings → Environment Variables**
   - Name: `GEMINI_API_KEY`
   - Value: (paste your key)
   - Environment: Production (and Preview if you want it there too)
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy) so the function picks
   up the new variable.
4. Open your live site, calculate a result, click "Get health tips for
   my result" — it should stream back tips within a couple seconds.

If you ever remove the environment variable or run out of free quota,
the button shows a clear error message instead of breaking the page.

## 3. Files
- `index.html` — the whole site (calculator + gauge + tips UI)
- `manifest.json`, `sw.js`, `icons/` — makes it installable as an app (PWA)
- `api/tips.js` — the serverless function that talks to Gemini

## 4. Ads
Once live on your own domain, you can add Google AdSense (or another
network) by pasting their script tag into `index.html`'s `<head>`. See
notes from our chat about health-content policy requirements before
applying.
