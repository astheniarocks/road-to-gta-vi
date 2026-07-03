# Codex Build Brief: GTA VI Timeline Loading Bar Web App

## Project Name

Working title: **Road to VI**  
Developed by: **Dreamfield Industries**

## Core Idea

Build a polished, responsive, Vercel-hostable web app centred on a GTA VI timeline loading bar.

The bar represents the journey from Rockstar first acknowledging the next Grand Theft Auto through to the current GTA VI release date.

Default timeline:

- Start date: `2022-02-04`
- End date: `2026-11-19`

The page should dynamically calculate and display:

```text
xx.xx% Complete
```

The user should be able to add, edit and configure timeline events such as Trailer 1, Trailer 2, the GTA VI leaks, release date announcements and launch day. Events should dynamically appear along the loading bar based on their dates.

This should be a scalable mini-site, not a single static page. It must support additional pages later, including lightweight web minigames.

---

## Important Build Philosophy

This is a **static, local-first, Vercel-hostable app**.

Do **not** build in v1:

- Backend
- Database
- Authentication
- Server-side saving
- Analytics
- Cookies
- Tracking
- Accounts
- User profiles

The intended publishing workflow is:

```text
Edit locally → export config/assets → commit to GitHub → Vercel redeploys
```

The public site should use committed source files and committed public assets.

The editor is for local authoring only. Changes made in the editor are stored in the user’s browser until exported and committed manually.

---

## Recommended Tech Stack

Use:

- React
- TypeScript
- Vite
- React Router
- CSS Modules or plain CSS with CSS custom properties
- Local browser storage for editor drafts
- No backend
- No database
- No authentication
- No analytics
- No cookies

Expected commands:

```bash
npm install
npm run dev
npm run build
npm run preview
```

The project should deploy cleanly to Vercel using the standard Vite build output.

---

## Routes / Pages

Create these routes:

### `/`

Main GTA VI timeline loading bar page.

### `/editor`

Local configuration editor.

Allows the user to:

- Add timeline events
- Edit timeline events
- Delete timeline events
- Change hero/logo image
- Change background image
- Adjust overlay settings
- Adjust theme colours
- Import config
- Export config
- Copy config as TypeScript

The editor must save drafts locally in the browser only.

### `/privacy`

Privacy policy page.

### `/games`

Future minigame hub page.

### `/games/bowling`

Placeholder page for a future joyful bowling minigame inspired by GTA IV bowling.

Do not build the full bowling game in v1. Create the route, layout and placeholder content only.

---

## Global Layout

The site should have:

- Top-left burger menu button
- Slide-out sidebar navigation
- Main content area
- Footer
- Responsive desktop, tablet and mobile layout

Sidebar navigation should include:

```text
Timeline
Editor
Minigames
Bowling
Privacy Policy
```

The sidebar should:

- Open from the left
- Close via close button
- Close when pressing Escape
- Close when clicking outside it
- Be keyboard accessible
- Work cleanly on mobile and desktop

The footer should sit at the bottom of the page and include:

```text
Developed by Dreamfield Industries
Privacy Policy
```

Footer must not obstruct content on small screens.

---

## Main Timeline Page

The main page should include:

1. Configurable hero/logo area
2. Dynamic percentage complete text
3. Loading bar
4. Current progress indicator
5. Dynamic milestone/event markers
6. Event cards positioned around the bar
7. Configurable background image
8. Configurable background overlay
9. Footer

The page should feel premium, fan-made and polished, but not overdone.

Avoid generic AI-style glassmorphism, excessive shadows and clutter.

---

## Timeline Date Logic

Default date range:

```ts
startDate: "2022-02-04"
endDate: "2026-11-19"
```

Progress calculation:

```ts
progress = (today - startDate) / (endDate - startDate)
```

Clamp progress between `0` and `1`.

Display percentage as:

```ts
`${(progress * 100).toFixed(2)}% Complete`
```

Each event position should be calculated as:

