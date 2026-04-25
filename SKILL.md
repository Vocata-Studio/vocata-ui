---
name: vocata-ui
description: Generate 2, 3, or 4 visually distinct UI component variations for in-browser preview and selection. Use when the user asks to create a component "with vocata ui", "show me variations", "try different layouts", or wants to compare UI options before committing to one.
---

# Vocata UI

Generate multiple visually distinct UI component variations, preview them in the browser with a switching toolbar, and write the chosen variation as clean production code.

## Orchestration Flow

```
Analysis -> Generation -> Preview Setup -> User Selection -> Cleanup
```

When the user invokes this skill, follow these phases in order. Do NOT skip phases.

---

## Phase 1: Analysis

Before generating anything, understand the project.

### 1.1 Detect Framework

Check in this order:

| Check | Framework |
|-------|-----------|
| `next.config.js` / `next.config.ts` / `next.config.mjs` exists | Next.js |
| `astro.config.mjs` / `astro.config.ts` exists | Astro |
| `package.json` has `next` dependency | Next.js |
| `package.json` has `astro` dependency | Astro |
| `app/` directory with `layout.tsx` | Next.js App Router |
| `pages/` directory with `_app.tsx` | Next.js Pages Router |
| `src/pages/` with `.astro` files | Astro |
| None of above | Plain HTML/CSS/JS |

### 1.2 Detect Styling

| Check | Styling |
|-------|---------|
| `tailwind.config.*` exists OR `@tailwind` in CSS files | Tailwind CSS |
| `*.module.css` files in use | CSS Modules |
| `styled-components` or `@emotion` in package.json | CSS-in-JS |
| Global `.css` files only | Vanilla CSS |

### 1.3 Read Existing Design DNA

Read these to understand the site's visual language:

1. **Tailwind config** (if exists) — extract custom colors, fonts, spacing, border-radius
2. **Global CSS / theme file** — extract CSS custom properties, font imports, base styles
3. **2-3 existing components** near the target location — understand naming conventions, prop patterns, export style, composition patterns
4. **The target page** where the component will be inserted — understand the layout, what comes before and after the insertion point

### 1.4 Identify Target

From the user's request, determine:

- **Target page file**: The file to modify (e.g., `src/app/page.tsx`, `src/pages/index.astro`)
- **Insertion point**: Where in the page the component goes (e.g., "after the Hero component", "below the fold")
- **Component name**: What to call it (e.g., `Testimonials`, `PricingTable`)
- **Variation count**: Extract from the user's message. Accept 2, 3, or 4. Default to 4 if not specified.

If the insertion point is ambiguous, ask the user to clarify before proceeding.

### 1.5 Store Context

Create `.vocata/context.json`:

```json
{
  "framework": "nextjs | astro | html",
  "frameworkVariant": "app-router | pages-router | null",
  "styling": "tailwind | css-modules | css-in-js | vanilla",
  "targetFile": "src/app/page.tsx",
  "insertionPoint": "after Hero component",
  "componentName": "Testimonials",
  "fileExtension": ".tsx | .astro | .html",
  "variationCount": 4,
  "designTokens": {
    "colors": [],
    "fonts": [],
    "spacing": "default | custom",
    "borderRadius": "default | custom"
  }
}
```

Add `.vocata` to `.gitignore` if not already present.

---

## Phase 2: Generation

Generate the number of variations the user requested — 2, 3, or 4. Read `variationCount` from `.vocata/context.json` to get N. Read `reference/variation-strategies.md` from the skill directory for the variation taxonomy.

### 2.1 Plan Variations

Before writing any code, plan N variations (where N is `variationCount` from `.vocata/context.json`) that maximize visual contrast:

- Each variation MUST use a **different layout strategy** (e.g., grid, stack, carousel, asymmetric)
- Each variation MUST use a **different compositional approach** (e.g., card-based, editorial, minimal, interactive)
- ALL variations must use the project's detected styling approach
- ALL variations must respect the existing design language (colors, fonts, spacing)
- ALL variations must look polished and production-ready — no placeholder aesthetics

