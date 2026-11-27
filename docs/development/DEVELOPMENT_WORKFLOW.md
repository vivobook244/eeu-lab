# EEU LAB — Development Workflow

Version: 1.0  
Date: 2026-11-26  
Status: Mandatory project workflow  
Repository: `vivobook244/eeu-lab`  
Working branch: `main`

## 1. Purpose

This document defines the repeatable workflow for planning, implementing, validating, recording, and delivering changes in EEU LAB. It applies to application code, physics models, content, tests, infrastructure, and technical documentation.

The workflow is evidence-driven: implementation, validation, and project history must agree. A change is not complete merely because files were edited or a commit was created.

## 2. Non-negotiable repository rules

1. Work on the single existing branch `main`.
2. Do not create, rename, or switch to another branch unless the project owner explicitly changes this policy.
3. Inspect the real repository state before every work session.
4. Keep changes within the agreed scope; do not introduce unrelated refactors.
5. Never claim a command, test, deployment, or inspection succeeded unless it was actually executed and its result observed.
6. Preserve development history in `docs/DEVELOPMENT_PROGRESS.md`; append dated entries rather than erasing prior records.
7. Record durable architectural decisions in `docs/DECISIONS.md`.
8. Keep commits focused and descriptive.
9. Do not add backend, database, authentication, monorepo, or Docker without a documented requirement and owner approval.
10. Scientific correctness is a release concern, not a cosmetic quality attribute.

## 3. Preflight inspection — required before each session

Before editing anything:

1. Confirm repository identity: `vivobook244/eeu-lab`.
2. Confirm the current branch is `main`; stop if it is not.
3. Inspect the latest commit SHA and message.
4. Inspect repository status and existing modifications. Do not overwrite or discard unreviewed changes.
5. Inspect the relevant source files, tests, and documentation.
6. Read the relevant roadmap subphase and current progress entry.
7. Check whether the task has already been implemented or partially implemented.
8. Identify dependencies, affected architecture layers, risks, and acceptance criteria.

If GitHub or the local environment does not expose a required part of repository state, record that limitation and do not pretend the inspection was complete.

## 4. Work planning and scope

Every implementation task must have:

- A clear objective and bounded scope.
- The roadmap phase/subphase or an explicitly approved maintenance task.
- Relevant acceptance criteria.
- Expected files/modules affected.
- Required validation commands and manual checks.
- Known risks, assumptions, and dependencies.

Prefer the smallest coherent change that satisfies the objective. Split unrelated work into separate commits, but do not create extra branches. If new requirements materially change scope, pause and document the impact before proceeding.

## 5. Implementation sequence

Use this sequence unless the task clearly makes a step inapplicable:

1. Reconfirm the preflight state.
2. Read the relevant architecture, coding standards, and testing strategy.
3. State the intended implementation approach and boundaries.
4. Implement the smallest complete unit of work.
5. Add or update tests alongside behavior changes.
6. Update technical documentation when contracts, assumptions, usage, or architecture change.
7. Run the required quality gates.
8. Inspect the final diff for accidental, unrelated, or unsafe changes.
9. Commit the validated change on `main`.
10. Read back the committed files and verify the resulting commit SHA.
11. Update the progress log with evidence and the commit SHA.

Do not skip tests simply because a change appears small. Apply the quality-gate mapping in `docs/architecture/CODING_STANDARDS.md` and `docs/testing/TESTING_STRATEGY.md`.

## 6. Validation and evidence

For application changes, run all relevant configured checks, normally:

1. Formatting check.
2. Lint.
3. Type check.
4. Relevant unit tests.
5. Relevant integration tests.
6. Relevant end-to-end tests.
7. Production build.

The exact commands are defined in the project package scripts during Phase 1. Do not invent command names before they exist.

For documentation-only changes, review:

- Markdown structure and internal links.
- File paths and referenced names.
- Consistency with architecture, roadmap, and decision records.
- Accuracy of claims and preservation of prior progress history.
- Read-back of committed content.

For physics changes, additionally validate analytical/reference cases, units, assumptions, numerical tolerance, and scientific review requirements.

For each check, record one of:

- PASS — command/check ran and succeeded.
- FAIL — command/check ran and failed; include useful failure evidence.
- NOT RUN — not executed; state why.
- NOT APPLICABLE — genuinely irrelevant to the change; state why when non-obvious.

A test failure must not be hidden by deleting a test, weakening an assertion, or broadening tolerances without a justified and documented correction.

## 7. Commit policy

Use focused imperative commit messages with a conventional prefix where suitable:

- `docs:` documentation and project records.
- `feat:` user-visible capability.
- `fix:` defect correction.
- `test:` test-only changes.
- `refactor:` behavior-preserving structural change.
- `build:` tooling, dependencies, and build configuration.
- `chore:` maintenance that does not fit another category.

