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
