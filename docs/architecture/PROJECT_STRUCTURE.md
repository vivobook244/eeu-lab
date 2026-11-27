# EEU LAB — Project Source and Documentation Structure

Version: 1.0  
Date: 2026-11-26  
Status: Engineering baseline  
Repository: `vivobook244/eeu-lab`  
Working branch: `main`

## 1. Goals

This structure makes the architecture boundaries explicit without creating a large framework inside the application. It must support:

- Astro-rendered, localized public pages and authored learning content.
- Small React islands for interactive experiments and controls.
- Independently testable TypeScript physics models.
- A simulation runtime that is independent of React component lifecycle.
- Visualization code that consumes state and does not implement physics equations.
- Unit, integration, and browser end-to-end tests.
- Traceable engineering documentation.

Create a directory when its first real module is introduced. Do not add empty placeholder directories.

## 2. Proposed source tree

```text
src/
  assets/
    images/
  components/
    astro/
      content/
      layout/
    react/
      simulation/
      ui/
  content/
    articles/
      en/
      id/
    lessons/
      en/
      id/
  i18n/
  layouts/
  pages/
    [locale]/
      articles/
      labs/
      physics/
  physics/
    constants/
    math/
    models/
      mechanics/
    units/
  simulation/
    graph/
    measurement/
    runtime/
  styles/
    global.css
  visualization/
    canvas/
    svg/

public/
  icons/
  images/

tests/
  e2e/
  integration/
  unit/
    physics/
    simulation/
    visualization/

docs/
  architecture/
  physics/
  testing/
  releases/
  DEVELOPMENT_PROGRESS.md
  DEVELOPMENT_ROADMAP.md
  DECISIONS.md
```

The tree is a target map, not a requirement to create every folder immediately. Remove or defer any subdirectory that has no concrete module yet.

## 3. Directory responsibilities

| Path                          | Responsibility                                                          | Constraints                                                   |
| ----------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `src/pages/`                  | Astro route entry points and page composition                           | No physics calculations                                       |
| `src/layouts/`                | Shared Astro document/page layouts                                      | Own document shell and metadata composition                   |
| `src/components/astro/`       | Reusable Astro-only content and layout components                       | Keep static rendering where possible                          |
| `src/components/react/`       | React islands and interactive UI                                        | UI orchestration only; no duplicated solver equations         |
| `src/content/`                | Authored lessons and articles, grouped by locale                        | Data/content only; never execute arbitrary content code       |
| `src/i18n/`                   | Locale definitions, labels, and localization helpers                    | Avoid embedding page-specific content here                    |
| `src/physics/`                | Pure physics domain: constants, units, math, model parameters, solvers  | Must not depend on UI, Astro, DOM, browser APIs, or renderers |
| `src/simulation/runtime/`     | Lifecycle, clock, stepping, and solver coordination                     | May depend on Physics Domain; must not depend on React        |
| `src/simulation/measurement/` | Sampling and measurement data derived from simulation state             | Must preserve explicit units and time basis                   |
| `src/simulation/graph/`       | Graph series and graph-facing data contracts                            | Data preparation only; rendering belongs in visualization     |
| `src/visualization/`          | Canvas/SVG drawing, coordinate mapping, and rendering adapters          | Consumes snapshots; does not calculate the physical model     |
| `src/styles/`                 | Global styles and shared design foundations                             | No application/domain logic                                   |
| `src/assets/`                 | Assets imported and processed by the build                              | Publicly addressable static files belong in `public/`         |
| `public/`                     | Files served as-is, such as public icons and static images              | No build-time module imports                                  |
| `tests/unit/`                 | Fast isolated tests for pure modules and rendering helpers              | Mirror source responsibility where practical                  |
| `tests/integration/`          | Tests across runtime, solver, measurements, and adapters                | Verify layer contracts                                        |
| `tests/e2e/`                  | Browser journeys for public pages and experiments                       | Test user-visible behavior                                    |
| `docs/architecture/`          | Architecture and structural specifications                              | Keep durable design boundaries here                           |
| `docs/physics/`               | Scientific model specifications, equations, assumptions, and references | One specification per meaningful model/topic                  |
| `docs/testing/`               | Test strategy and quality procedures                                    | Keep operational test guidance here                           |
| `docs/releases/`              | Release, deployment, and rollback records                               | Add when release workflow exists                              |

### Astro content configuration

Astro content collection configuration must use the location and API supported by the Astro version selected in Phase 1. The structure above reserves authored content under `src/content/`; it does not prematurely lock an Astro API or package version.

## 4. Route and content conventions

- All public routes are locale-prefixed: `/id/` and `/en/`.
- Astro route files live under `src/pages/[locale]/`.
- Lesson and article source content is grouped by content type and locale.
- Keep stable content identifiers separate from translated titles.
- A translation should preserve the same conceptual identity while allowing locale-specific slugs where SEO requires them.
- Do not publish empty translations as complete pages.
- Route slugs use lowercase kebab-case.
- Content schema validation belongs at the Astro content boundary; physics solver contracts remain in `src/physics/`.

