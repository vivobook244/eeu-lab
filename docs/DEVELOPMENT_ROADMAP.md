# EEU LAB — Development Roadmap

Version: 1.0
Last updated: 2026-11-26
Repository: https://github.com/vivobook244/eeu-lab
Working branch: `main`

## Development rules

1. Use exactly one working branch: `main`. Never create additional branches unless the project owner explicitly changes this rule.
2. Before every implementation session, inspect the repository state, current branch, latest commit, and existing changes.
3. Record every phase and subphase in `docs/DEVELOPMENT_PROGRESS.md`. Preserve history; append dated entries instead of silently overwriting previous records.
4. A task is not complete merely because code exists. Record implementation, validation, test results, known limitations, and related commit SHA.
5. Keep commits focused and descriptive. Do not commit unvalidated work as completed.
6. Do not introduce a backend, database, authentication, monorepo, or Docker unless a documented requirement justifies it.
7. Physics calculations must be independent of rendering and covered by automated tests.

## Technology baseline

- Astro
- React
- TypeScript (strict)
- Tailwind CSS
- Canvas and SVG for 2D visualization
- Three.js only where 3D materially improves learning
- Vitest for unit/integration tests
- Playwright for end-to-end tests
- Vercel for deployment

## Phase roadmap

### Phase 0 — Engineering Preparation
- 0.1 Inspect repository, default branch, and initial state
- 0.2 Define application architecture and technical boundaries
  - Document Astro-first rendering and React island boundaries
  - Define content, presentation, simulation runtime, physics domain, and visualization layers
  - Define locale route conventions and content architecture
  - Define simulation state ownership, timing, and rendering boundaries
  - Record architecture decisions in `docs/DECISIONS.md`
- 0.3 Define source and documentation structure
  - Define Astro pages, layouts, content, and locale directory placement
  - Separate Astro components from React interactive components
  - Define Physics Domain, Simulation Runtime, and Visualization source boundaries
  - Define public/imported asset placement and naming conventions
  - Define unit, integration, and end-to-end test locations
  - Define documentation locations and import conventions
  - Record the exact structure in `docs/architecture/PROJECT_STRUCTURE.md`
- 0.4 Define coding conventions and quality gates
  - Define strict TypeScript safety rules and module conventions
  - Define scientific computation, SI unit, numerical validation, and error-handling rules
  - Define Astro/React implementation responsibilities and accessibility expectations
  - Define formatting, lint, type-check, test, and production-build quality gates
  - Define dependency, documentation, and commit policies
  - Record the standards in `docs/architecture/CODING_STANDARDS.md`
- 0.5 Define testing and validation strategy
  - Define mathematical/model, runtime, measurement, UI, and end-to-end test layers
  - Define analytical reference cases and invalid/boundary input coverage for GLB/GLBB
  - Define numerical tolerance and deterministic simulation-clock test policies
  - Define measurement/graph consistency and visualization validation
  - Define scientific/educational review and release-blocker criteria
  - Define browser, responsive, accessibility, and reproducibility expectations
  - Map quality gates to change types and record the strategy in `docs/testing/TESTING_STRATEGY.md`
- 0.6 Record development workflow and decision log
  - Define the single-branch policy and mandatory preflight repository inspection
  - Define task scope, acceptance criteria, and implementation sequence
  - Define validation evidence and honest PASS/FAIL/NOT RUN reporting
  - Define focused commit conventions and final-diff review
  - Define append-only progress history fields and status transitions
  - Define defect, regression, blocker, and recovery handling
  - Define architecture/decision change and approval process
  - Define dependency/security review and completion handoff
  - Record the workflow in `docs/development/DEVELOPMENT_WORKFLOW.md`
  - Review consistency with coding standards, testing strategy, and existing decisions

Exit criteria: engineering decisions and workflow are documented; repository baseline is known; source, test, and documentation structures, coding standards, and quality gates are explicit and consistent with the architecture. Phase 0.6 additionally requires a repeatable preflight-to-handoff workflow, explicit validation evidence rules, defect/decision handling, and a reviewed committed workflow document.

### Phase 1 — Project Initialization
- 1.1 Initialize Astro
  - Pin a supported Node.js runtime and document the local runtime requirement
  - Initialize the Astro project with a reproducible direct framework version
  - Add the Astro configuration and strict TypeScript baseline
  - Add the initial Astro page and project setup documentation
  - Add the standard development, build, and preview scripts
  - Add ignore rules for dependencies, generated output, and local environment files
  - Install dependencies through the Vercel deployment environment and verify the production build
  - Generate and commit the npm lockfile so transitive dependency resolution is reproducible
  - A local development-server test is not mandatory; use the Vercel deployment for browser smoke checks
