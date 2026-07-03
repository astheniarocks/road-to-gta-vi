# Road to VI Deployment Guide

This app is designed for Vercel and other static hosting services.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Build The App

```bash
npm run build
```

The production files are generated in `dist/`.

## Preview The Production Build

```bash
npm run preview
```

Open the preview URL shown in the terminal. This lets you check the built version before publishing.

## Deploy With Vercel

1. Push the project to GitHub
2. Create a Vercel project
3. Connect the GitHub repository
4. Use the default Vite settings
5. Vercel runs the build
6. Vercel serves the built site

For a normal Vite project, Vercel should detect:

```text
Build command: npm run build
Output directory: dist
```

## How Redeploys Work

When you commit changes to GitHub, Vercel detects the new commit and builds the site again.

The live site changes only after Vercel finishes that redeploy.

## Where To Place Images

Put published images under:

```text
public/assets/
```

Suggested folders:

```text
public/assets/logos/
public/assets/backgrounds/
public/assets/events/
public/assets/placeholders/
```

Reference them in config with paths like:

```text
/assets/events/trailer-2.jpg
```

## Check Before Pushing

Run:

```bash
npm run build
npm run preview
```

Then check:

- Timeline page
- Editor page
- Privacy page
- Games page
- Bowling placeholder page
- Mobile layout

## Publish Checklist

Before publishing:

[ ] Timeline looks correct locally
[ ] Events are in the right place
[ ] Mobile layout checked
[ ] Images are committed under public/assets
[ ] Config updated in src/data/siteConfig.ts
[ ] Privacy page still accurate
[ ] Build passes
