# Road to VI

Road to VI is a polished, local-first fan timeline for the road to GTA VI. It shows a dynamic loading bar from `2022-02-04` to `2026-11-19`, calculates the current percentage complete, and places configurable events along the bar.

Developed by Dreamfield Industries.

## What It Does

- Shows the GTA VI timeline progress as `xx.xx% Complete`.
- Places milestone cards along the loading bar based on event dates.
- Moves close events into lanes above or below the bar to avoid overlap.
- Includes a local editor for events, hero image, background image, overlay settings, and theme colours.
- Supports future pages and minigames through React Router.
- Includes `/games` and `/games/bowling` placeholder routes.
- Includes a privacy policy that explains the site does not collect user data.

## Local-First Workflow

The public site reads from committed files:

- `src/data/siteConfig.ts`
- `public/assets/`

The editor at `/editor` saves drafts in your own browser only. It does not publish changes to Vercel, GitHub, a database, or a server.

The intended workflow is:

1. Edit locally in `/editor`
2. Export the config
3. Add any images to `public/assets`
4. Update `src/data/siteConfig.ts`
5. Commit to GitHub
6. Let Vercel redeploy

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

Open the local URL shown in the terminal.

## Build

```bash
npm run build
```

## Hiding The Editor In Production

Set this environment variable in Vercel if you want `/editor` to redirect to the timeline on the live site:

```bash
VITE_ENABLE_EDITOR=false
```

Local development keeps the editor enabled by default.

## Preview The Production Build

```bash
npm run preview
```

## Project Structure

```text
src/
  app/                 App and routes
  components/
    editor/            Local config editor
    layout/            Sidebar, shell and footer
    timeline/          Loading bar, markers and layout logic
  data/                Published site config
  games/               Future minigames
  pages/               Route pages
  storage/             Browser localStorage helpers
  styles/              Global CSS
  types/               Shared TypeScript models
  utils/               Date math, validation and asset helpers
public/assets/         Committed public images
docs/                  User, config and deployment guides
```

## Privacy Notes

The site has no backend, database, authentication, analytics, cookies, tracking pixels, advertising scripts, accounts, or user profiles.

Editor drafts and local image previews stay in the browser unless you export them yourself.

## Future Minigames

The app already has a minigame hub at `/games` and a bowling placeholder at `/games/bowling`. Future minigames can live under `src/games/` and receive their own route.

## Fan Project Note

This is an unofficial fan-made project. No official Rockstar artwork, logos, screenshots, trailers, or branding assets are bundled in this repo. The included visuals are placeholders.