- 1.2 Integrate React
  - Add the official `@astrojs/react` integration with an exact compatible version
  - Add exact React, React DOM, and React TypeScript type dependencies
  - Configure Astro to register the React integration
  - Configure TypeScript for the automatic React JSX runtime
  - Add one small React island that proves client-side hydration and state updates
  - Render the island from an Astro page using an explicit hydration directive
  - Verify that the page renders server-side and the interactive control works in the Vercel deployment
- 1.3 Configure strict TypeScript
  - Pin a TypeScript version supported by the selected Astro diagnostics toolchain
  - Add `@astrojs/check` and a dedicated `astro check` package script
  - Explicitly enable strict mode and selected additional type-safety compiler options
  - Remove deprecated or unnecessary TypeScript compiler options
  - Ensure path aliases remain valid without relying on deprecated configuration
  - Run type and Astro diagnostics in the Vercel build pipeline; do not mark verified until deployment logs show a clean check
- 1.4 Integrate Tailwind CSS
  - Pin exact Tailwind CSS v4 and official Vite plugin versions
  - Register the official Tailwind Vite plugin without replacing the Astro React integration
  - Add the global stylesheet with Tailwind import and minimal project-wide base styles
  - Import global styles from the Astro page/layout entry point
  - Replace the temporary landing page's inline component styling with responsive Tailwind utilities
  - Style the React island with Tailwind utilities and retain accessible interaction states
  - Verify responsive rendering, generated styles, React hydration, and production build in Vercel
- 1.5 Configure ESLint and Prettier
  - Pin compatible exact versions of ESLint, its JavaScript/TypeScript/Astro integrations, and Prettier plugins
  - Add an ESLint flat configuration for JavaScript, TypeScript, TSX, and Astro components
  - Apply recommended JavaScript, TypeScript, and Astro rules without introducing typed-linting complexity prematurely
  - Add Prettier configuration for Astro files and Tailwind class sorting
  - Add lint, lint-fix, format, and format-check scripts
  - Make lint a required production-build quality gate
  - Verify dependency installation, lint, formatting, type diagnostics, and production build through Vercel
- 1.6 Configure Vitest
  - Pin a Vitest version compatible with the repository's Node and Vite toolchain
  - Add a dedicated Vitest configuration for deterministic Node-environment unit tests
  - Restrict initial test discovery to `tests/**/*.test.ts` and `tests/**/*.test.tsx`
  - Configure mock cleanup/restoration between tests
  - Add explicit one-shot and watch-mode test scripts
  - Run the one-shot test command as part of the production build quality gate
  - Allow an empty test suite only during the tooling bootstrap; remove that allowance when the first domain unit tests are introduced
  - Verify the runner initializes and the production build completes in Vercel
- 1.7 Configure Playwright
- 1.8 Configure package scripts and environment handling
- 1.9 Configure Vercel deployment

Exit criteria: development server and production build work; linting and tests execute; deployment configuration is verified. Phase 1.1 specifically requires the Astro scaffold and its configuration to be committed, dependencies installed in Vercel, a successful production build, and a committed lockfile. Local development-server testing is optional when Vercel Preview is the agreed validation environment. Phase 1.2 requires a working hydrated React island verified in the Vercel deployment. Phase 1.3 requires strict compiler settings, the Astro type-checking toolchain, and a clean `astro check` result evidenced by the Vercel deployment logs. Phase 1.4 requires the official Tailwind v4 Vite plugin, a working global stylesheet, Tailwind utilities rendered on both Astro and React content, responsive styling, and a successful Vercel deployment smoke test. Phase 1.5 requires ESLint flat config to cover the project's JavaScript, TypeScript, TSX, and Astro files; Prettier to format the source and sort Tailwind classes; working lint/format scripts; and clean Vercel lint, diagnostics, and production-build results. Phase 1.6 requires the pinned Vitest runner, a dedicated deterministic Node test configuration, one-shot/watch scripts, and a successful Vercel build that executes the runner. Empty-suite tolerance is temporary and must be removed when the first real domain unit tests are added.

### Phase 2 — Application Architecture
- 2.1 Establish application layouts
- 2.2 Establish route and page architecture
- 2.3 Establish reusable component boundaries
- 2.4 Establish content data model
- 2.5 Establish Indonesian/English localization structure
- 2.6 Establish SEO metadata strategy
- 2.7 Establish error and not-found handling
- 2.8 Establish client state strategy

Exit criteria: application structure supports content pages and interactive simulations without premature backend dependencies.

