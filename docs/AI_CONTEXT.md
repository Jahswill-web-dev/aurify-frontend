# Aurify AI Context

This file is a working handoff document for AI collaborators entering the project. Keep it concise, current, and practical. Do not treat it as a replacement for reading the code; use it as the first orientation point before making changes.

## Project Snapshot

To be filled in as the project direction becomes clearer.

## Current Goals

To be added as goals are defined.

## Completed Work

To be updated as features, fixes, and documentation are completed.

## Current Phase

To be defined when phase tracking begins.

## Active Work

To be updated when there is work in progress.

## Next Steps

To be added as upcoming tasks become clear.

## Important Decisions

Record architectural, design, product, or workflow decisions here after they are made.

## Project Structure Notes

- `src/app/` contains the Next.js app routes, layouts, global styles, dashboard routes, auth callback, and API routes.
- `src/components/` contains shared and page-specific UI components.
- `public/images/` contains image assets.
- `public/icons/` contains icon and logo assets.
- `tailwind.config.js` defines the custom color and font-size tokens.
- `src/app/globals.css` defines global Tailwind layers, font imports, helper classes, dashboard styling, and markdown styling.

## Styling Reference

Use `docs/DESIGN_SYSTEM.md` as the source of truth for the current website color scheme, fonts, typography, and style conventions.

## Development Notes

- Package manager: npm, based on the existing `package-lock.json`.
- Main framework: Next.js.
- Styling: Tailwind CSS with custom tokens in `tailwind.config.js`.
- State management appears to use Redux Toolkit through `src/app/lib/StoreProvider.js` and feature slices in `src/app/lib/features/`.

## AI Collaboration Rules

- Read relevant files before making changes.
- Keep edits scoped to the requested task.
- Preserve existing user or teammate changes.
- Update this file when meaningful project context, phase state, or handoff information changes.
- Update `docs/DESIGN_SYSTEM.md` when the visual system changes.
- Avoid adding project goals or progress notes until they are intentionally defined.

## Open Questions

Add unresolved questions here when they affect implementation choices.