```ts
eventPosition = (eventDate - startDate) / (endDate - startDate)
```

Clamp visual positions between `0` and `1`.

If an event date falls outside the configured timeline range, the app should not crash. It should either visually clamp the marker to the nearest edge or display a warning in the editor.

Use date-safe calculations. Avoid timezone and daylight-saving bugs by parsing dates consistently as date-only values.

---

## Default Seed Events

Include these starter events in the default config:

```json
[
  {
    "id": "rockstar-announcement",
    "title": "Rockstar Confirms Next GTA",
    "date": "2022-02-04",
    "description": "Rockstar confirms active development of the next Grand Theft Auto.",
    "thumbnail": "",
    "importance": "major",
    "preferredPlacement": "below"
  },
  {
    "id": "gta-vi-leak",
    "title": "GTA VI Development Leak",
    "date": "2022-09-18",
    "description": "Major in-development footage leak appears online.",
    "thumbnail": "",
    "importance": "major",
    "preferredPlacement": "below"
  },
  {
    "id": "trailer-1",
    "title": "Trailer 1",
    "date": "2023-12-05",
    "description": "Rockstar releases Trailer 1 for Grand Theft Auto VI.",
    "thumbnail": "",
    "importance": "major",
    "preferredPlacement": "below"
  },
  {
    "id": "launch",
    "title": "Launch",
    "date": "2026-11-19",
    "description": "Grand Theft Auto VI launch date.",
    "thumbnail": "",
    "importance": "major",
    "preferredPlacement": "above"
  }
]
```

Do not bundle official Rockstar artwork or logos. Use placeholders only.

---

## Event Data Model

Use this TypeScript model or very close equivalent:

```ts
export type TimelineEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  thumbnail?: string;
  link?: string;
  importance?: "minor" | "normal" | "major";
  preferredPlacement?: "auto" | "above" | "below";
  category?: string;
};
```

---

## Site Config Model

Use a central config object:

```ts
export type SiteConfig = {
  siteTitle: string;
  startDate: string;
  endDate: string;

  hero: {
    image?: string;
    altText: string;
    maxHeightDesktop: number;
    maxHeightMobile: number;
    fit: "contain" | "cover";
    position: "center" | "top" | "bottom";
  };

  background: {
    image?: string;
    overlayColor: string;
    overlayOpacity: number;
    blur: number;
    position: string;
    fit: "cover" | "contain";
  };

  theme: {
    accentColor: string;
    barTrackColor: string;
    barFillColor: string;
    textColor: string;
    mutedTextColor: string;
    cardBackground: string;
    cardBorder: string;
  };

  timeline: {
    showThumbnails: boolean;
    mobileThumbnailBreakpoint: number;
    eventCollisionMode: "auto-lanes";
  };

  navigation: {
    showEditorLink: boolean;
    showGamesLink: boolean;
  };

  events: TimelineEvent[];
};
```

The published default config should live in:

```text
src/data/siteConfig.ts
```

---

## Published Config vs Local Draft Config

### Published Config

This is the committed config used by the public site.

Location:

```text
src/data/siteConfig.ts
```

This is what normal visitors see.

### Local Draft Config

This is the editor version stored in the user’s browser.

The editor should support:

- Save draft locally
- Load draft locally
- Reset draft to published config
- Import JSON config
- Export JSON config
- Copy config as TypeScript
- Validate config before export

The editor must never attempt to save changes to Vercel, GitHub, a database or a server.

---

## Image Handling

Images should support three source types:

```text
1. Public asset path
2. External URL
3. Local upload preview
```

### Public Asset Path

This is the preferred production workflow.

Example paths:

```text
/assets/logos/vi-logo.png
/assets/backgrounds/vice-bg.jpg
/assets/events/trailer-1.jpg
```

These files should be committed into the repo under:

```text
public/assets/
```

### External URL

Allow images from external URLs, but do not require them.

### Local Upload Preview

The editor should allow the user to upload an image locally for preview.

