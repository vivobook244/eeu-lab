# EEU LAB — Testing and Validation Strategy

Version: 1.0  
Date: 2026-11-26  
Status: Engineering baseline  
Repository: `vivobook244/eeu-lab`  
Working branch: `main`

## 1. Purpose

Testing must establish more than whether the application renders. EEU LAB must demonstrate that:
1. Physics calculations implement the documented model correctly.
2. Simulation runtime advances, pauses, resets, and samples time consistently.
3. Displayed measurements and graphs represent the same underlying simulation state.
4. Learning content describes the model, assumptions, units, and limitations accurately.
5. Learners can operate the experience reliably and accessibly across supported browsers and screen sizes.

A green software test suite does not by itself certify scientific correctness. Scientific review and explicit reference cases are required in addition to automated tests.

## 2. Validation layers

| Validation layer | Primary question | Main evidence |
|---|---|---|
| Mathematical/model | Are equations and solver outputs correct? | Unit tests, analytical solutions, reference calculations |
| Runtime | Does simulated time and lifecycle behave deterministically? | Unit and integration tests |
| Measurement/graph | Are values, samples, units, and plotted points consistent? | Contract and integration tests |
| Presentation | Are controls, labels, formulas, and fallbacks understandable? | Component tests, accessibility checks, manual review |
| End-to-end | Can a learner complete a realistic experiment? | Playwright browser journeys |
| Scientific review | Are assumptions, interpretations, and explanations physically sound? | Model specification review and documented checklist |
| Release | Is the built site stable, crawlable, and performant? | Production build, browser smoke tests, SEO/accessibility/performance review |

## 3. Test organization

Use the structure defined in [PROJECT_STRUCTURE.md](../architecture/PROJECT_STRUCTURE.md):

```text
tests/
  unit/
    physics/
    simulation/
    visualization/
  integration/
  e2e/

docs/
  physics/
  testing/
```

Guidelines:
- Unit tests should be fast, deterministic, isolated, and independent of a browser.
- Integration tests should verify contracts across solver, runtime, measurement, graph-data, and visualization adapters.
- End-to-end tests should focus on critical learner journeys rather than reproduce every unit test in a browser.
- Scientific specifications and reference cases belong under `docs/physics/`.
- Test procedures, validation matrices, and known test limitations belong under `docs/testing/`.
- Use descriptive test names that state the condition and expected result.
- Keep test fixtures explicit and small; avoid hidden shared mutable state.
- Do not introduce snapshots as the only evidence for numerical correctness.

## 4. Physics model unit testing

Every solver must have tests before it is integrated into a learner-facing experiment.

### 4.1 Required categories

For each model, test:

1. **Known analytical/reference cases** — compare solver outputs with a hand-derived analytical solution or trusted reference.
2. **Initial conditions** — verify the state at time zero.
3. **Boundary conditions** — include zero, minimum, maximum, and physically meaningful limiting cases.
4. **Invalid inputs** — NaN, positive/negative infinity, out-of-range values, and invalid combinations must be rejected according to the model contract.
5. **Sign and direction** — test negative direction, negative acceleration where valid, and coordinate convention.
6. **Dimensional/unit consistency** — confirm documented units and conversions at boundaries.
7. **Determinism** — identical inputs and stepping sequences must produce identical outputs.
8. **Invariants** — check properties expected to remain true for the model.
9. **Regression cases** — preserve any discovered defect as a test before or with its fix.

Tests must not encode a wrong assumption merely because current implementation produces that result.

### 4.2 GLB reference model

For one-dimensional uniform motion with constant velocity:

`x(t) = x_0 + vt`

`v(t) = v_0`

Required checks:
- At (t=0), position equals (x_0) and velocity equals (v_0).
- Positive velocity increases position along the positive axis.
- Negative velocity decreases position along the positive axis.
- Zero velocity keeps position constant.
- Equal time intervals produce equal displacement.
- Splitting an interval into multiple steps gives the same analytical position, within the declared numeric tolerance.
- Non-finite initial position, velocity, or time inputs are rejected.
- The sign convention and units are consistent in outputs.

### 4.3 GLBB reference model

For one-dimensional constant acceleration:

`x(t) = x_0 + v_0 t + \frac{1}{2}at^2`

`v(t) = v_0 + at`