### Phase 3 — UI/UX Foundation
- 3.1 Define brand tokens, colors, and typography
- 3.2 Build responsive layout primitives
- 3.3 Build navigation and site shell
- 3.4 Build homepage
- 3.5 Build laboratory directory
- 3.6 Build topic detail page structure
- 3.7 Build reusable UI components
- 3.8 Validate mobile and desktop layouts

Exit criteria: core public-facing pages are navigable, responsive, and consistent.

### Phase 4 — Physics Domain Core
- 4.1 Define physical constants and SI units
- 4.2 Define typed quantities and parameter contracts
- 4.3 Implement mathematical utilities
- 4.4 Define solver interfaces and model boundaries
- 4.5 Define deterministic simulation time-step behavior
- 4.6 Define measurement data contracts
- 4.7 Define graph data contracts
- 4.8 Add unit tests for domain calculations

Exit criteria: physics calculations are deterministic, independently testable, and separated from UI/rendering.

### Phase 5 — Simulation Runtime and Rendering
- 5.1 Implement simulation lifecycle (start, pause, reset)
- 5.2 Implement fixed-step update loop where appropriate
- 5.3 Implement 2D coordinate and scale mapping
- 5.4 Implement Canvas/SVG rendering foundation
- 5.5 Implement object and vector rendering primitives
- 5.6 Synchronize runtime state with rendering
- 5.7 Handle resize, visibility, and cleanup
- 5.8 Validate runtime behavior and performance

Exit criteria: a test model can be simulated and rendered reliably without coupling solver logic to rendering.

### Phase 6 — Measurement and Graphing
- 6.1 Implement live measurement presentation
- 6.2 Implement chart integration and shared data contracts
- 6.3 Implement time-series data collection
- 6.4 Implement graph axes, units, and labels
- 6.5 Implement graph interaction and synchronization
- 6.6 Validate numerical consistency between solver, measurements, and graphs

Exit criteria: displayed values and graphs are derived from the same simulation state and use correct units.

### Phase 7 — First Simulation: Linear Motion
- 7.1 Specify GLB scientific model and assumptions
- 7.2 Implement and test GLB solver
- 7.3 Specify GLBB scientific model and assumptions
- 7.4 Implement and test GLBB solver
- 7.5 Build parameter controls
- 7.6 Integrate visualization and runtime
- 7.7 Integrate measurements and graphs
- 7.8 Add formulas and concept explanations
- 7.9 Add guided experiment challenges
- 7.10 Validate scientific behavior and user experience

Exit criteria: GLB/GLBB experiments are usable, numerically validated, responsive, and covered by automated tests.

### Phase 8 — Learning Content and Localization
- 8.1 Define reusable lesson content schema
- 8.2 Author Indonesian lesson content
- 8.3 Author English lesson content
- 8.4 Render formulas and symbols accessibly
- 8.5 Add trustworthy scientific references
- 8.6 Connect lessons, experiments, and navigation
- 8.7 Validate language parity and metadata

Exit criteria: first simulation has complete, reviewed learning content in both languages.

### Phase 9 — Quality Assurance
- 9.1 Review scientific correctness and model limitations
- 9.2 Run unit and integration tests
- 9.3 Run end-to-end tests
- 9.4 Test responsive behavior
- 9.5 Test browser compatibility
- 9.6 Review accessibility
- 9.7 Review performance and Core Web Vitals
- 9.8 Review SEO and crawlability
- 9.9 Resolve release-blocking defects

Exit criteria: release criteria pass and known limitations are documented.

### Phase 10 — Production Deployment
- 10.1 Prepare production configuration
- 10.2 Configure Vercel project and environment
- 10.3 Configure domain when available
- 10.4 Add privacy and legal pages
- 10.5 Add privacy-conscious analytics/event measurement
- 10.6 Deploy and run production smoke tests
- 10.7 Document release and rollback procedure

Exit criteria: public deployment is verified and production checks pass.

### Phase 11 — Expansion and Optimization
- 11.1 Use the validated pattern for Newton's Laws
- 11.2 Expand remaining Mechanics topics
- 11.3 Evaluate and prioritize other physics laboratories
- 11.4 Improve content based on user behavior and learning feedback
- 11.5 Consider monetization only after product quality, traffic, and policy readiness

Exit criteria: each expansion is justified by user value and follows the established scientific and engineering quality gates.

## Delivery and completion policy

Each subphase must have:
- A clear objective and bounded scope
- Files/modules affected
- Acceptance criteria
- Validation and test evidence
- Known limitations or blockers
- A dated progress entry
- The commit SHA that contains the work

Status definitions:
- NOT STARTED
- IN PROGRESS
- BLOCKED
- IMPLEMENTED
- VERIFIED

Use VERIFIED only when the acceptance criteria and relevant tests have passed. A phase is complete only when all required subphases meet their exit criteria.
