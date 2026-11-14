# Project verification recipes

Discover the project's own launch commands, fixtures, authentication, test tools, and cleanup before adding instructions. Keep project-specific details in that project's repository or canonical context, not the organization skill.

The recipe lives in the project's canonical context in Notion, as a Verification section of the project page or a linked document maintained through `documents`, and a repository may mirror it in its own instructions file. `verify` reads it first on every run; a project without one reports behavioral checks as unverified until the recipe exists and has been run once end to end.

A useful recipe names:

- The command or procedure that starts the relevant artifact and confirms the expected version is ready.
- The real user entry point and actions to exercise it.
- The visible result and side effects that establish correctness.
- The evidence to retain, with its revision and environment.
- The safe cleanup for only the processes and data this run created.

Start with the feature being changed rather than cataloging the entire application. Use semantic selectors, public APIs, or normal CLI inputs over implementation-only shortcuts. Reuse the existing test runner. Explain any simulated boundary and what it leaves unverified.

Run the recipe end to end, check that cleanup preserves evidence, and correct any failing instruction before calling it ready. Add regression coverage for a recurring defect when authorized. Prefer a deterministic check to an additional paragraph reminding future agents to be careful.
