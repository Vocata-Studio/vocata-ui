# Vocata UI

A Claude Code skill that generates visually distinct UI component variations, previews them in the browser with a switching toolbar, and writes the chosen variation as clean production code.

## Install

One-liner:

```bash
curl -fsSL https://raw.githubusercontent.com/vocata/vocata-ui/main/install.sh | bash
```

Or manually:

```bash
git clone https://github.com/Vocata-Studio/vocata-ui.git ~/.claude/skills/vocata-ui
```

Start a new Claude Code session after installing.

## Usage

In any Claude Code conversation:

```
Create a testimonial section under the hero, use vocata ui
```

```
Build a pricing table with monthly/annual toggle, use vocata ui
```

```
Add a team section to the about page, use vocata ui
```

## How it works

1. **Analyzes your project** — detects framework (Next.js, Astro), styling (Tailwind, CSS Modules), and reads your existing design language
2. **Generates multiple variations** — each with a different layout strategy and visual approach, stored in `.vocata/variations/`
3. **Sets up preview** — modifies the target page temporarily with a toolbar to switch between variations (keyboard shortcuts 1-4)
4. **You pick** — tell Claude Code which variation to keep, iterate on, or regenerate
5. **Cleans up** — writes the chosen variation as a normal component, removes all `.vocata/` artifacts

## Supported frameworks

- **Next.js** (App Router and Pages Router)
- **Astro** (including React islands)
- Fallback for plain HTML/CSS/JS

## Supported styling

- Tailwind CSS
- CSS Modules
- CSS-in-JS (styled-components, Emotion)
- Vanilla CSS

## Commands during preview

| Say this | What happens |
|----------|-------------|
| `use variation 2` | Writes variation 2 as clean production code |
| `iterate on 3` | Refines variation 3 based on your feedback |
| `try 4 new ones` | Generates 4 completely new variations |
| `replace 3 with something bolder` | Regenerates just variation 3 |

## Project structure

```
vocata-ui/
├── SKILL.md                    # Skill definition and orchestration
├── assets/
│   └── toolbar.js              # Preview toolbar (Astro/static)
└── reference/
    ├── variation-strategies.md  # How variations are differentiated
    ├── framework-detection.md   # Framework and styling detection
    ├── toolbar-injection.md     # Toolbar architecture
    └── cleanup-protocol.md     # Cleanup checklist
```

## Runtime artifacts

During preview, a `.vocata/` directory is created in your project:

```
.vocata/
├── context.json               # Project analysis results
├── plan.md                    # What makes each variation distinct
├── backup/                    # Backup of modified files
├── variations/                # The 4 component variations
│   ├── variation-1.tsx
│   ├── variation-2.tsx
│   ├── variation-3.tsx
│   └── variation-4.tsx
└── VocataPreview.tsx          # Preview wrapper with toolbar
```

This directory is automatically deleted when you select a variation. It's added to `.gitignore` during preview.