Important:

- Local uploads are only for local preview
- Local uploads should not be treated as published assets
- The editor should warn the user that locally uploaded images need to be added to `/public/assets/` and referenced by path before publishing
- Do not store large base64 image blobs in the committed config

Example editor warning:

```text
This image is currently a local browser preview. To publish it, add the image file to public/assets and update the config to use its asset path.
```

---

## Hero / Logo Behaviour

The hero/logo image should be highly configurable.

Requirements:

- User can set a hero/logo image
- Image must never be squashed
- Image must retain aspect ratio
- Transparent PNGs should work nicely
- Portrait images should not be forced into square spaces
- Huge wallpaper-like images should be constrained into a reasonable hero area
- The hero area should scale responsively with the viewport

Default behaviour:

```css
.heroImage {
  max-width: min(90vw, 720px);
  max-height: var(--hero-max-height);
  width: auto;
  height: auto;
  object-fit: contain;
}
```

Editor controls:

- Hero image path
- Hero local upload preview
- Hero alt text
- Max height desktop
- Max height mobile
- Fit mode: `contain` / `cover`
- Position: `center` / `top` / `bottom`

The image should look good whether the user provides:

- 600x600 logo PNG
- 1920x1080 wallpaper
- 4000x8000 portrait wallpaper
- Transparent logo
- Wide banner

---

## Background Behaviour

The background image should be configurable.

Requirements:

- User can set a background image
- Background defaults to `cover`
- Background should sit behind all page content
- A configurable overlay should sit above the background and below the content
- Overlay should improve readability and aesthetics
- Overlay opacity should be configurable
- Optional blur should be configurable
- Background image should not interfere with event readability

Suggested layering:

```tsx
<div className="backgroundLayer" />
<div className="backgroundOverlay" />
<main>...</main>
```

Editor controls:

- Background image path
- Background local upload preview
- Background fit: `cover` / `contain`
- Background position
- Overlay colour
- Overlay opacity
- Blur amount

---

## Loading Bar Visual Design

The loading bar should be the centrepiece.

Requirements:

- Large horizontal loading bar
- Rounded ends
- Track colour configurable
- Fill colour configurable
- Smooth fill animation on page load
- Current progress indicator
- Percentage text above or near bar
- Milestone markers positioned accurately
- Event cards connected visually to markers
- Looks good on desktop and mobile

Style direction:

- Dark, neon, Vice City-inspired palette
- Premium fan-site feel
- Clean and readable
- Not over-glossy
- Not generic template-looking
- Avoid excessive drop shadows
- Avoid clutter

---

## Event Marker and Card Behaviour

Each event should appear dynamically along the loading bar based on its date.

Each event should have:

- Marker dot or tick on the bar
- Event title
- Event date
- Optional thumbnail
- Optional description
- Optional link
- Optional importance styling

Default placement is below, but the layout should automatically place events above or below the bar to avoid overlapping.

### Collision Handling

Events may be close together, so the app must avoid ugly overlap.

Required behaviour:

1. Calculate each event’s x-position from its date
2. Sort events by date / position
3. Estimate card width based on viewport
4. Place cards into lanes
5. Prefer below-bar placement
6. Use above-bar placement when below is crowded
7. Use additional lanes if needed
8. Clamp cards so they do not hang off screen edges
9. Do not let cards block the loading bar
10. Do not allow horizontal page overflow

Suggested model:

```ts
type EventLane = {
  side: "above" | "below";
  laneIndex: number;
  occupiedRanges: Array<{
    left: number;
    right: number;
  }>;
};
```

---

## Responsive Behaviour

The app must work well on desktop, laptop, tablet and mobile.

### Desktop

- Show event thumbnails
- Show event cards above/below the bar
- Allow multiple lanes
- Show fuller event descriptions
- Hero image can be larger

### Tablet

- Reduce card width
- Show thumbnails if space allows
- Reduce description length if needed
- Maintain readable spacing

