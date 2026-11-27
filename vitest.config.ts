import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    // Keep the initial tooling phase buildable before the first domain test is added.
    // Remove this once Phase 4 introduces the first required physics unit tests.
    passWithNoTests: true,
  },
});