Write a brief plan to `.vocata/plan.md` listing what makes each variation distinct.

### 2.2 Generate Shared Data (if needed)

If the component needs data (testimonials, pricing plans, team members, etc.):

1. Create `.vocata/variations/types.ts` with the TypeScript interface
2. Create `.vocata/variations/mock-data.ts` with realistic mock data
3. All N variations import from these shared files

### 2.3 Generate Variations

Write each variation as a self-contained component, creating one file per variation up to N (the `variationCount` from `.vocata/context.json`):

- `.vocata/variations/variation-1.tsx` (or `.astro`)
- `.vocata/variations/variation-2.tsx`
- ... through `.vocata/variations/variation-N.tsx`

Do NOT create variation files beyond N.

Each variation file:
- Is a complete, working component
- Imports shared types/data if applicable
- Uses the project's styling approach
- Has no references to "vocata", "variation", or "preview" in the component code itself — the component should read like production code
- Exports a single default component

If CSS Modules are used, create corresponding `.module.css` files alongside each variation.

### 2.4 Self-Check

Before proceeding, verify:
- [ ] No two variations share the same layout strategy
- [ ] Each variation looks distinct at a glance
- [ ] All variations use the correct styling approach
- [ ] All variations would be acceptable as production code

---

## Phase 3: Preview Setup

### 3.1 Back Up Target File

```
cp <targetFile> .vocata/backup/<filename>.bak
```

Record the backup path in `.vocata/context.json`.

### 3.2 Create Preview Wrapper

Create `.vocata/VocataPreview.tsx` (or `.astro`) that:

#### For Next.js (React):

Generate this component using N = `variationCount` from `.vocata/context.json` (2, 3, or 4). Replace every occurrence of N below with the actual count, and generate exactly N imports and N array entries.

```tsx
"use client";
import { useState, useEffect } from "react";
import Variation1 from "./variations/variation-1";
import Variation2 from "./variations/variation-2";
// ... continue through VariationN

const variations = [Variation1, Variation2, /* ..., VariationN */];

export default function VocataPreview() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= String(N)) {
        setActive(parseInt(e.key) - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const ActiveVariation = variations[active];

  return (
    <>
      <ActiveVariation />
      <VocataToolbar active={active} onSelect={setActive} count={N} />
    </>
  );
}

function VocataToolbar({ active, onSelect, count }: { active: number; onSelect: (n: number) => void; count: number }) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2147483647,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 20px",
      background: "rgba(10, 10, 10, 0.92)",
      backdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "13px",
      color: "rgba(255, 255, 255, 0.7)",
    }}>
      <span style={{ marginRight: "12px", fontWeight: 600, color: "rgba(255, 255, 255, 0.4)", letterSpacing: "0.05em", textTransform: "uppercase", fontSize: "11px" }}>
        Vocata UI
      </span>
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onSelect(n - 1)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            border: active === n - 1 ? "2px solid #fff" : "1px solid rgba(255, 255, 255, 0.15)",
            background: active === n - 1 ? "rgba(255, 255, 255, 0.15)" : "transparent",
            color: active === n - 1 ? "#fff" : "rgba(255, 255, 255, 0.5)",
            cursor: "pointer",
            fontWeight: active === n - 1 ? 700 : 400,
            fontSize: "14px",
            transition: "all 0.15s ease",
          }}
        >
          {n}
        </button>
      ))}
      <span style={{ marginLeft: "12px", color: "rgba(255, 255, 255, 0.3)", fontSize: "11px" }}>
        Press 1–{count} to switch
      </span>
    </div>
  );
}
```

#### For Astro:

Create a `.vocata/VocataPreview.astro` that renders all N variations inside `<div>` containers with `data-vocata-variation="N"` attributes, showing only variation 1 by default. Include the toolbar as an inline `<script>` tag. Read the toolbar script from the skill's `assets/toolbar.js` and inline it. The toolbar detects the number of variation elements automatically.

For Astro, since components render server-side, ALL N variations are rendered in the HTML but only one is visible. The client-side toolbar script toggles visibility:

