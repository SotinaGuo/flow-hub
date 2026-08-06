# Frontend Project Rules

## Product Scope

This project implements a reusable application workflow MVP with three mocked request types:

- Leave
- Reimbursement
- Overtime

The MVP includes creating an application, previewing and editing it, viewing the application list and details, handling workflow status, and displaying application statistics.

## Required Technology

- TypeScript
- SvelteKit
- Tailwind CSS
- Vitest
- Apache ECharts for charts

React, Vue, and Angular must not be used. Small additional libraries are allowed only when they solve a concrete problem and do not duplicate existing capabilities.

## Engineering Rules

- Inspect the repository and existing patterns before making changes.
- Keep changes focused on the requested behavior and preserve unrelated user changes.
- Prefer clear, small modules over premature abstractions.
- Keep business logic, data access, and view logic separate.
- Use explicit TypeScript types and avoid `any` unless unavoidable and documented.
- Handle loading, empty, error, success, and disabled states where relevant.
- Use semantic HTML, keyboard-accessible interactions, visible focus states, and responsive layouts.
- Keep UI spacing, typography, colors, and interaction states consistent.
- Do not introduce arbitrary mock data inside components; keep it in the mock data layer.
- Apache ECharts instances must handle resize and disposal correctly.
- Add Vitest coverage for business logic and key Svelte component behavior.
- Run the relevant tests, type checks, lint checks, and production build before claiming completion.

## Delivery Rules

- State assumptions when requirements are ambiguous.
- Do not claim a command passed unless it was actually run.
- Report modified files, verification results, and remaining risks at the end of each task.
