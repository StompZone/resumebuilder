# StompZone Resume Builder

A production-ready resume builder SPA for creating polished resumes with live preview, local autosave, and export-ready templates.

The app is built as a static React/Vite application and is designed to deploy cleanly to Cloudflare Pages.

## Features

- Edit personal information, work experience, education, skills, projects, certifications, awards, and section layout.
- Preview the resume live while editing.
- Choose from three resume templates: Classic, Modern, and Executive.
- Export to PDF, DOCX, app-native JSON, and JSON Resume-compatible JSON.
- Import app-native JSON or JSON Resume-compatible JSON.
- Use month/year date controls for work, education, and credentials.
- View an interactive career timeline with overlap and gap warnings.
- Autosave locally in the browser.
- Keep document export libraries lazy-loaded for a smaller initial bundle.

## Privacy

Resume data is stored only in the user's browser local storage. The app does not send resume content or personally identifiable information to the developer or third parties.

Because this is a static SPA, there is no backend service required for normal editing, previewing, import, export, or autosave behavior.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui-style primitives
- React Hook Form
- Zod
- Zustand
- React DayPicker/date-fns
- `@react-pdf/renderer`
- `docx`

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the local dev server:

```bash
pnpm dev
```

Build for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm preview
```

Run linting:

```bash
pnpm lint
```

## Deployment

Recommended deployment target: Cloudflare Pages with Git integration.

Cloudflare Pages settings:

- Framework preset: `React (Vite)` or `Vite`
- Build command: `pnpm build`
- Build output directory: `dist`
- Root directory: leave blank unless this app lives inside a monorepo subdirectory
- Environment variables: none required

Manual Wrangler deployment is also possible:

```bash
pnpm build
npx wrangler pages deploy dist --project-name stompzone-resume-builder
```

## Project Structure

```text
src/
  App.tsx               application shell
  components/ui/        reusable UI primitives
  domain/resume/        resume schemas, types, and sample data
  features/editor/      resume editor sections
  features/preview/     live preview and import/export controls
  features/timeline/    career timeline utilities and UI
  persistence/          Zustand store and local autosave
  renderers/docx/       DOCX export renderer
  renderers/json/       JSON Resume conversion helpers
  renderers/pdf/        PDF export renderer
  templates/            HTML resume preview templates
```

## Notes

- PDF and DOCX export modules are dynamically imported when the user starts an export.
- Generated files are downloaded directly in the browser.
- The app uses local browser storage under the `antigravity-resume-data` and `antigravity-resume-template` keys for backward compatibility with earlier builds.