### Mobile

- Hide thumbnails below configurable breakpoint, default `520px`
- Event cards may become compact chips
- Title and date should remain visible
- Tap marker/card to expand more details
- Avoid horizontal overflow
- Reduce hero max height
- Keep loading bar readable
- Provide fallback event list underneath if there are too many clustered events

Suggested mobile fallback:

- Loading bar with markers
- Compact event list below
- Event list sorted by date
- Tapping marker highlights matching event
- Tapping event highlights matching marker

---

## Editor Page Requirements

The editor should be practical and hard to break.

### Timeline Settings

- Site title
- Start date
- End date
- Reset to defaults

### Event Management

- Add event
- Edit event
- Delete event
- Duplicate event
- Auto-sort events by date
- Validate event date
- Validate required fields
- Warn if event is outside timeline range

Each event editor should include:

- Title
- Date
- Description
- Thumbnail source type
- Thumbnail path / URL
- Local thumbnail preview upload
- Link
- Importance
- Preferred placement
- Category

### Hero Settings

- Hero image source type
- Hero image path / URL
- Local hero preview upload
- Alt text
- Max height desktop
- Max height mobile
- Fit
- Position

### Background Settings

- Background image source type
- Background image path / URL
- Local background preview upload
- Fit
- Position
- Overlay colour
- Overlay opacity
- Blur

### Theme Settings

- Accent colour
- Loading bar track colour
- Loading bar fill colour
- Text colour
- Muted text colour
- Card background
- Card border

### Config Tools

- Save draft locally
- Reset draft to published config
- Import JSON
- Export JSON
- Copy config as TypeScript
- Clear local draft
- Validate config

The editor should show clear guidance that local edits are not public until committed to the repo.

---

## Export / Commit Workflow

The editor should support the intended publishing workflow.

User workflow:

```text
1. Open /editor locally
2. Add or edit events
3. Preview the timeline
4. Export config JSON or copy TypeScript config
5. Add any required images to /public/assets/
6. Paste config into src/data/siteConfig.ts
7. Commit changes to GitHub
8. Vercel redeploys automatically
```

Add a visible help panel in `/editor` titled:

```text
How publishing works
```

Suggested copy:

```text
This editor saves changes locally in your browser. It does not publish changes to the live site by itself.

To publish changes, export the config, add any images to public/assets, update src/data/siteConfig.ts, commit to GitHub, and let Vercel redeploy the site.
```

---

## Privacy Requirements

The site must not collect user data.

Do not include:

- Analytics
- Cookies
- Tracking pixels
- Advertising scripts
- Account system
- Login system
- User profiles
- Server-side uploads
- Marketing tools
- External telemetry

The privacy page should clearly state:

```text
This website does not collect, sell, share, or use personal data.

There are no accounts, analytics, advertising trackers, marketing cookies, or server-side user profiles.

Any configuration changes made in the editor, including uploaded image previews, are stored locally in your own browser unless you choose to export or publish them yourself.

Dreamfield Industries does not receive or process those local edits.

Depending on where the site is hosted, the hosting provider may process standard technical request logs for security and reliability, but this website does not use those logs for analytics, advertising or profiling.
```

---

## Fan / Trademark Disclaimer

Add a small disclaimer on the privacy page and, if visually appropriate, near the footer or about section:

```text
This is an unofficial fan-made project. Grand Theft Auto, GTA, GTA VI, Rockstar Games and related marks are the property of their respective owners. This site is not affiliated with, endorsed by, or sponsored by Rockstar Games or Take-Two Interactive.
```

Do not bundle official Rockstar artwork, logos, screenshots, trailers or branding assets in the repo. Use placeholders only. The user can add their own assets later.

---

## Minigames Scalability

The app should be structured so future minigames can be added cleanly.

### `/games`

A simple minigame hub page.

Content:

```text
Dreamfield Industries Minigames
Small web toys and fan-made interactive experiments.
```

Show a card for Bowling.

