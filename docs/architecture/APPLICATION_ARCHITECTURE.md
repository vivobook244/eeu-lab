# EEU LAB — Application Architecture

Version: 1.0  
Date: 2026-11-26  
Status: Proposed engineering baseline  
Repository: `vivobook244/eeu-lab`  
Working branch: `main`

## 1. Architecture goals

The application must:

- Deliver fast, crawlable educational pages for Indonesian and English audiences.
- Render most content on the server/build side through Astro.
- Hydrate only interactive experiences that need browser interaction.
- Keep scientific calculations deterministic and independent of the UI.
- Reuse simulation infrastructure without creating a generic game engine.
- Remain deployable as a static/content-focused application without a backend.
- Allow 2D Canvas/SVG first; use 3D only when it provides a clear learning benefit.

## 2. High-level architecture

The system is divided into five layers:

1. **Web and Content Layer** — Astro pages, layouts, routing, SEO metadata, and lesson content.
2. **Presentation Layer** — reusable UI and React simulation islands.
3. **Simulation Runtime Layer** — lifecycle, clock, stepping, measurement sampling, and coordination.
4. **Physics Domain Layer** — pure mathematical models, constants, quantities, and solvers.
5. **Visualization Layer** — Canvas/SVG drawing and chart presentation.

Dependency direction:

```text
Astro Pages / Layouts
        |
        +---- Static lesson content and metadata
        |
        +---- React interactive island
                    |
             Simulation UI
                    |
             Simulation Runtime
               /          \
      Physics Domain    Visualization
       (pure TS)         (Canvas/SVG)
```

Rules:

- Physics Domain must not import Astro, React, DOM, Canvas, SVG, chart libraries, or browser APIs.
- Simulation Runtime may call Physics Domain and publish serializable snapshots for the UI.
- Visualization reads simulation snapshots; it must not calculate the scientific model.
- React components own user interaction and presentation state, not the underlying physics equations.
- Astro owns public routes, static content rendering, document metadata, and page composition.

## 3. Technology responsibilities

| Technology   | Responsibility                                        | Boundary                                 |
| ------------ | ----------------------------------------------------- | ---------------------------------------- |
| Astro        | Public pages, layouts, routes, content rendering, SEO | Default page renderer                    |
| React        | Interactive controls and simulation islands           | Hydrate only interactive areas           |
| TypeScript   | Contracts across all application layers               | Strict mode                              |
| Tailwind CSS | Design tokens and responsive styling                  | No physics logic                         |
| Canvas 2D    | High-frequency 2D scene rendering when appropriate    | Draws supplied state                     |
| SVG          | Diagrams, vectors, axes, and accessible graphics      | Draws supplied state                     |
| Three.js     | Optional advanced 3D scenes                           | Only after a documented educational need |
| Vitest       | Pure model, runtime, and component-level tests        | Run in CI when configured                |
| Playwright   | Critical user journeys in a real browser              | End-to-end validation                    |
| Vercel       | Hosting and deployment                                | No server functions required initially   |

No charting library is selected yet. Phase 6 should evaluate whether native SVG or a small chart library best meets graph interaction, accessibility, and bundle-size requirements.

## 4. Rendering and hydration strategy

- Astro renders the page shell, headings, explanatory text, formulas, metadata, and lesson content.
- React is used for controls and simulation experiences that require client-side interaction.
- Use the least aggressive hydration strategy that preserves the experience. A visible, primary experiment may use eager hydration; secondary or below-the-fold interactive content may hydrate when visible.
- Do not convert the whole website into a React single-page application.
- Keep content readable and useful if JavaScript fails; the experiment itself may require JavaScript.
- Avoid putting large simulation bundles on pages that do not contain a simulation.

## 5. Routing and localization

Public URL convention:

- Indonesian: `/id/physics/mechanics/...`
- English: `/en/physics/mechanics/...`

Initial route groups:

- `/[locale]/` — localized homepage
- `/[locale]/labs/` — laboratory directory
- `/[locale]/labs/[labSlug]/` — laboratory overview
- `/[locale]/physics/[domain]/[topicSlug]/` — topic and experiment page
- `/[locale]/articles/[articleSlug]/` — supporting article

Rules:

- Locale is explicit in the URL; do not rely only on browser language or cookies.
- Indonesian and English pages are separately addressable and indexable.
- Each localized page should provide canonical and reciprocal hreflang metadata when a translation exists.
- Do not publish an empty or machine-translated placeholder as a complete localized page.
- Route implementation details must be validated against the Astro version selected in Phase 1.

## 6. Content architecture

Use Astro content collections or the current supported Astro content API for authored lessons and articles. Define schemas with TypeScript/Zod validation supported by the selected Astro version.

Content should be separated from React UI and physics solver code.

A topic entry should be able to describe:

- Stable topic identifier and slug
- Locale
- Title, summary, and learning objectives
- Concept explanation and section ordering
- Equations, symbols, variable descriptions, and SI units
- Model assumptions and limitations
- Experiment configuration and parameter bounds
- Related topics and references
- Translation relationship

