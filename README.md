# Aurify

Aurify is a Next.js learning app. The current product direction uses the Studies flow: users create a Study from a prompt, preview a generated plan, then continue in a dedicated study workspace with material, practice, exam mode, and analytics.

## Current Studies Flow

1. `/dashboard` opens the main Dashboard tab by default.
2. Dashboard actions can send users to `/studies/new`.
3. `/studies/new` collects a study prompt and previews the generated study plan.
4. Generating the study routes to `/studies/[studyId]`.
5. The study workspace hosts Overview, Material, Practice, Exam Mode, and Analytics tabs.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

Run lint:

```bash
npm run lint
```

Run a production build:

```bash
npm run build
```

Known note: the build currently compiles and passes lint/type checks, then fails while collecting page data for `/blog/[slug]` because that route times out during static generation. If a Next dev server is running on Windows, it can also lock `.next/trace`; stop the dev server before retrying `npm run build`.

## Project Docs

- `docs/AI_CONTEXT.md` is the main handoff file for AI collaborators.
- `docs/PROJECT_STRUCTURE.md` documents folders, routes, and important files.
- `docs/DESIGN_SYSTEM.md` documents the visual system and UI conventions.