Required checks:
- At (t=0), position and velocity equal their initial values.
- Zero acceleration reduces to the GLB case.
- Positive and negative acceleration change velocity with the expected sign.
- Negative initial velocity and opposite acceleration are tested.
- Displacement and velocity match analytical results.
- Equal time interval subdivision remains consistent for the analytical constant-acceleration model.
- Non-finite and invalid parameters are rejected.
- Units remain position in metres, velocity in metres per second, acceleration in metres per second squared, and time in seconds.

### 4.4 Numerical tolerance policy

- Prefer exact assertions for discrete state, validation outcomes, and lifecycle transitions.
- Use approximate assertions for floating-point numerical outputs.
- Derive tolerance from expected numerical error, scale, algorithm, and accumulated step count.
- Use both absolute and relative tolerance where values may be near zero or span different magnitudes.
- Document tolerance rationale next to the test or in the model specification.
- Do not increase tolerance solely to make a failing test pass.
- For constant-velocity and constant-acceleration analytical models, compare against the exact analytical expressions; do not introduce numerical integration error where it is unnecessary.

## 5. Simulation runtime testing

The runtime is responsible for simulation lifecycle and simulated time, not physical equations.

Required unit/integration checks:
- Initial state is established correctly.
- Start begins progression exactly once.
- Repeated start commands do not create duplicate loops.
- Pause prevents further simulation-time advancement.
- Resume continues from the paused state without an unintended time jump.
- Reset restores initial parameters/state and clears elapsed time, measurements, and graph history.
- Speed multiplier changes simulated-time progression according to its documented contract.
- A fixed-step accumulator handles variable render-frame intervals without changing the solver's defined step size.
- Large frame gaps and tab visibility changes follow an explicit pause/catch-up policy.
- Excess accumulated time is bounded according to a documented policy; the runtime must not enter an unbounded catch-up spiral.
- Stop/dispose removes animation frames, listeners, observers, and rendering resources.
- Invalid lifecycle transitions produce documented outcomes.
- A deterministic test clock/scheduler can drive runtime tests without real waiting.

The runtime must distinguish wall-clock time, render-frame time, and simulation time.

## 6. Measurement and graph consistency

Measurement and graph data must derive from the same authoritative simulation samples.

Required checks:
- Every sample has an explicit simulation timestamp.
- Values and labels carry the correct SI units.
- Sampling order is monotonic in simulation time.
- Pause does not create unintended samples or advance timestamps.
- Reset clears previous experiment samples.
- Graph series use the same sample values as the measurement layer.
- Position-time, velocity-time, and acceleration-time values match the solver state for the same timestamp.
- Missing or invalid samples are handled explicitly; they are not silently plotted as zero.
- Display rounding does not alter underlying sample values.
- Axis labels, scale, and units correspond to the plotted quantity.
- A graph cannot visually imply precision beyond the model or displayed data.

## 7. Visualization and UI testing

Use deterministic snapshots/view models to test visualization adapters where practical.

Check:
- Coordinate mapping and scale conversion do not mutate physical state.
- Positive and negative directions are represented consistently.
- Resizing the viewport does not alter solver state or simulation time.
- Canvas/SVG renderers consume snapshots rather than calculate model equations.
- Controls expose labels, units, keyboard operation, and validation feedback.
- Important values are available as text, not only through color or visual position.
- Color is not the only way to distinguish vectors or graph series.
- Reduced-motion preferences are respected for decorative animation; experiments have clear pause controls.
- Static lesson explanation remains available if an interactive island fails to initialize.

Do not rely exclusively on visual snapshot tests. A screenshot can look plausible while showing scientifically incorrect values.

## 8. End-to-end browser journeys

Playwright should cover a small set of high-value journeys.

Initial GLB/GLBB journeys:
1. Open the Indonesian linear-motion page directly by URL and verify the page content loads.
2. Open the English equivalent and verify locale-specific title, explanatory content, and metadata.
3. Set valid initial parameters and confirm displayed units and values.
4. Start an experiment and verify simulation time and state advance.
5. Pause and verify values stop advancing.
6. Resume and verify progression continues.
7. Reset and verify initial conditions and graph/measurement history are restored.
8. Enter invalid values and verify understandable validation feedback without corrupting the simulation.
9. Verify that the experiment remains operable by keyboard and its key measurements are available to assistive technology.
10. Reload the page and verify the experiment initializes in its documented default state.

