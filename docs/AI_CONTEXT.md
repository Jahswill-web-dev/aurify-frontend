# Aurify AI Context

This file is a working handoff document for AI collaborators entering the project. Keep it concise, current, and practical. Do not treat it as a replacement for reading the code; use it as the first orientation point before making changes.

## Project Snapshot

Aurify is a Next.js 14 App Router learning app. The current product direction is centered on the Studies flow:

1. `/dashboard` opens the main Dashboard tab by default.
2. Users create a Study from `/studies/new`.
3. The create flow infers title, subject, level, goal, timing, sections, practice count, and exam count from the prompt.
4. Generating a Study routes to `/studies/[studyId]`.
5. The Study workspace provides Overview, Material, Practice, Exam Mode, and Analytics tabs.

## Current Goals

- Keep `/studies` as the primary learning and study workspace flow.
- Keep `/dashboard` focused on overview, recent studies, summaries, practice, scores, and navigation into Studies.
- Avoid reintroducing the removed dashboard Learn path flow unless product direction changes explicitly.

## Completed Work

- The old dashboard Learn tab and generated learning-path flow were removed.
- `/dashboard` now defaults to the Dashboard section.
- `/studies`, `/studies/new`, and `/studies/[studyId]` provide the active study creation and workspace experience.
- Study workspace content is currently backed by `src/data/mockStudies.js`.

## Current Phase

Studies flow foundation. Future work should improve study creation, persistence, generation, and workspace behavior inside the existing Studies routes.

## Active Work

No active implementation task is in progress at the time of this update.

## Next Steps

- Connect Study creation to the intended backend or generation service when ready.
- Persist created Studies instead of relying only on mock data.
- Improve Study workspace behavior while keeping the existing Overview, Material, Practice, Exam Mode, and Analytics structure.
- Investigate the existing `npm run build` failure caused by `/blog/[slug]` static page-data collection timing out after two attempts.

## Important Decisions

- The dashboard Learn tab is no longer part of the product surface.
- The old dashboard learning-path API routes and workspace components were removed because Studies owns the learning workflow.
- The dashboard main sidebar should link users to Studies and Create Study instead of offering a separate Learn flow.

## Project Structure Notes

- `src/app/` contains the Next.js app routes, layouts, global styles, dashboard routes, auth callback, and API routes.
- `src/app/studies/` contains the active studies list, create study page, and study workspace route.
- `src/data/mockStudies.js` provides mock study data and plan generation helpers for the current Studies flow.
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
- `npm run lint` currently passes.
- `npm run build` compiles and passes lint/type checks, then fails during page data collection for `/blog/[slug]` with a static generation timeout. Treat that as a known pre-existing build blocker unless working on blog routes.
- A running Next dev server can lock `.next/trace` on Windows and cause an `EPERM` build failure. Stop the dev server before retrying a production build.

## AI Collaboration Rules

- Read relevant files before making changes.
- Keep edits scoped to the requested task.
- Preserve existing user or teammate changes.
- Update this file when meaningful project context, phase state, or handoff information changes.
- Update `docs/DESIGN_SYSTEM.md` when the visual system changes.
- Avoid adding project goals or progress notes until they are intentionally defined.

## Open Questions

- How should generated Studies be persisted once mock data is replaced?
- Which backend or AI service should own Study material, practice, exam, and analytics generation?
- Should `/blog/[slug]` be made dynamic or optimized to avoid the current static generation timeout?
