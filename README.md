# Aurify

Aurify is a Next.js learning app. The dashboard Learn flow guides a user from a raw topic request into a confirmed setup, generated learning path, and workspace shell for studying.

## Current Learn Flow

1. `LearnScreen` collects the user's topic or learning request.
2. `/api/parse-topic` extracts a structured setup.
3. `ConfirmationCard` lets the user confirm or adjust the setup.
4. `/api/generate-path` generates a module-based learning path.
5. `LearningPath` previews modules and starts the session.
6. `WorkspaceShell` hosts the study workspace with Notes, Practice, Exam, Ask AI, and Progress tabs.

The workspace tab components are placeholders for now. Future work should fill the files in `src/app/dashboard/_components/workspace/tabs/`.

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
