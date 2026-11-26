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

### DEC-009 — Layered application architecture
- Date: 2026-11-26
- Decision: Separate Astro content/pages, React presentation, simulation runtime, physics domain, and visualization into explicit layers.
- Rule: Physics domain code must not import UI, rendering, DOM, or browser APIs; rendering consumes simulation state and does not implement physics equations.
- Rationale: Preserve scientific testability and allow visualization technology to change independently.

### DEC-010 — Astro-first rendering with React islands
- Date: 2026-11-26
- Decision: Astro renders public content and page structure; React is reserved for interactive simulation experiences and controls.
- Rule: Do not turn the entire site into a React SPA or hydrate components without a user-facing need.
- Rationale: Keep educational content crawlable and minimize client JavaScript.

### DEC-011 — Explicit locale routes
- Date: 2026-11-26
- Decision: Use explicit Indonesian and English URL prefixes: `/id/` and `/en/`.
- Rule: Localized pages must be independently addressable and include appropriate canonical/hreflang relationships when translations exist.
- Rationale: Provide clear navigation, shareable URLs, and international SEO.

### DEC-012 — Simulation runtime owns live experiment state
- Date: 2026-11-26
- Decision: Simulation Runtime owns lifecycle and authoritative live state; React owns only transient interface state; Physics Domain remains pure.
- Rule: Do not add a global state library until real application complexity justifies it.
- Rationale: Avoid coupling numerical simulation to component lifecycle and prevent premature dependencies.

### DEC-013 — 2D-first visualization
- Date: 2026-11-26
- Decision: Prefer Canvas 2D and SVG; add Three.js only when a documented educational objective materially benefits from 3D.
- Rationale: Avoid unnecessary rendering complexity and prioritize learning clarity.

## Change history

### 2026-11-26
- Initial engineering decisions recorded.
- Recorded application layer boundaries, Astro/React rendering strategy, localization routes, simulation state ownership, and 2D-first visualization.
