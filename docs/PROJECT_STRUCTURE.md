# Aurify Project Structure

This file documents the main folders and files in the Aurify project, with a brief description of what each area is responsible for. Update it when new folders, routes, major components, or project documents are added.

## Root Files

| Path | Description |
| --- | --- |
| `README.md` | Default project readme with basic Next.js setup instructions. |
| `package.json` | Defines project scripts and dependencies for the Next.js app. |
| `package-lock.json` | Locks installed npm dependency versions. |
| `next.config.mjs` | Next.js configuration file. |
| `tailwind.config.js` | Tailwind configuration, including Aurify color tokens, type scale, UI tokens, and content paths. |
| `postcss.config.mjs` | PostCSS configuration used by Tailwind. |
| `jsconfig.json` | JavaScript path configuration, including import alias support. |
| `.eslintrc.json` | ESLint configuration. |
| `.gitignore` | Lists files and folders Git should ignore. |
| `.env` | Local environment values. Keep secrets out of committed changes. |
| `.env.local` | Local-only environment override file. |
| `.env.production` | Production environment override file. |

## Documentation

| Path | Description |
| --- | --- |
| `docs/AI_CONTEXT.md` | Handoff file for AI collaborators, including project context, phase notes, decisions, and future work areas. |
| `docs/DESIGN_SYSTEM.md` | Documents the current visual system: colors, typography, layout rules, and Aurify UI tokens. |
| `docs/PROJECT_STRUCTURE.md` | Documents the folder and file structure of the project. |

## Public Assets

| Path | Description |
| --- | --- |
| `public/` | Static files served directly by Next.js. |
| `public/images/` | Image assets used across the landing pages, auth screens, product sections, and feature sections. |
| `public/icons/` | SVG and image icon assets for navigation, dashboard actions, auth providers, media controls, and brand marks. |
| `public/next.svg` | Default Next.js logo asset. |
| `public/vercel.svg` | Default Vercel logo asset. |

## Source Folder

| Path | Description |
| --- | --- |
| `src/` | Main application source folder. |
| `src/app/` | Next.js App Router routes, layouts, global styles, API routes, and route-specific components. |
| `src/components/` | Shared and page-level React components used outside route folders. |

## App Router Files

| Path | Description |
| --- | --- |
| `src/app/layout.js` | Root layout for the app. Wraps the app in the Redux store provider and applies global body styling. |
| `src/app/page.js` | Home route entry point. |
| `src/app/globals.css` | Global Tailwind styles, font imports, helper classes, dashboard styling, and markdown styling. |
| `src/app/config.js` | Exposes environment-based configuration values for Strapi and the root URL. |
| `src/app/icon.svg` | App icon asset used by Next.js metadata. |

## API Routes

| Path | Description |
| --- | --- |
| `src/app/api/route.js` | App-level API route. |
| `src/app/blog/api/route.js` | Blog-specific API route. |

## Auth Routes

| Path | Description |
| --- | --- |
| `src/app/auth/callback/page.js` | Route for handling auth callback navigation. |
| `src/app/auth/callback/GoogleCallback.js` | Google auth callback component logic. |

## Login And Signup Routes

| Path | Description |
| --- | --- |
| `src/app/login/page.js` | Login route entry point. |
| `src/app/login/_components/login.js` | Login form and screen component. |
| `src/app/signup/page.js` | Signup route entry point. |
| `src/app/signup/_components/creatAccount.js` | Account creation form component. |
| `src/app/signup/_components/button.js` | Signup-specific button component. |

## Blog Routes

| Path | Description |
| --- | --- |
| `src/app/blog/page.js` | Blog listing route. |
| `src/app/blog/[slug]/page.js` | Dynamic blog post route. |
| `src/app/blog/_components/cards.js` | Blog card/list item components. |
| `src/app/blog/_components/post.js` | Blog post display component. |
| `src/app/blog/_components/notfound.js` | Blog not-found state component. |

## Dashboard Routes

| Path | Description |
| --- | --- |
| `src/app/dashboard/layout.js` | Dashboard route layout. |
| `src/app/dashboard/page.js` | Dashboard route entry point. |
| `src/app/dashboard/_components/` | Dashboard UI components for navigation, summaries, uploads, studies, modals, loading states, and audio controls. |
| `src/app/dashboard/summary/page.js` | Summary listing route. |
| `src/app/dashboard/summary/[slug]/page.js` | Dynamic summary detail route. |
| `src/app/dashboard/questions/page.js` | Questions route entry point. |
| `src/app/dashboard/questions/[slug]/page.js` | Dynamic question or quiz detail route. |
| `src/app/dashboard/questions/_components/` | Quiz and practice question components, including results and interface views. |
| `src/app/dashboard/audiobooks/page.js` | Audiobooks route entry point. |
| `src/app/dashboard/audiobooks/_components/audios.js` | Audiobook/audio listing or playback component. |

## Studies Routes

| Path | Description |
| --- | --- |
| `src/app/studies/layout.js` | Studies route layout and metadata. |
| `src/app/studies/page.js` | Studies listing route with links back to dashboard and new study creation. |
| `src/app/studies/new/page.js` | New Study route entry point. |
| `src/app/studies/new/CreateStudyClient.jsx` | Client-side Study creation prompt and study plan preview flow. |
| `src/app/studies/[studyId]/page.js` | Dynamic Study workspace route. |
| `src/app/studies/[studyId]/StudyWorkspaceClient.jsx` | Study workspace tabs for overview, material, practice, exam mode, and analytics. |
| `src/app/studies/_components/` | Studies list cards, grid, and empty state components. |
| `src/data/mockStudies.js` | Mock Study data and helpers used by the current Studies flow. |

## App State And Hooks

| Path | Description |
| --- | --- |
| `src/app/lib/StoreProvider.js` | Provides the Redux store to the app. |
| `src/app/lib/store.js` | Configures the Redux store. |
| `src/app/lib/features/auth/authSlice.js` | Redux slice for auth-related state. |
| `src/app/lib/features/dashboard/dashboardSlice.js` | Redux slice for dashboard-related state. |
| `src/app/lib/features/nav/navSlice.js` | Redux slice for navigation-related state. |
| `src/app/hooks/useCustomHook.js` | Shared custom hook file. |

## Shared Components

| Path | Description |
| --- | --- |
| `src/components/footer/footer.jsx` | Footer component. |
| `src/components/form/form.jsx` | Shared form component. |
| `src/components/fonts/fontloader.jsx` | Font loader helper components. |
| `src/components/homepage/` | Homepage and landing page components, including cards and alternate landing page versions. |
| `src/components/navbar/nav.jsx` | Main navigation component. |
| `src/components/ui/ui.jsx` | Shared UI component file. |
| `src/components/waitlist/waitlist.jsx` | Waitlist component. |

## Generated And Installed Folders

| Path | Description |
| --- | --- |
| `.next/` | Generated Next.js build and development output. Do not edit manually. |
| `node_modules/` | Installed npm packages. Do not edit manually. |
| `.git/` | Git repository metadata. Do not edit manually. |

## Maintenance Notes

- Keep this file focused on structure and file responsibilities.
- Add new route folders when they are created.
- Add new documentation files to the Documentation section.
- Avoid documenting temporary build output beyond high-level generated folder notes.
