# GitHub profile

Help visitors understand Jaden's work and reach its strongest evidence. This is
a profile README and generated assets, not an application. Keep claims grounded
in linked repositories, dated measurements and explicit limitations. Preserve
archived/lab status; a badge or historical result does not establish live service.

Read `README.md` for authored content and `.github/STATS.md` plus the relevant
`.github/workflows/` and `.github/scripts/` files for generated statistics.
Preserve `STATS_START`/`STATS_END` and `LOC_START`/`LOC_END` markers. Fix generators
or their inputs rather than hand-editing generated counts, timestamps or SVGs.
Language bytes and repository line counts are not proficiency or authorship.

For prose changes, check rendering, links, image alt text and factual scope.
For stats changes, CI declares
`python3 -m unittest discover -s .github/scripts -p 'test_*.py' -v` and
`python3 .github/scripts/profile_stats.py --check`, plus Markdown/SVG validation.
Do not require an application build. Report stale data honestly.

Stats and LOC workflows commit to `main`; snake generation publishes to `output`.
Preserve the shared README-writer concurrency group and rejection of partial
scans. Workflow dispatch is publication, not a harmless local check.

Maintain instructions in `AGENTS.md`; preserve concurrent edits and do not load
legacy instruction files. Write docs with purpose and useful next action, PRs
with the concrete change and checks actually run, and concise outcome-based
commits (`type: change`). Distinguish drafted, checked and published content.
