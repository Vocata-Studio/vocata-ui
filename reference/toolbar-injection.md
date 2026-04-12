# Toolbar Injection

## Two Approaches by Framework

### React / Next.js

The toolbar is a **React component** rendered inside `VocataPreview.tsx`. No external script injection needed — it's part of the React tree.

The preview wrapper:
- Uses `useState` to track the active variation (0-indexed)
- Renders only the active variation component
- Renders the toolbar as a sibling element
- Listens for keyboard events via `useEffect`

See the React toolbar component template in SKILL.md Phase 3.2.

### Astro / Static HTML

The toolbar is injected as an **inline `<script>` tag** in the preview page. Read `assets/toolbar.js` from the skill directory and inline its contents.

The preview wrapper:
- Renders ALL 4 variations server-side inside `<div data-vocata-variation="N">` containers
- Only variation 1 is visible (others have `style="display:none"`)
- The toolbar script toggles visibility client-side

## Toolbar Behavior

- **Buttons 1-4**: Switch active variation
- **Keyboard 1-4**: Same as clicking buttons (disabled when focus is in input/textarea)
- **Active state**: White border + background highlight on the active button
- **Position**: Fixed to bottom of viewport, full width
- **Z-index**: `2147483647` (max 32-bit int) to sit above everything
- **Body padding**: Adds `56px` bottom padding to body so content isn't obscured

## Style Isolation

The toolbar uses:
- Inline styles only (no class names that could collide)
- A unique `id="vocata-toolbar"` for the container
- `-apple-system` font stack (doesn't import fonts)
- Dark semi-transparent background that works on any page color

## No Shadow DOM

We intentionally avoid Shadow DOM for simplicity and maximum browser compatibility. Inline styles provide sufficient isolation for a temporary toolbar.
