# Framework Detection

## Detection Order

Check these in order, stop at the first match:

### Next.js

1. File exists: `next.config.js`, `next.config.ts`, or `next.config.mjs`
2. `package.json` has `next` in dependencies or devDependencies

**App Router vs Pages Router:**
- `app/layout.tsx` or `src/app/layout.tsx` exists → App Router
- `pages/_app.tsx` or `src/pages/_app.tsx` exists → Pages Router
- Both exist → App Router (Next.js default in v13+)

**File extension:**
- Check existing components for `.tsx` vs `.jsx` — match the project convention
- Default to `.tsx`

### Astro

1. File exists: `astro.config.mjs`, `astro.config.ts`
2. `package.json` has `astro` in dependencies

**Component type:**
- Check if project uses React islands: look for `@astrojs/react` in config or dependencies
- If React islands: variations can be `.tsx` with `client:load`
- If pure Astro: variations are `.astro` files

### Fallback

- Plain HTML/CSS/JS if no framework detected
- Variations are `.html` snippets

## Styling Detection

| Priority | Check | Result |
|----------|-------|--------|
| 1 | `tailwind.config.*` exists | Tailwind CSS |
| 2 | `@tailwind` directive in any CSS file | Tailwind CSS |
| 3 | `*.module.css` files imported in components | CSS Modules |
| 4 | `styled-components` or `@emotion/styled` in package.json | CSS-in-JS |
| 5 | Global CSS files only | Vanilla CSS |

**Mixed styling:** Some projects use Tailwind + CSS Modules. If both are detected, check the components nearest to the insertion point and match their approach.

## Design Token Extraction

### Tailwind

Read `tailwind.config.*` for:
- `theme.extend.colors` — custom color palette
- `theme.extend.fontFamily` — custom fonts
- `theme.extend.spacing` — custom spacing scale
- `theme.extend.borderRadius` — custom radii

### CSS Custom Properties

Grep for `--` in global CSS files to find custom properties:
- `--color-*`, `--font-*`, `--spacing-*`

### Font Imports

Check `<head>`, layout files, or CSS `@import` / `@font-face` for loaded fonts.

## Output

Store results in `.vocata/context.json` — see SKILL.md Phase 1.5 for schema.
