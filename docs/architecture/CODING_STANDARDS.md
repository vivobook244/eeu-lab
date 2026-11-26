# EEU LAB — Coding Conventions and Quality Gates

Version: 1.0  
Date: 2026-11-26  
Status: Engineering baseline  
Repository: `vivobook244/eeu-lab`  
Working branch: `main`

## 1. Purpose

These conventions aim to make code predictable, scientifically trustworthy, reviewable, and maintainable without imposing unnecessary abstractions. They apply to Astro, React, TypeScript, simulation runtime, visualization, tests, and supporting scripts.

The exact tool versions and configuration files will be selected during Phase 1. This document defines the required behavior and quality policy, not a premature lockfile.

## 2. TypeScript policy

- Use TypeScript for application, domain, runtime, visualization, and test code.
- Enable strict compiler checking. Do not weaken strictness to silence errors.
- Avoid `any`. Prefer a precise type; use `unknown` at untrusted boundaries and narrow it before use.
- Avoid non-null assertions (`!`). If unavoidable, document the invariant that guarantees the value exists.
- Avoid unsafe type assertions. A cast does not validate runtime data.
- Model finite alternatives with discriminated unions rather than loosely related booleans or string values.
- Use `readonly` for data that should not be mutated by consumers.
- Prefer explicit return types for exported domain/runtime functions and public module contracts.
- Keep types close to the module that owns their meaning. Do not create a global type dumping ground.
- Do not introduce branded unit types or generic type frameworks until a demonstrated bug-prevention need justifies them.

## 3. Naming and module conventions

Follow the naming rules in [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md):
- Astro and React components use PascalCase.
- Domain, runtime, utility, and test module filenames use kebab-case.
- Types and interfaces use descriptive PascalCase.
- Constants use descriptive names; include units in names when needed to avoid ambiguity.
- Boolean names should read as predicates, such as `isPaused`, `hasValidParameters`, or `canReset`.
- Functions should describe an action or result; avoid vague names such as `handleData` outside a narrowly scoped event handler.
- Avoid abbreviations unless they are standard in physics or the project glossary.

Module rules:
- One module should have one clear responsibility.
- Keep public exports small and intentional.
- Avoid circular imports and broad barrel files by default.
- Do not create abstractions for a single trivial use unless they clarify an important boundary.
- Prefer composition and plain functions over inheritance-heavy designs.

## 4. Physics and numerical-computing rules

Scientific correctness takes precedence over convenience or visual smoothness.

- Use SI units internally unless a model specification explicitly justifies another unit.
- Make units visible in names, types, labels, and user-facing measurements.
- Never mix quantities with different dimensions without an explicit conversion or physically valid operation.
- Validate inputs at model boundaries: finite numbers, allowed ranges, initial conditions, and required constraints.
- Do not silently replace invalid values with zero, clamp them, or continue with a physically meaningless state.
- Keep solver functions deterministic and independent of UI, DOM, browser APIs, and rendering.
- Prefer pure functions and explicit state transitions.
- Document the governing equations, symbols, units, assumptions, initial conditions, applicable domain, and limitations for every model.
- Select numerical methods for the actual model. Do not assume a fixed-step method is universally correct.
- Where analytical solutions exist, compare numerical results against them. Otherwise document the trusted reference case and tolerance.
- State tolerances explicitly in tests; do not use arbitrary broad tolerances to make tests pass.
- Distinguish simulation time from wall-clock/render time.
- Do not round internal solver values for display convenience. Round only at presentation boundaries.
- Do not put scientific calculations in React components, Canvas draw functions, chart formatters, or content files.

## 5. Input validation and error handling

- Treat browser input, URL parameters, content frontmatter, and imported data as untrusted until validated.
- Validate once at a clear boundary and pass typed, validated values inward.
- Use explicit result/error contracts for expected invalid input or recoverable model failures where appropriate.
- Reserve thrown exceptions for exceptional failures, not routine validation flow.
- Never swallow errors silently or return fabricated success values.
- Error messages shown to learners should explain what is wrong and how to correct it without exposing stack traces.
- Preserve diagnostic context for developers without logging sensitive or unnecessary user data.
- Runtime lifecycle operations must define behavior for invalid transitions (for example, starting an already-running simulation).
- Cleanup animation frames, event listeners, observers, and rendering resources reliably.
- Keep static lesson content usable if an interactive experiment fails to initialize.

## 6. React and Astro conventions

- Astro owns public route composition, static content, metadata, and page-level structure.
- React is reserved for interactive islands and controls that need client-side behavior.
- Do not hydrate static content without a concrete interaction requirement.
- Keep React components focused on presentation and orchestration; they must not own scientific solver implementations.
- Keep transient UI state in the smallest component scope that works.
- The Simulation Runtime owns authoritative live experiment state; React should issue commands and render snapshots through explicit interfaces.
- Do not add global state libraries until cross-component complexity demonstrates the need.
- Use semantic HTML and native controls before custom widgets.
- Inputs must have accessible labels, units, keyboard behavior, and visible validation feedback.
- Avoid effects for values that can be derived during render.
- Ensure subscriptions and runtime connections are cleaned up when components unmount.
- Keep browser-only APIs out of Astro server-rendered execution paths.