E2E tests must avoid depending on exact animation frame timing. Use exposed observable state, controlled test hooks, or tolerant assertions rather than arbitrary sleep durations.

## 9. Scientific and educational review

Before a model is published, complete a human review checklist:

- [ ] The selected physical model matches the stated learning objective.
- [ ] Equations are correct and symbols are defined.
- [ ] SI units and sign conventions are consistent.
- [ ] Assumptions and initial conditions are visible to learners.
- [ ] Parameter bounds are physically and pedagogically justified.
- [ ] Solver outputs match analytical or trusted reference cases.
- [ ] Measurements and graphs agree with the solver.
- [ ] Visual motion does not contradict displayed quantities or equations.
- [ ] Explanations distinguish model assumptions from real-world complexity.
- [ ] Known limitations and idealizations are explained.
- [ ] Indonesian and English content preserve the same scientific meaning.
- [ ] References are credible and relevant.

A model should not be marked scientifically reviewed solely because automated tests pass.

## 10. Browser, responsive, accessibility, and performance validation

The supported browser matrix and minimum versions will be chosen in Phase 1/Phase 9 based on target audience and current browser support.

At minimum, validate:
- Current stable Chromium-based browser.
- Current stable Firefox.
- Current stable Safari/WebKit where supported by the target platform.
- Narrow mobile viewport, typical mobile viewport, tablet, and desktop layouts.
- Keyboard-only operation for experiment controls.
- Accessible names, labels, focus visibility, semantic headings, and readable errors.
- Text alternatives for key visual measurements.
- No critical console errors or unhandled promise rejections.
- No unnecessary hydration or large visualization dependency on static pages.
- Performance of the first interactive experiment on a representative mobile device.

Automated accessibility tools are useful but do not replace keyboard and assistive-technology review.

## 11. Test data and reproducibility

- Prefer fixed parameter sets and deterministic clocks.
- Record the model version, parameters, units, time step, and expected reference values for scientific fixtures.
- Avoid tests that depend on real network services or live external content.
- Avoid random test inputs unless a deterministic seed is supplied.
- If property-based testing is introduced later, use a seeded generator and preserve failing examples as regression cases.
- Keep production behavior free from test-only shortcuts; expose test controls only through explicit build/test configuration.

## 12. Failure severity and release blockers

**Release-blocking**
- Incorrect equations, solver results, unit conversions, or sign conventions.
- Runtime advances incorrectly, duplicates loops, or fails to reset.
- Displayed measurements or graphs disagree materially with the solver.
- Invalid parameters corrupt the simulation or cause an unhandled crash.
- A critical experiment cannot be operated by keyboard or has no text alternative for essential data.
- Production build or critical learner journey fails.

**High priority**
- Missing model assumptions, limitations, or scientific references.
- Localization changes scientific meaning.
- Significant mobile usability or performance regressions.

**Non-blocking**
- Minor visual inconsistencies that do not obscure meaning or prevent operation.
- Non-critical layout polish issues with a documented follow-up.

## 13. Quality gate mapping

| Change type | Required checks |
|---|---|
| Physics solver | Format, lint, type-check, solver unit tests, reference/analytical comparison |
| Runtime | Format, lint, type-check, runtime unit tests, relevant integration tests |
| Measurement/graph | Format, lint, type-check, unit and consistency integration tests |
| Visualization/UI | Format, lint, type-check, relevant component/integration tests, accessibility checks |
| Content/translation | Schema/content validation, link/reference review, scientific and language review |
| Routing/SEO | Type-check, production build, route and metadata E2E/smoke checks |
| Cross-cutting/release | All relevant gates, E2E, production build, browser smoke and release review |
| Documentation-only | Link/path consistency, technical review, progress history; application tests not applicable |

## 14. Phase 0.5 acceptance criteria

Phase 0.5 can be marked VERIFIED when:
- Test layers and directory organization are explicit.
- Physics solver test categories and GLB/GLBB reference cases are defined.
- Numerical tolerance policy is documented.
- Runtime lifecycle and deterministic time behavior have explicit tests.
- Measurement/graph consistency checks are defined.
- Visualization, UI, and end-to-end journeys are defined.
- Scientific/educational review is required separately from automated testing.
- Browser, responsive, accessibility, reproducibility, and release-blocker expectations are documented.
- Quality gates are mapped to change types.
- The strategy is consistent with architecture and coding standards.
