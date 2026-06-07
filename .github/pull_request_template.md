## Summary

## <!-- 1-3 bullets on what changed and why. -->

-

## Type of change

<!-- Tick what applies. Conventional-commit prefix on the PR title should match. -->

- [ ] feat (new capability)
- [ ] fix (bug fix)
- [ ] refactor (no behaviour change)
- [ ] perf (faster / smaller / cheaper)
- [ ] docs
- [ ] chore (build, CI, deps)
- [ ] test

## Test plan

<!-- How did you verify this works? -->

- [ ] Unit tests added or updated
- [ ] E2E tests added or updated
- [ ] Manually tested in the example app
- [ ] N/A (explain)

## Risk + rollback

<!-- What breaks if this is wrong? How would you back it out? Skip for chore-only PRs. -->

## Breaking changes

<!-- If the PR title starts with `feat!` or `fix!`, list what consumers need to do. -->

---

🤖 PR-checks must pass before merge. Run `pnpm -r typecheck && pnpm -r lint && pnpm knip:ci && pnpm e2e` locally for a fast preview.
