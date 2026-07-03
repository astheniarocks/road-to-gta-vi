# Road to VI Config Guide

The published config lives here:

```text
src/data/siteConfig.ts
```

This file controls what normal visitors see. The editor draft in your browser is separate until you copy or export it into this file.

## Main Fields

### `siteTitle`

The site name shown in the editor and used as the main title.

### `startDate`

The start of the loading bar. Use `YYYY-MM-DD`.

Default:

```text
2022-02-04
```

### `endDate`

The end of the loading bar. Use `YYYY-MM-DD`.

Default:

```text
2026-11-19
```

### `hero`

Controls the logo or hero image above the timeline.

- `image`: Public path or URL
- `altText`: Text description for accessibility
- `maxHeightDesktop`: Maximum height on desktop
- `maxHeightMobile`: Maximum height on mobile
- `fit`: `contain` or `cover`
- `position`: `center`, `top`, or `bottom`

### `background`

Controls the page background.

- `image`: Public path or URL
- `overlayColor`: CSS colour over the background
- `overlayOpacity`: Number from `0` to `1`
- `blur`: Blur amount in pixels
- `position`: CSS background position, such as `center`
- `fit`: `cover` or `contain`

### `theme`

Controls colours.

You can use normal CSS colour values such as:

```text
#ff4fd8
rgba(21, 14, 25, 0.88)
white
```

### `timeline`

Controls timeline display behaviour.

- `showThumbnails`: Shows thumbnails on larger screens
- `mobileThumbnailBreakpoint`: Hides thumbnails below this width
- `eventCollisionMode`: Currently `auto-lanes`

### `navigation`

Controls sidebar links.

- `showEditorLink`
- `showGamesLink`

### `events`

The timeline events.

Each event can include:

- `id`
- `title`
- `date`
- `description`
- `thumbnail`
- `link`
- `importance`
- `preferredPlacement`
- `category`

## How Event Dates Work

Dates must use this format:

```text
YYYY-MM-DD
```

The app parses dates as date-only values to avoid timezone and daylight-saving bugs.

Event position is calculated from:

```text
event date between start date and end date
```

Events outside the range do not crash the app. They are visually clamped to the nearest edge and shown as validation warnings in the editor.

## How Image Paths Work

For published images, place files under `public/assets/`.

Examples:

```text
/assets/logos/vi-logo.png
/assets/backgrounds/vice-bg.jpg
/assets/events/trailer-2.jpg
```

Local preview images from the editor are only for your browser. Do not publish `blob:`, `data:`, or `file:` image references.

## Fully Worked Event Example

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

## Adding Events Manually

1. Open `src/data/siteConfig.ts`
2. Find the `events` array
3. Add a new event object
4. Make sure the `id` is unique
5. Use a valid `YYYY-MM-DD` date
6. Save the file
7. Run `npm run build`

## Safely Editing Config

- Keep commas between event objects
- Keep strings inside quotes
- Use unique event IDs
- Use public asset paths for images
- Run the app locally before publishing
- Run `npm run build` before committing