### `/games/bowling`

Placeholder bowling page.

Content:

```text
Bowling
A future Dreamfield Industries minigame.

Coming later: timing, lane aim, ball weight, cheerful cousin pressure.
```

Include a button back to the main timeline. Do not build the full game yet.

---

## Suggested Project Structure

```text
src/
  app/
    App.tsx
    routes.tsx

  components/
    layout/
      Sidebar.tsx
      Footer.tsx
      PageShell.tsx

    timeline/
      TimelineBar.tsx
      TimelineEventCard.tsx
      TimelineMarker.tsx
      TimelineProgress.tsx
      useTimelineLayout.ts

    editor/
      ConfigEditor.tsx
      EventEditor.tsx
      ImageSourcePicker.tsx
      ThemeEditor.tsx
      ConfigImportExport.tsx

  data/
    siteConfig.ts
    defaultConfig.ts

  pages/
    TimelinePage.tsx
    EditorPage.tsx
    PrivacyPage.tsx
    GamesPage.tsx
    BowlingPage.tsx

  storage/
    configStorage.ts

  utils/
    dateMath.ts
    configValidation.ts
    assetHelpers.ts

  styles/
    global.css
    tokens.css

  games/
    bowling/
      BowlingPlaceholder.tsx
      bowling.css

public/
  assets/
    backgrounds/
    events/
    logos/
    placeholders/

docs/
  USER_GUIDE.md
  CONFIG_GUIDE.md
  DEPLOYMENT_GUIDE.md
```

---

## Documentation Deliverables

Codex must produce clear documentation. Do not skip this.

Create:

```text
README.md
docs/USER_GUIDE.md
docs/CONFIG_GUIDE.md
docs/DEPLOYMENT_GUIDE.md
```

The documentation should be written for a non-developer. Avoid assuming the user knows React, Vite, Git or Vercel deeply. Use plain English and practical step-by-step instructions.

---

## README Requirements

The README should include:

1. What the app is
2. What it does
3. How the local-first workflow works
4. How to install dependencies
5. How to run locally
6. How to build
7. How to preview production build
8. Project structure
9. Privacy notes
10. Future minigame expansion notes

Include:

```bash
npm install
npm run dev
npm run build
npm run preview
```

---

## User Guide Requirements

Create:

```text
docs/USER_GUIDE.md
```

This should be the idiot-proof guide. Tone: plain, calm, direct, not patronising.

Include these sections:

1. What this site does
2. What the editor is for
3. Important: local edits are not public
4. Adding a new timeline event
5. Adding an event thumbnail
6. Changing the hero/logo image
7. Changing the background
8. Exporting changes
9. Publishing changes
10. Resetting mistakes
11. Common problems

Required copy for local edits:

```text
The editor saves changes in your own browser. It does not update the live website by itself.

To make changes public, you need to export the config, update the project files, commit the changes and let Vercel redeploy.
```

Adding a new event should include:

```text
1. Open /editor
2. Go to Events
3. Click Add Event
4. Enter the event title
5. Enter the date in YYYY-MM-DD format
6. Add a description if needed
7. Add a thumbnail path if you have one
8. Save the draft
9. Preview the timeline
```

Publishing changes should include:

```text
1. Export or copy the config from /editor
2. Add image files to public/assets
3. Update src/data/siteConfig.ts
4. Commit the changes to GitHub
5. Vercel redeploys the site
6. Check the live site
```

Common problems should cover:

- Event does not appear in the right place
- Image appears locally but not live
- Live site did not change
- Background makes text hard to read
- Events overlap on mobile

---

## Config Guide Requirements

Create:

```text
docs/CONFIG_GUIDE.md
```

This should explain:

- Where the published config lives
- What each config field does
- How event dates work
- How image paths work
- How theme colours work
- How to add new events manually
- How to safely edit config without breaking the app

Include a fully worked event example:

