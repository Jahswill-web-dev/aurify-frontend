# Aurify Design System

This file tracks the website's visual language: colors, fonts, typography, spacing, and reusable style rules. Keep it aligned with `tailwind.config.js` and `src/app/globals.css` as the interface evolves.

## Brand Feel

Aurify should feel clear, helpful, study-focused, and modern. The current visual direction uses warm orange accents, soft cream backgrounds, restrained gray text, and rounded functional panels.

## Color Scheme

### Primary Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `primary` / `primary-100` | `#F7931A` | Main brand orange, primary actions, active states, highlighted headings |
| `primary-25` | `#FFB74D` | Lighter orange accents and hover-friendly highlights |
| `primary-50` | `#FBB040` | Secondary orange accent |
| `primary-200` | `#C97516` | Dark orange for stronger contrast or pressed states |

### Accent Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `secondary` / `accent-100` | `#FEF2CF` | Soft cream panels, subtle brand backgrounds |
| `accent-25` | `#FFF6DB` | Very light warm background |
| `accent-50` | `#FFEB9B` | Warm highlight surfaces |
| `accent-200` | `#E2D89F` | Muted warm border or supporting accent |

### Neutral Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `off-white` | `#FCFCFC` | Main page background |
| `off-white-50` | `#F5F5F5` | Secondary surface |
| `off-white-100` | `#F8F8F8` | Dashboard and content surface |
| `grey-25` | `#D3D3D3` | Borders and dividers |
| `grey-50` / `p-text` | `#817474` | Muted paragraph text |
| `grey-100` | `#808080` | Neutral UI text |
| `grey-200` | `#333333` | Dark text and high emphasis content |
| `p-text-darker` | `#5D4D4D` | Main readable body text |

## Typography

Fonts are currently imported in `src/app/globals.css` from Google Fonts.

| Font | Current Usage |
| --- | --- |
| Poppins | General brand/UI display helper classes |
| Inter | Body text and markdown paragraphs |
| Roboto | Markdown headings |

### Font Helper Classes

| Class | Font | Weight | Style |
| --- | --- | --- | --- |
| `poppins-font` | Poppins | 400 | normal |
| `poppins-font-italics` | Poppins | 400 | italic |
| `poppins-font-bold` | Poppins | 700 | normal |
| `inter-font` | Inter | 400 | normal |
| `inter-font-italics` | Inter | 400 | italic |
| `inter-font-bold` | Inter | 700 | normal |

## Type Scale

The custom Tailwind font sizes are defined in `tailwind.config.js`.

| Token | Size |
| --- | --- |
| `xl-head` | `40px` |
| `l-head` | `35px` |
| `l-sub-head` | `28px` |
| `l-description` | `20px` |
| `xx-head` | `30px` |
| `x-head` | `24px` |
| `x-sub-head` | `20px` |
| `x-description` | `12px` |
| `h1` | `38px` |
| `h2` | `30px` |
| `h3` | `24px` |
| `h4` | `20px` |
| `h5` | `16px` |
| `h6` | `12px` |

## Layout Rules

- Use `.container` for main constrained page content: `max-width: 1200px`, centered, with horizontal padding.
- The root body uses `bg-off-white`, `max-width: 1557px`, and centered layout.
- Dashboard main panels use `.dashboard-main` for the shared light surface, border, rounded corners, padding, and vertical scroll behavior.

## Interaction Styles

- Use `.zoom-in` for simple hover scale interactions where a clickable item needs subtle emphasis.
- Primary interactive elements should use the orange brand range, with `primary` as the default action color.
- Keep dashboard UI practical and scannable: restrained panels, clear labels, and consistent spacing.

## Markdown Content Styling

Generated or rendered markdown content uses the `.markdown` class:

- Paragraphs use Inter, large readable text, and `p-text-darker`.
- Headings use Roboto and the primary orange color.
- Lists, links, blockquotes, code, images, and strong text have custom global styling in `src/app/globals.css`.

## Maintenance Notes

- Update this file whenever colors, fonts, type sizes, or core visual conventions change.
- Prefer adding reusable tokens to `tailwind.config.js` before scattering one-off values through components.
- Keep naming consistent with existing Tailwind tokens unless there is a strong reason to rename the system.

## Aurify UI Tokens

The following tokens were added to support Aurify's learning interface screens. They extend the existing system without replacing it.

### Border Radius

| Token | Value | Usage |
| --- | --- | --- |
| `rounded-xs` | `4px` | Small badges, tight labels |
| `rounded-sm` | `8px` | Buttons, input fields, chips |
| `rounded-md` | `12px` | Cards, confirmation panels |
| `rounded-lg` | `16px` | Workspace panels, modals |
| `rounded-xl` | `24px` | Full sidebar, floating cards |
| `rounded-2xl` | `32px` | Large hero input box |

### Shadows

| Token | Usage |
| --- | --- |
| `shadow-card` | Topic suggestion chips, note section cards |
| `shadow-panel` | Confirmation card, setup card, sidebar |
| `shadow-modal` | Level switcher dropdown, clarification overlay |
| `shadow-input-focus` | Orange glow on the main learn input when focused |
| `shadow-btn-primary` | Orange CTA buttons in active/hover state |

### Semantic Colors

| Token | Hex | Usage |
| --- | --- | --- |
| `success` | `#22C55E` | Correct answer feedback in practice and exam |
| `success-light` | `#DCFCE7` | Correct answer background highlight |
| `error` | `#EF4444` | Incorrect answer feedback |
| `error-light` | `#FEE2E2` | Incorrect answer background highlight |

### Transitions

- Use `duration-175` for micro-interactions like button hover and chip selection
- Use `duration-250` for panel reveals like the confirmation card appearing
- Use `duration-350` for larger transitions like tab switching and sidebar open/close
- Use `ease-smooth` as the default easing across all transitions
- Use `ease-bounce-in` only for playful confirmations like a correct answer ping
