# Cleanup Protocol

Execute these steps in exact order after the user selects a variation.

## Steps

### 1. Restore Target Page

```
cp .vocata/backup/<filename>.bak <original-target-path>
```

This removes the VocataPreview import and returns the page to its pre-modification state.

### 2. Write Chosen Component

Copy the selected variation to its final location:

- Determine the appropriate path (e.g., `src/components/Testimonials.tsx`)
- Follow project conventions for component location
- Rename the file to match the component name (not "variation-2")

If the variation is a directory (complex component), move the entire directory.

### 3. Write Shared Data (if applicable)

If `.vocata/variations/types.ts` or `.vocata/variations/mock-data.ts` exist:

- Move types file alongside the component (e.g., `src/components/testimonials/types.ts`)
- Move mock data alongside OR inline it into the component
- Update import paths in the component to reflect new locations

### 4. Update Target Page

Modify the target page to:

1. Import the new component from its final location
2. Render it at the insertion point
3. Pass any necessary props

The page should read as if the component was always there.

### 5. Delete `.vocata/`

```
rm -rf .vocata/
```

### 6. Verify No Stray References

Grep the project for any remaining references:

```
grep -r ".vocata" --include="*.tsx" --include="*.ts" --include="*.astro" --include="*.jsx" --include="*.js" --include="*.html"
grep -r "vocata-variation" --include="*.tsx" --include="*.ts" --include="*.astro"
grep -r "VocataPreview" --include="*.tsx" --include="*.ts" --include="*.astro"
grep -r "vocata-toolbar" --include="*.tsx" --include="*.ts" --include="*.astro" --include="*.js"
```

All should return zero results.

### 7. Clean Up .gitignore

If `.vocata` was added to `.gitignore` during setup:

- Remove the `.vocata` line
- If it was the only line added, revert the file entirely

## Recovery

If the process is interrupted at any point:

- `.vocata/backup/` contains the original target page — restore it manually
- `.vocata/variations/` contains all generated variations — they can be copied manually
- Delete `.vocata/` to clean up

## Final State Checklist

- [ ] Target page imports the final component (not VocataPreview)
- [ ] Component file exists at its final location with a proper name
- [ ] No files or directories named `.vocata` exist
- [ ] No imports reference `.vocata/` paths
- [ ] No `data-vocata-*` attributes in any file
- [ ] No `vocata-toolbar` references anywhere
- [ ] `.gitignore` is clean