## 7. Formatting, linting, and code clarity

The project will use Prettier for formatting and ESLint for static code-quality rules, configured during Phase 1.

Required policy:
- Formatting must be automated; do not debate formatting in code review.
- Lint must report no errors.
- Suppressions must be narrow, justified, and explained. Do not disable a rule globally to bypass a local issue.
- Avoid unused variables, dead code, unexplained magic numbers, and commented-out obsolete implementations.
- Extract a named constant when a value has scientific or domain meaning.
- Comments should explain why, assumptions, or non-obvious constraints—not narrate obvious syntax.
- Public APIs and complex numerical algorithms should have concise documentation.
- Keep functions small enough to understand, but do not split code mechanically into excessive micro-functions.
- Prefer readable code over clever compact expressions.

## 8. Documentation requirements

Every physics model specification must document:
- Model name and intended learning objective.
- Governing equations and symbol definitions.
- SI units and conversion behavior.
- Assumptions and initial conditions.
- Valid parameter ranges and invalid cases.
- Numerical method and time-step considerations, if applicable.
- Known limitations and expected accuracy.
- References or derivation basis.

Code comments should be added when they preserve important scientific or implementation context. Do not duplicate the entire model specification in source comments.

Architecture or API changes that alter layer boundaries must update the relevant architecture/decision documentation and the progress history.

## 9. Dependency policy

- Add a dependency only when it solves a concrete requirement better than a small native implementation.
- Prefer established, maintained packages with suitable licensing, security posture, and browser support.
- Avoid adding a charting, state, animation, physics-engine, or utility package before evaluating actual requirements.
- Do not add a package that duplicates existing platform/framework capabilities without a clear benefit.
- Keep optional heavy visualization packages out of pages that do not need them.
- Record significant dependencies and architectural consequences in the decision log.
- Exact package versions and dependency review process are finalized in Phase 1.

## 10. Required quality gates

The following checks define the intended validation sequence. Exact package scripts are established during Phase 1.

1. **Format check** — source files conform to Prettier.
2. **Lint** — ESLint reports no errors.
3. **Type check** — strict TypeScript and framework checks pass.
4. **Unit tests** — physics and pure logic tests pass.
5. **Integration tests** — runtime, measurement, graph-data, and adapter contracts pass.
6. **End-to-end tests** — critical browser journeys pass when relevant to the change.
7. **Production build** — Astro production build completes without errors.

A change must run all relevant gates. Documentation-only changes do not require application tests, but links, paths, consistency, and history must be reviewed.

Do not claim a gate passed unless its command actually ran and returned success. If a gate cannot run, record it as NOT RUN with the reason.

## 11. Change and commit policy

- Work only on `main`; do not create another branch unless the project owner changes the rule.
- Inspect branch, latest commit, and working tree/repository state before work.
- Keep each commit focused on a coherent change.
- Use descriptive imperative commit messages, for example `feat: add uniform motion solver` or `test: verify uniform motion boundaries`.
- Do not label work verified until acceptance criteria and relevant gates pass.
- Record phase/subphase progress, validation evidence, limitations, and commit SHA in `docs/DEVELOPMENT_PROGRESS.md`.
- Preserve prior history; append dated records.
- Never hide a failing test by deleting or weakening it without a documented reason and replacement coverage.

## 12. Quality gate acceptance checklist

Before a code change is considered complete:
- [ ] Scope and affected architecture layers are understood.
- [ ] Inputs and boundary conditions are validated.
- [ ] No forbidden cross-layer dependency was introduced.
- [ ] Types are strict; no unjustified `any`, unsafe assertion, or non-null assertion.
- [ ] Formatting and lint pass.
- [ ] Type checking passes.
- [ ] Relevant unit and integration tests pass.
- [ ] Relevant end-to-end tests pass, or are explicitly not applicable.
- [ ] Production build passes when application code/configuration changes.
- [ ] Scientific assumptions, units, and limitations are documented where applicable.
- [ ] Progress history and decision records are updated when required.

## 13. Deferred implementation details

The following will be configured in Phase 1 rather than guessed here:
- Exact ESLint flat-config rules and plugins.
- Exact Prettier options.
- TypeScript compiler options beyond the strict requirement.
- Package scripts and command names.
- CI workflow provider and configuration.
- Exact component-testing tooling and browser matrix.

## 14. Phase 0.4 acceptance criteria

Phase 0.4 can be marked VERIFIED when:
- TypeScript safety rules are explicit.
- Naming, module, and dependency conventions are documented or linked.
- Physics-specific numerical and scientific rules are explicit.
- Validation, error handling, Astro/React responsibilities, and accessibility expectations are explicit.
- Formatting, lint, type-check, test, and build quality gates are defined.
- Documentation, dependency, and commit policies are explicit.
- The rules are practical and defer tool-specific configuration to Phase 1.