```ts
{
  id: "trailer-2",
  title: "Trailer 2",
  date: "2025-05-06",
  description: "Rockstar releases Trailer 2.",
  thumbnail: "/assets/events/trailer-2.jpg",
  importance: "major",
  preferredPlacement: "auto"
}
```

---

## Deployment Guide Requirements

Create:

```text
docs/DEPLOYMENT_GUIDE.md
```

This should explain:

- How to run the app locally
- How to build it
- How to deploy with Vercel
- How Vercel redeploys when GitHub changes
- Where to place images
- How to check the production build before pushing

Include:

```bash
npm run build
npm run preview
```

Also include a publish checklist:

```text
Before publishing:
[ ] Timeline looks correct locally
[ ] Events are in the right place
[ ] Mobile layout checked
[ ] Images are committed under public/assets
[ ] Config updated in src/data/siteConfig.ts
[ ] Privacy page still accurate
[ ] Build passes
```

---

## Accessibility Requirements

The app should be accessible.

Requirements:

- Sidebar can be opened with keyboard
- Sidebar can be closed with Escape
- Buttons have accessible labels
- Event markers have aria labels
- Timeline events are keyboard reachable
- Links have clear text
- Images have alt text where useful
- Colour contrast should be readable
- Respect `prefers-reduced-motion`
- Do not rely on colour alone to communicate important information

---

## Performance Requirements

The app should stay lightweight.

Requirements:

- Avoid unnecessary libraries
- Lazy-load thumbnails where sensible
- Avoid huge base64 images in committed config
- Debounce editor changes
- Avoid horizontal overflow
- Avoid layout jank
- Keep animations smooth but restrained
- Respect reduced motion settings
- Large uploaded image previews should not break the editor

---

## Validation Requirements

Add config validation.

Validation should catch:

- Missing event title
- Missing event date
- Invalid date format
- Event outside timeline range
- Duplicate event ID
- Missing hero alt text when hero image is set
- Invalid colour values where practical
- Empty asset paths
- Suspicious local-only image references in exported config

The editor should show friendly warnings rather than crashing.

---

## Visual Direction

Aim for:

- Dark
- Neon
- Vice City-inspired
- Clean
- Premium
- Responsive
- Readable
- Fan-site polished

Avoid:

- Overdone glassmorphism
- Excessive shadows
- Generic template look
- Tiny unreadable text
- Layouts that only work on desktop
- Mobile horizontal scrolling
- Huge bloated UI libraries

The loading bar should feel like the hero component.

The page should still look good even if the user has not added custom images yet.

---

## Acceptance Criteria

The app is complete when:

1. `npm install` works.
2. `npm run dev` starts the app.
3. `npm run build` completes successfully.
4. `npm run preview` serves the production build.
5. The homepage displays the GTA VI progress loading bar.
6. The timeline defaults to `2022-02-04` through `2026-11-19`.
7. The percentage complete is calculated dynamically.
8. Events appear at the correct proportional positions.
9. Close events do not visibly overlap on desktop.
10. Mobile layout remains usable.
11. Thumbnails hide or simplify on small screens.
12. Hero images retain aspect ratio and do not get squashed.
13. Background image has configurable overlay.
14. The editor can add, edit and delete events.
15. The editor saves drafts locally.
16. The editor can reset to published config.
17. The editor can import JSON.
18. The editor can export JSON.
19. The editor can copy TypeScript config.
20. The editor clearly explains that edits are local until committed.
21. The footer shows `Developed by Dreamfield Industries`.
22. Privacy Policy is linked from footer and sidebar.
23. Privacy Policy states that the website does not collect user data.
24. Sidebar navigation works.
25. `/games` route exists.
26. `/games/bowling` route exists as a placeholder.
27. Documentation files are created.
28. User Guide is written in plain English.
29. Config Guide explains how to edit the site manually.
30. Deployment Guide explains the Vercel/GitHub workflow.
31. No backend, database, authentication, analytics, cookies or tracking are implemented.
32. No official Rockstar assets are bundled in the repo.
