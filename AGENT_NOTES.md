# Agent Notes

Lessons and feedback for the AI agent working on this repo.
These are loaded on every agent run.

## Angular conventions

This is an Angular project. Follow these rules strictly:
- File naming: kebab-case for all files (e.g. user-profile.component.ts, auth.service.ts)
- Always generate files with correct Angular suffixes: .component.ts, .service.ts, .module.ts, .pipe.ts, .directive.ts, .guard.ts
- New components/services must be declared or provided in the correct NgModule or standalone imports array
- Never import a package not already in package.json — the reviewer must run `npm install` or `npm ci` before testing
- After adding any new component: reviewer must run `ng build` to verify compilation — Angular template errors only appear at build time
- Use Angular's dependency injection (constructor injection) — never instantiate services with `new`
- Reactive forms preferred over template-driven forms for complex forms
- Use async pipe in templates instead of subscribing in component lifecycle hooks where possible

## UI/UX conventions

### Button and icon sizing
- Always ensure buttons and icons are properly sized for their context to avoid UI bloating
- When placing buttons in card headers or compact spaces, use smaller sizes (e.g., padding: 4px 8px, font-size: 11px)
- Icons inside buttons should match button size — use explicit CSS to constrain icon dimensions (width, height, font-size)
- For expand/collapse icons in tables, keep them compact (10-12px) to maintain row density
- Standard sizing pattern for compact buttons:
  ```css
  .compact-btn {
    padding: 4px 8px;
    font-size: 11px;
    line-height: 1;
  }
  .compact-btn tui-icon {
    font-size: 11px;
    width: 11px;
    height: 11px;
  }
  ```
- For icon-only buttons in tables (e.g., expand/collapse), typical size: 18x18px container with 10-12px icon

## 2026-04-27 · by bemotiejus@gmail.com · CER-6: Implement Dealers management page with add/edit/delete functionality

## Taiga UI v5 (CRITICAL)
This project uses Taiga UI v5 — NOT v4. Breaking changes:
- All `*Module` imports removed. Use standalone components instead.
  ❌ TuiSelectModule → ✅ TuiSelect
  ❌ TuiInputModule → ✅ TuiInput  
  ❌ TuiButtonModule → ✅ TuiButton
  ❌ TuiTableModule → ✅ TuiTable
- Import path: `@taiga-ui/kit` for most UI components
- Never import anything ending in `Module` from @taiga-ui/*
