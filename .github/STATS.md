# Profile statistics

The six activity, streak and language SVGs are generated from GitHub's GraphQL API by
`scripts/profile_stats.py`. They were previously static files captured on August 30, 2026;
there was no workflow to refresh them. The contribution snake had a separate working schedule.

## Definitions

- **Total contributions:** sum of GitHub's daily contribution counts from account creation through
  the snapshot date. This includes the kinds of activity that GitHub counts, not just commits.
- **Last 365 days:** the snapshot date and preceding 364 calendar dates. GitHub's default calendar
  can include extra days to align its weeks, so its heading can have a different total.
- **Current streak:** consecutive dates with at least one contribution, ending today or yesterday.
  An unfinished today does not reset yesterday's streak. After a full missed day it is zero.
  We use GitHub's returned calendar dates without regrouping events; GitHub assigns contributions
  using the event's time zone. The snapshot's definition of today and its rollover use UTC.
- **Longest streak:** the longest uninterrupted run since account creation, including across
  year boundaries. Equal lengths keep the earliest run. GitHub can revise historical counts.
- **Public repositories and stars:** owned, non-fork, public repositories, including archives.
- **Languages:** GitHub Linguist's detected bytes across that same inventory, with full repository
  pagination. The top six languages plus Other use all detected bytes as the denominator.
  These are neither lines authored by Jaden nor a measure of proficiency.
- **LOC:** cloc's current code-line inventory across non-fork source repositories accessible to
  the existing LOC token, including archives and excluding this profile. This broader inventory
  can include private repositories. It is not a contribution count or a lifetime-written total.
  Deleting code or repositories can legitimately decrease it.

The refresh uses the workflow's short-lived `GITHUB_TOKEN`, not a personal token or hosted card
service. Contribution visibility follows GitHub's profile/API settings; unpublished private
activity cannot be inferred. No private repository names or contents enter the stats snapshot.
The JSON stores only daily aggregate counts and public repository/language aggregates.

## Refresh and failure behavior

`profile-stats.yml` refreshes every six hours, at minute 23, and supports **Run workflow**.
It also runs on relevant changes to main. All API requests, calendar coverage, totals, repository
pagination and rendering are validated before writing files. HTTP/API or partial-data failures
fail the job and retain the previous committed snapshot. Both color themes, the JSON receipt,
README text and image versions are committed together. The image URLs include content hashes
so GitHub's image proxy gets a new URL after every refresh.

Every card and the README show their last successful refresh time, with text totals available
even if images cannot load. The live calendar link remains the source for activity since that
refresh. Scheduled execution can be delayed by GitHub; this is a dated snapshot, not realtime.

`profile-health.yml` checks independently every six hours: stats must be no more than 36 hours old,
the daily LOC scan no more than 72 hours old, and both snake files no more than 36 hours old.
It also rejects disabled producer workflows. The README links both refresh and health badges.
GitHub Actions failure notifications depend on the account's notification preferences.
If all scheduled workflows stop, the visible timestamps and live-calendar link still expose
the age of the last successful data; no GitHub-hosted monitor can guarantee detection during
a GitHub-wide scheduling outage.

Stats and LOC publishing share a concurrency group. Neither force-pushes main. A failed scan
does not get a new timestamp. Complete LOC scans may decrease; incomplete scans still fail.
The snake keeps its separate output branch; its README wording and status badge distinguish
its own refresh schedule from the contribution cards.

## Verify or recover

```sh
python3 -m unittest discover -s .github/scripts -p 'test_*.py' -v
python3 .github/scripts/profile_stats.py --check
GH_TOKEN=... python3 .github/scripts/profile_health.py
```

To refresh, run **Refresh Profile Stats** under Actions, or run `profile_stats.py` without
`--check` after authenticating `gh`. On main the workflow uses only `GITHUB_TOKEN`.
Do not substitute a broader personal token in the workflow: it can change contribution visibility.
Review `generated/profile-stats.json` and the README diff before publishing a local refresh.
To recover LOC, inspect **Update LOC Count**, restore the existing `LOC_COUNTER_PAT` if expired,
then run that workflow. To recover the animation, run **Contribution Snake**. If a schedule has
been disabled for repository inactivity, re-enable it in Actions and run it manually.

References: [GitHub contribution rules](https://docs.github.com/en/account-and-profile/reference/profile-contributions-reference),
[GraphQL calendar schema](https://docs.github.com/en/graphql/reference/users#contributioncalendar),
[scheduled workflow limitations](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