Keep authored scientific explanations in content files. Keep executable solver implementations in typed TypeScript modules; never execute arbitrary code from content.

## 7. Physics Domain Layer

Suggested responsibilities:

- Physical constants with source/precision notes where appropriate
- Explicit units and unit conversion utilities
- Mathematical helpers
- Typed model parameters and state
- Pure solver functions
- Validation of parameter ranges
- Model assumptions and documented limitations

Solver contract direction:

```ts
type Solver<ModelState, Parameters> = {
  createInitialState(parameters: Parameters): ModelState;
  step(state: ModelState, parameters: Parameters, deltaTimeSeconds: number): ModelState;
};
```

This is an architectural example, not a committed public API. Concrete contracts should be designed alongside the first physics model and tested for its actual needs.

Rules:

- Use SI units internally unless a model has a documented reason not to.
- Encode units in names or domain types; do not pass ambiguous values such as an unlabelled `speed` between layers.
- Validate finite values and allowed parameter ranges at model boundaries.
- Prefer pure functions and immutable state transitions for solver logic.
- Avoid premature universal dimensional-analysis frameworks. Add stronger unit types only where they materially prevent errors.
- Record equations, initial conditions, assumptions, and numerical limitations for every model.
- Numerical methods must be selected based on the model and validated against analytical results or trusted reference cases.

## 8. Simulation Runtime Layer

Responsibilities:

- Start, pause, resume, and reset lifecycle
- Fixed-step simulation clock / accumulator where appropriate
- Speed multiplier and elapsed simulation time
- Calling the selected solver
- Producing immutable or safely copied snapshots for presentation
- Sampling measurement and graph data
- Cleaning up animation frames and event listeners

Runtime rules:

- Browser animation scheduling must not determine the numerical integration step.
- Use a fixed simulation step for deterministic stepping where appropriate; render frames may occur at variable refresh rates.
- Handle tab visibility changes deliberately (pause or controlled catch-up; never silently advance a large unstable delta).
- Reset must restore the exact initial state and clear derived measurements/graph history.
- Keep the runtime independent of React hooks and component lifecycle; provide an adapter or controller for the UI.
- Avoid over-generalizing until at least one complete simulation proves the required abstractions.

## 9. Visualization and presentation

- Rendering receives a read-only snapshot or view model.
- Canvas is appropriate for frequently updated scenes with many drawing operations.
- SVG is appropriate for diagrams, vectors, labels, axes, and modest scene complexity.
- Use accessible HTML controls for parameter input; do not make Canvas the only way to operate an experiment.
- Keep scale conversion, viewport mapping, and drawing transforms outside the physics equations.
- Graphs and measurements must use the same underlying simulation samples as the displayed experiment.
- Three.js is not a default dependency. Add it only for a specific experiment whose spatial understanding materially benefits from 3D.

## 10. State ownership

- Astro owns route and server-rendered content state.
- React owns transient interface state such as selected controls, open panels, and input drafts.
- Simulation Runtime owns the authoritative live experiment state and lifecycle.
- Physics Domain owns no global mutable state.
- Persisting user profiles, saved experiments, or server-side history is out of scope until a real product requirement appears.

Do not introduce Redux, Zustand, or another global state library at initialization. Start with component state and a small explicit runtime controller. Reassess only if real cross-component complexity emerges.

## 11. Source structure

The canonical source, test, naming, and documentation layout is defined in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md). That specification supersedes the abbreviated early directory sketch and should be kept consistent with this architecture document.

Create directories only when their first real module is introduced; the documented tree is a target organization, not a requirement to commit empty placeholders.

## 12. Error handling and resilience

- Validate user-provided simulation parameters before starting or stepping a model.
- Display understandable input errors; do not silently coerce invalid physical values.
- Guard runtime start/stop and cleanup so duplicate animation loops cannot be created.
- Provide an explanatory fallback if an experiment cannot initialize.
- Keep static explanatory content accessible when a simulation fails.
- Avoid collecting personal data; no account or backend requirement exists in the initial scope.

## 13. Performance and accessibility constraints

- Keep non-interactive content statically rendered and lightweight.
- Lazy-load optional heavy visualization dependencies.
- Avoid unnecessary React hydration and large charting dependencies.
- Respect reduced-motion preferences for decorative motion; provide pause controls for simulations.
- All parameters must have labels, units, keyboard-operable controls, and readable validation messages.
- Provide text equivalents or tabular values for important visual measurements.
- Do not rely on color alone to distinguish vectors or graph series.

## 14. Architecture acceptance criteria

Phase 0.2 is ready for verification when:

- Layer responsibilities and dependency rules are documented.
- Astro/React rendering and hydration boundaries are documented.
- Locale and public route conventions are documented.
- Content, physics, runtime, visualization, and UI ownership are documented.
- Backend and global-state exclusions are documented.
- The initial architecture is sufficient to proceed to the exact directory and coding conventions in Phase 0.3.
