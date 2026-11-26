# EEU LAB — Engineering Decisions

This document records durable project decisions. Add dated entries for changes; do not silently rewrite historical decisions.

## Active decisions

### DEC-001 — Single working branch
- Date: 2026-11-26
- Decision: Use only the `main` branch for all development.
- Rule: Do not create feature, development, staging, or temporary branches unless the project owner explicitly authorizes a policy change.
- Rationale: Keep the workflow simple and the project history centralized.

### DEC-002 — Phase history is mandatory
- Date: 2026-11-26
- Decision: Every phase and subphase must be traceable in `docs/DEVELOPMENT_PROGRESS.md`.
- Required record: date, phase/subphase ID, objective, work performed, files affected, validation/test results, blockers/limitations, status, and commit SHA.
- Rule: Preserve dated history entries. Update the current snapshot/status without deleting previous history.

### DEC-003 — TypeScript-first application
- Date: 2026-11-26
- Decision: Use TypeScript with strict compiler settings for application and physics-domain code.
- Rationale: Strong contracts for physical quantities, parameters, measurements, and simulation state.

### DEC-004 — Astro with React
- Date: 2026-11-26
- Decision: Use Astro as the website framework and React for interactive application components.
- Rationale: Content-oriented public pages with interactive simulations where needed.

### DEC-005 — No premature backend
- Date: 2026-11-26
- Decision: Do not introduce a backend, database, authentication, or user accounts in the initial development scope.
- Rationale: The first product experience is public-first and can be delivered as a static/content-driven application with client-side simulations.

### DEC-006 — Physics domain separated from presentation
- Date: 2026-11-26
- Decision: Physics calculations and simulation models must not depend on React, Canvas, SVG, or Three.js.
- Rationale: Scientific models must be independently testable and reusable across renderers.

### DEC-007 — Scientific validation is a release requirement
- Date: 2026-11-26
- Decision: Every simulation must document its equations, units, assumptions, and model limitations, and must have automated tests for its calculation logic.
- Rationale: Scientific correctness is more important than visual effects.

### DEC-008 — No monorepo or Docker
- Date: 2026-11-26
- Decision: Keep one application repository and a simple local development workflow; do not introduce a monorepo or Docker without a demonstrated need.
- Rationale: Reduce operational overhead for a small development effort.

## Change history

### 2026-11-26
- Initial engineering decisions recorded.
