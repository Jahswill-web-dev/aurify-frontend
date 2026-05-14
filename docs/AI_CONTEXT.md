# Aurify AI Context

This file is a working handoff document for AI collaborators entering the project. Keep it concise, current, and practical. Do not treat it as a replacement for reading the code; use it as the first orientation point before making changes.

## Project Snapshot

Aurify is a Next.js 14 App Router learning app. The current product direction is centered on a guided "Learn" flow inside the dashboard:

1. User enters a topic in `LearnScreen`.
2. `/api/parse-topic` extracts topic, subject, level, and goal.
3. `ConfirmationCard` lets the user confirm or adjust the setup.
4. `/api/generate-path` creates a structured module-based learning path.
5. `LearningPath` previews the full path before study begins.
6. `WorkspaceShell` opens the main learning workspace, where future Notes, Practice, Exam, Ask AI, and Progress tabs will live.

## Current Goals

- Build out the learning workspace progressively while preserving the shell structure.
- Keep workspace state local to `WorkspaceShell` until there is a clear need for shared or persisted state.
- Avoid building real tab content before its planned step; current tab components are placeholders only.

## Completed Work

- Topic parsing route and confirmation flow exist for the dashboard Learn section.
- Learning path generation route exists at `src/app/api/generate-path/route.js`.
- Learning path overview exists at `src/app/dashboard/_components/LearningPath.jsx`, including skeleton loading and animated module cards.
- Main workspace shell exists under `src/app/dashboard/_components/workspace/`.
- Workspace includes header, desktop module sidebar, mobile bottom drawer, tab bar, local dropdown state, active module state, and placeholder tab content.
- `LearningPath` supports `initialPath` so exiting the workspace returns to the existing overview without re-fetching the path.
- `getInitialLevel` and `getInitialGoal` in `WorkspaceShell` are null-safe because parsed setup values can be `null`.

## Current Phase

Learning flow foundation. Step 8, the main learning workspace shell, is complete. Future steps should fill tab content inside the existing shell rather than replacing the shell.

## Active Work

No active implementation task is in progress at the time of this update.

## Next Steps

- Step 9: build the Notes tab inside `workspace/tabs/NotesTab.jsx`.
- Step 10: build Practice tab content inside `workspace/tabs/PracticeTab.jsx`.
- Step 11: build Exam tab content inside `workspace/tabs/ExamTab.jsx`.
- Step 12: build Ask AI tab content inside `workspace/tabs/AskAITab.jsx`.
- Step 13: build Progress tab content inside `workspace/tabs/ProgressTab.jsx`.
- Investigate the existing `npm run build` failure caused by `/blog/[slug]` static page-data collection timing out after two attempts.

## Important Decisions

- Workspace state is intentionally local to `WorkspaceShell`; do not add Redux for this flow until persistence or cross-route sharing is required.
- Workspace tab files are placeholders only for now. Future work should replace their contents, not create parallel tab locations.
- The dashboard's existing main sidebar/navbar should not be modified for workspace tab work unless a future task explicitly asks for it.
- `learningPath === "loading"` is used as a transition trigger while the Learning Path overview fetches the generated path. Once Start Learning is clicked, `learningPath` becomes the full path object.
- Exiting the workspace sets `workspaceActive` to false and returns to `LearningPath` with `initialPath`, avoiding another generation request.
- Anthropic is used for topic parsing and path generation through server routes, relying on `ANTHROPIC_API_KEY` and optional `ANTHROPIC_MODEL`.

## Project Structure Notes

- `src/app/` contains the Next.js app routes, layouts, global styles, dashboard routes, auth callback, and API routes.
- `src/components/` contains shared and page-specific UI components.
- `public/images/` contains image assets.
- `public/icons/` contains icon and logo assets.
- `tailwind.config.js` defines the custom color and font-size tokens.
- `src/app/globals.css` defines global Tailwind layers, font imports, helper classes, dashboard styling, and markdown styling.
- `src/app/api/parse-topic/route.js` parses a raw learning request into a structured setup.
- `src/app/api/generate-path/route.js` generates a module-based learning path from confirmed setup values.
- `src/app/dashboard/_components/workspace/` contains the main learning workspace shell and tab placeholders.
- `src/app/dashboard/_components/workspace/tabs/` is the planned home for workspace tab content.

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

- Should workspace level/goal dropdown changes eventually regenerate notes/path content, or are they session-only preferences?
- Should learning path progress persist across sessions, and if so should it use Redux, backend storage, or local storage?
- Should `/blog/[slug]` be made dynamic or optimized to avoid the current static generation timeout?
