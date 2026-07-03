# Road to VI User Guide

This guide explains how to use the site and editor in plain steps.

## 1. What This Site Does

Road to VI shows a GTA VI countdown and progress timeline. The default timeline starts on `2022-02-04` and ends on `2026-11-19`.

The loading bar updates automatically based on the current date. Events such as trailers, announcements, leaks, or launch day appear along the bar based on their dates.

## 2. What The Editor Is For

Open `/editor` to experiment with:

- Timeline dates
- Events
- Event thumbnails
- Hero or logo image
- Background image
- Background overlay
- Theme colours

## 3. Important: Local Edits Are Not Public

The editor saves changes in your own browser. It does not update the live website by itself.

To make changes public, you need to export the config, update the project files, commit the changes and let Vercel redeploy.

## 4. Adding A New Timeline Event

1. Open `/editor`
2. Go to Events
3. Click Add Event
4. Enter the event title
5. Enter the date in YYYY-MM-DD format
6. Add a description if needed
7. Add a thumbnail path if you have one
8. Save the draft
9. Preview the timeline

## 5. Adding An Event Thumbnail

You can use a local preview image while editing, but that image is only available in your own browser.

For the live site, add the image file to `public/assets/events/` and use a path like:

```text
/assets/events/trailer-2.jpg
```

If an image works locally but not live, it is probably still a local preview.

## 6. Changing The Hero Or Logo Image

Go to Hero in `/editor`.

Set the image source, alt text, maximum desktop height, maximum mobile height, fit mode, and position.

Use `contain` if you want to make sure the image is never cropped. This is usually best for transparent logos, square images, wide banners, and portrait artwork.

## 7. Changing The Background

Go to Background in `/editor`.

You can set:

- Background image path
- Fit mode
- Position
- Overlay colour
- Overlay opacity
- Blur

If text becomes hard to read, increase overlay opacity or choose a darker overlay colour.

## 8. Exporting Changes

Go to Config in `/editor`.

You can:

- Export JSON
- Copy JSON
- Copy config as TypeScript

Fix validation errors before exporting. Warnings are allowed, but read them before publishing.

## 9. Publishing Changes

1. Export or copy the config from `/editor`
2. Add image files to `public/assets`
3. Update `src/data/siteConfig.ts`
4. Commit the changes to GitHub
5. Vercel redeploys the site
6. Check the live site

## 10. Resetting Mistakes

Use these buttons in `/editor`:

- Reset to published config
- Clear local draft
- Import a previous exported config

Resetting the local draft does not delete the published site config.

## 11. Common Problems

### Event Does Not Appear In The Right Place

Check the date format. It must be `YYYY-MM-DD`. Also check that the event date is inside the configured timeline range.

### Image Appears Locally But Not Live

You probably used a local preview image. Add the image to `public/assets/` and use a public asset path.

### Live Site Did Not Change

Check that you updated `src/data/siteConfig.ts`, committed the change to GitHub, and waited for Vercel to finish redeploying.

### Background Makes Text Hard To Read

Increase overlay opacity or choose a darker overlay colour.

### Events Overlap On Mobile

Use shorter titles where possible. The mobile layout also includes a compact event list underneath the bar.