## 5. Naming conventions

- Astro component/layout files: PascalCase, e.g. `BaseLayout.astro`, `LessonHeader.astro`.
- React component files: PascalCase, e.g. `SimulationControls.tsx`.
- TypeScript domain, runtime, and utility modules: kebab-case, e.g. `uniform-motion.ts`, `fixed-step-clock.ts`.
- Test files: same base name with `.test.ts` or `.test.tsx`, e.g. `uniform-motion.test.ts`.
- Types and interfaces: descriptive PascalCase names; avoid vague names such as `Data`, `Info`, or `Manager`.
- Constants: use descriptive names and explicit units in names where ambiguity is possible, e.g. `STANDARD_GRAVITY_M_S2`.
- URL slugs and content identifiers: lowercase kebab-case unless a stable external identifier requires otherwise.
- Avoid abbreviations unless they are standard in physics or already defined in the domain glossary (e.g. GLB, GLBB, SI).

## 6. Dependency boundaries

Allowed high-level dependency direction:

```text
Astro Pages / Layouts
        |
        +---- Content and Astro components
        |
        +---- React interactive island
                    |
             Simulation UI
                    |
             Simulation Runtime
               /          \\
      Physics Domain    Visualization
       (pure TS)          (Canvas/SVG)
```

Rules:

1. `src/physics/` is framework-agnostic pure TypeScript. It must not import from Astro, React, `src/components/`, `src/visualization/`, or browser APIs.
2. `src/simulation/runtime/` may import Physics Domain contracts and solvers. It must not import React or manipulate the DOM.
3. Measurement and graph data modules consume simulation outputs; they do not reimplement equations.
4. `src/visualization/` consumes snapshots/view models. It must not become an alternate location for physics calculations.
5. React components may coordinate controls, runtime commands, and visualization surfaces through explicit interfaces.
6. Astro pages compose content and interactive islands; they must not contain solver implementations.
7. Avoid circular dependencies. Shared contracts should live with the domain that owns them, or in a narrowly scoped contract module when multiple layers genuinely need them.
8. Do not create broad `index.ts` barrel files by default. Add explicit public entry points only when they improve a stable module boundary.

## 7. Testing layout

- Place pure physics tests under `tests/unit/physics/`, mirroring the model/module name.
- Place runtime, measurement, and graph unit tests under `tests/unit/simulation/`.
- Place visualization helper tests under `tests/unit/visualization/` when they can be tested deterministically.
- Use `tests/integration/` for contracts across solver, runtime, sampling, and presentation adapters.
- Use `tests/e2e/` for critical browser journeys, such as opening a localized lesson, changing experiment parameters, starting/pausing/resetting a simulation, and verifying displayed measurements.
- Tests must check units, boundary conditions, invalid parameters, and known analytical/reference cases where applicable.
- Exact test runner configuration, component-testing dependencies, and scripts are finalized in Phase 1 and Phase 0.5.

## 8. Documentation layout

Existing top-level documents remain canonical:

- `docs/DEVELOPMENT_ROADMAP.md` — planned phases and acceptance criteria.
- `docs/DEVELOPMENT_PROGRESS.md` — dated phase history and current status.
- `docs/DECISIONS.md` — durable engineering decisions.

Additional documents:

- `docs/architecture/` — application and module architecture.
- `docs/physics/` — model specifications, equations, assumptions, limitations, and scientific references.
- `docs/testing/` — validation strategy and test procedures.
- `docs/releases/` — release notes, deployment, and rollback procedures.

Do not move existing documents merely to make the tree uniform; preserve established links and history.

## 9. Import conventions

- Use the `@/` alias for imports rooted at `src/` once configured in Phase 1.
- Keep test-runner alias resolution consistent with TypeScript and Astro configuration.
- Prefer explicit imports from the owning module over deep imports into another layer's implementation details.
- Do not introduce path aliases for every folder; one source-root alias is sufficient initially.

## 10. Scope deliberately deferred

The following are not decided or required by this structure:

- Exact Astro, React, TypeScript, and test dependency versions.
- Exact Astro content API/configuration syntax.
- Charting library selection.
- A global state management library.
- A generic plugin/extension architecture.
- Backend, database, authentication, user profiles, or saved experiments.
- A universal physics engine or generic dimensional-analysis framework.

These choices require implementation evidence and are addressed in their relevant roadmap phases.

## 11. Phase 0.3 acceptance criteria

Phase 0.3 can be marked VERIFIED when:

- The exact target source and documentation layout is recorded.
- Responsibilities and forbidden dependencies for major directories are explicit.
- Locale/content organization and route placement are explicit.
- Naming and import conventions are explicit.
- Unit, integration, and end-to-end test locations are explicit.
- Existing documents and history are preserved.
- Roadmap and progress records point to this specification.
- The structure is consistent with the application architecture and does not require premature empty folders.