```astro
---
// Import exactly N variations (N = variationCount from .vocata/context.json)
import Variation1 from "./variations/variation-1.astro";
import Variation2 from "./variations/variation-2.astro";
// ... through VariationN
---

<div id="vocata-preview">
  <div data-vocata-variation="1">
    <Variation1 />
  </div>
  <div data-vocata-variation="2" style="display:none">
    <Variation2 />
  </div>
  <!-- Continue through variation N, each with style="display:none" except variation 1 -->
</div>

<script>
  // Inline the toolbar.js content here
</script>
```

### 3.3 Modify Target Page

1. Add an import for `VocataPreview` from `.vocata/VocataPreview`
2. At the insertion point, add `<VocataPreview />`
3. Keep ALL other content intact — only add the preview component where the new component should go

### 3.4 Add Body Padding

For the toolbar not to obscure content, add temporary bottom padding. In React, the toolbar component handles this via a spacer div. In Astro, the toolbar script adds `padding-bottom: 56px` to `<body>`.

### 3.5 Inform the User

After setup is complete, tell the user (replace N with the actual variation count and adjust examples accordingly):

```
Variations ready! I've set up N different [component name] variations.

Open your dev server and navigate to [page URL]. Use the toolbar at the bottom
to switch between variations, or press 1–N on your keyboard.

When you've decided:
- "use variation 2" — I'll write it as clean code
- "iterate on 3" — I'll refine that variation
- "try N new ones" — I'll generate fresh variations
- "make 2 more bold" — I'll adjust a specific variation
```

---

## Phase 4: Selection

### User says "use variation N"

1. Read `.vocata/variations/variation-N.tsx`
2. Determine the target component path (e.g., `src/components/Testimonials.tsx`)
3. Write the variation as a clean component to the target path
4. If shared types/data exist, move them alongside the component or inline them
5. Proceed to Phase 5 (Cleanup)

### User says "iterate on variation N"

1. Read the current variation-N file
2. Apply the user's feedback (infer from their message or ask for specifics)
3. Rewrite ONLY `.vocata/variations/variation-N.tsx`
4. The dev server hot-reloads automatically
5. Tell the user: "Updated variation N. Check it out and let me know."
6. Wait for next instruction (stay in Phase 4)

### User says "try N new ones" / "start over"

1. Delete all files in `.vocata/variations/`
2. Re-run Phase 2 with instruction to produce completely different approaches
3. Tell the user to check the new variations
4. Stay in Phase 4

### User says "replace variation N with [description]"

1. Delete only `.vocata/variations/variation-N.tsx`
2. Generate a new variation-N incorporating the user's description
3. Tell the user to check again
4. Stay in Phase 4

---

## Phase 5: Cleanup

Read `reference/cleanup-protocol.md` from the skill directory for the full checklist.

Execute these steps in order:

1. **Restore target page** from `.vocata/backup/` — this removes the preview wrapper import
2. **Write the chosen component** to its final location (e.g., `src/components/Testimonials.tsx`)
3. **Write any shared data/types** alongside the component if they were used
4. **Update the target page** to import the final component at the insertion point
5. **Delete the entire `.vocata/` directory**
6. **Verify**: grep the project for any remaining `.vocata` references — there should be none
7. **Remove `.vocata` from `.gitignore`** if it was the only entry added

The final code should have ZERO traces of Vocata UI — no "variation", no "preview", no "vocata" references anywhere. It should read as if the component was written directly.

---

## Quality Standards

- Use the `frontend-design` skill patterns when generating variations — every variation must be visually polished
- Follow the project's existing code conventions (naming, exports, file structure)
- Components must be responsive by default
- Components must be accessible (proper heading hierarchy, alt text, ARIA labels where needed)
- If generating interactive components, ensure keyboard navigation works

## Component Complexity

For simple components (testimonials, hero, CTA):
- Each variation is a single file

For complex components (pricing table with toggle, tabbed content):
- Each variation can be a directory: `.vocata/variations/variation-N/index.tsx` with sub-components
- On cleanup, the entire directory is moved to the target location