Examples:

- `docs: define development workflow`
- `feat: add uniform motion solver`
- `test: verify uniform acceleration boundaries`
- `fix: prevent simulation time jump on resume`

Do not combine unrelated features, formatting-only churn, and documentation rewrites into one commit unless they are inseparable. Never report a commit SHA until the repository confirms it.

## 8. Progress history and status rules

Every roadmap subphase must be represented in `docs/DEVELOPMENT_PROGRESS.md`.

Each dated history entry must include:

- Date.
- Phase and subphase ID/name.
- Status.
- Objective.
- Work completed.
- Artifacts created or updated.
- Commit SHA(s) and messages.
- Validation evidence, including PASS/FAIL/NOT RUN/NOT APPLICABLE.
- Limitations, blockers, or deferred decisions.
- Next planned subphase.

Use the project status labels consistently:

- NOT STARTED — no work has begun.
- IN PROGRESS — work is actively underway.
- BLOCKED — a documented dependency or failure prevents progress.
- IMPLEMENTED — changes exist, but acceptance or verification is incomplete.
- VERIFIED — acceptance criteria and all relevant validation have passed.

Do not mark a phase VERIFIED because code exists, because a commit succeeded, or because documentation says it should work. The evidence must support the status.

The current snapshot may be updated to reflect the latest state, but dated history must remain intact. Correct an inaccurate historical entry only with an explicit dated correction; do not silently rewrite history.

## 9. Defects, failed checks, and regressions

When a defect or failing check is found:

1. Preserve the failure evidence and identify the affected commit/files.
2. Reproduce the issue where practical.
3. Determine whether it is a regression, an existing defect, an environment issue, or an incorrect expectation.
4. Add a regression test when the behavior can be tested automatically.
5. Fix the root cause rather than masking the symptom.
6. Re-run the affected checks and relevant broader quality gates.
7. Record the failure, correction, and final evidence in the progress log.

If the issue cannot be resolved safely within the current scope, mark the task BLOCKED or IMPLEMENTED as appropriate and explain what remains. Do not claim verification.

## 10. Architecture and decision changes

Before changing a documented architecture boundary or durable technical choice:

1. Identify the existing decision and the concrete problem it creates.
2. Explain alternatives and their trade-offs.
3. Prefer the least complex option that meets the product requirement.
4. Obtain project-owner approval when the change affects product direction, stack, branch policy, or previously approved constraints.
5. Update `docs/DECISIONS.md` with a new numbered decision; do not erase the old decision.
6. Update affected architecture, structure, standards, roadmap, and tests.
7. Record the decision and its implementation in the progress log.

A decision record should state context, decision, consequences/rationale, and date. Superseded decisions remain in the log and should be explicitly marked as superseded rather than deleted.

## 11. Dependency and security review

Before adding or upgrading a dependency:

- Identify the specific requirement it solves.
- Check maintenance activity, compatibility, licensing, bundle/runtime impact, and security considerations.
- Prefer native platform/framework capabilities when adequate.
- Avoid adding heavy visualization or state packages to static pages unnecessarily.
- Record significant dependency choices in `docs/DECISIONS.md`.
- Never commit secrets, private keys, tokens, or real user data.

## 12. Completion and handoff

A subphase may be closed only when:

- Its acceptance criteria are met.
- Relevant validation has passed or any exception is explicitly approved and documented.
- The final diff has been reviewed.
- The change is committed on `main`.
- The committed files have been read back or otherwise verified.
- The progress log includes artifacts, validation, limitations, and commit SHA.
- Any durable architecture decision has been recorded.

A phase is complete only when all required subphases are VERIFIED and its phase exit criteria are met.

## 13. Development update format

Each user-facing update should be concise and evidence-based:

1. **Status** — phase/subphase and status label.
2. **Completed** — concrete work performed.
3. **Files** — relevant artifacts changed.
4. **Validation** — checks actually run and their results.
5. **Commit** — verified SHA and message.
6. **Limitations** — what remains untested or deferred.
7. **Next** — the next bounded task.

Do not use vague progress claims such as “almost done” without explaining what remains. Clearly distinguish documentation planning from implemented application behavior.

## 14. Phase 0.6 acceptance criteria

Phase 0.6 is VERIFIED when:

- The single-branch and preflight inspection rules are explicit.
- The planning and implementation sequence is repeatable.
- Validation evidence and honest reporting rules are explicit.
- Commit conventions and final diff review are documented.
- Progress history fields and status definitions are explicit.
- Defect/regression handling is documented.
- Architecture/decision change process is documented.
- Completion and user-facing handoff requirements are explicit.
- The workflow is consistent with the roadmap, coding standards, testing strategy, and decision log.
- The committed document has been read back and reviewed for consistency.
