"""Generate auditable profile cards from GitHub, using only the Python stdlib."""

import argparse
from collections import Counter
from datetime import date, datetime, timedelta, timezone
from hashlib import sha256
from html import escape
import json
from pathlib import Path
import re
import subprocess
import time

ROOT = Path(__file__).resolve().parents[2]
START = "<!-- STATS_START -->"
END = "<!-- STATS_END -->"
PROFILE = "https://github.com/JadenRazo"
REPO = f"{PROFILE}/JadenRazo"
RAW = "https://raw.githubusercontent.com/JadenRazo/JadenRazo/main/generated"


def graphql(query, **variables):
    """gh supplies credentials without putting tokens in arguments or logs."""
    payload = json.dumps({"query": query, "variables": variables})
    for attempt in range(3):
        result = subprocess.run(
            ["gh", "api", "graphql", "--input", "-"], input=payload,
            text=True, capture_output=True, timeout=60,
        )
        if result.returncode == 0:
            response = json.loads(result.stdout)
            if response.get("errors") or not response.get("data"):
                raise ValueError("GitHub returned incomplete GraphQL data")
            return response["data"]
        if attempt < 2:
            time.sleep(2 ** attempt)
    raise RuntimeError("GitHub query failed after 3 attempts; existing stats retained")


def validate_days(days, start, end):
    expected = (end - start).days + 1
    if len(days) != expected:
        raise ValueError("Contribution calendar is incomplete")
    for offset, item in enumerate(days):
        if item["date"] != (start + timedelta(days=offset)).isoformat():
            raise ValueError("Contribution calendar has missing, duplicate or unordered dates")
        if type(item["count"]) is not int or item["count"] < 0:
            raise ValueError("Invalid daily contribution count")


def fetch_snapshot(now, api=graphql):
    today = now.date()
    user = api('query($login:String!){user(login:$login){login createdAt}}',
               login="JadenRazo")["user"]
    if not user or user["login"].lower() != "jadenrazo":
        raise ValueError("Wrong GitHub account")
    created = date.fromisoformat(user["createdAt"][:10])
    days = []
    # Fetch every year, including inactive years, so streaks cross year boundaries.
    for year in range(created.year, today.year + 1):
        start = max(created, date(year, 1, 1))
        end = min(today, date(year, 12, 31))
        collection = api('''query($login:String!,$from:DateTime!,$to:DateTime!){
          user(login:$login){contributionsCollection(from:$from,to:$to){
            contributionCalendar{totalContributions weeks{contributionDays{
              date contributionCount
            }}}
          }}
        }''', login=user["login"], **{
            "from": f"{start}T00:00:00Z", "to": f"{end}T23:59:59Z",
        })["user"]["contributionsCollection"]["contributionCalendar"]
        year_days = [{"date": d["date"], "count": d["contributionCount"]}
                     for week in collection["weeks"] for d in week["contributionDays"]]
        validate_days(year_days, start, end)
        if sum(d["count"] for d in year_days) != collection["totalContributions"]:
            raise ValueError("Calendar total does not match its daily counts")
        days.extend(year_days)

    cursor = None
    cursors = set()
    repository_count = 0
    expected_count = None
    stars = 0
    languages = Counter()
    while True:
        repos = api('''query($login:String!,$after:String){user(login:$login){
          repositories(first:100,after:$after,privacy:PUBLIC,ownerAffiliations:OWNER,isFork:false){
            totalCount pageInfo{hasNextPage endCursor} nodes{
              stargazerCount languages(first:100){totalSize pageInfo{hasNextPage}
                edges{size node{name}}
              }
            }
          }
        }}''', login=user["login"], after=cursor)["user"]["repositories"]
        if expected_count is None:
            expected_count = repos["totalCount"]
        if expected_count != repos["totalCount"]:
            raise ValueError("Repository inventory changed during pagination; retry later")
        for repo in repos["nodes"]:
            repository_count += 1
            stars += repo["stargazerCount"]
            breakdown = repo["languages"]
            if breakdown["pageInfo"]["hasNextPage"]:
                raise ValueError("Incomplete repository language breakdown")
            if sum(edge["size"] for edge in breakdown["edges"]) != breakdown["totalSize"]:
                raise ValueError("Language bytes do not match repository total")
            for edge in breakdown["edges"]:
                if type(edge["size"]) is not int or edge["size"] < 0:
                    raise ValueError("Invalid language byte count")
                languages[edge["node"]["name"]] += edge["size"]
        if not repos["pageInfo"]["hasNextPage"]:
            break
        cursor = repos["pageInfo"]["endCursor"]
        if not cursor or cursor in cursors:
            raise ValueError("Repository pagination did not advance")
        cursors.add(cursor)
    if repository_count != expected_count:
        raise ValueError("Repository inventory is incomplete")
    snapshot = {
        "schema_version": 1, "login": user["login"],
        "generated_at": now.isoformat(timespec="seconds").replace("+00:00", "Z"),
        "calendar_start": created.isoformat(), "calendar_end": today.isoformat(),
        "source": "GitHub GraphQL contributionCalendar; public owned non-fork repositories",
        "days": days, "public_repositories": repository_count, "stars": stars,
        "language_bytes": dict(sorted(languages.items())),
    }
    validate_snapshot(snapshot, now)
    return snapshot


def validate_snapshot(snapshot, now, max_age_hours=36):
    if snapshot["schema_version"] != 1 or snapshot["login"] != "JadenRazo":
        raise ValueError("Unexpected profile snapshot schema or account")
    generated = datetime.fromisoformat(snapshot["generated_at"].replace("Z", "+00:00"))
    age = (now - generated).total_seconds()
    if age < -300 or age > max_age_hours * 3600:
        raise ValueError("Profile stats are stale or dated in the future")
    start, end = (date.fromisoformat(snapshot[key]) for key in ("calendar_start", "calendar_end"))
    if end != generated.date() or start > end:
        raise ValueError("Calendar does not cover the snapshot date")
    validate_days(snapshot["days"], start, end)
    for count in [snapshot["public_repositories"], snapshot["stars"], *snapshot["language_bytes"].values()]:
        if type(count) is not int or count < 0:
            raise ValueError("Invalid profile statistic")


def metrics(snapshot):
    days = snapshot["days"]
    runs = []
    run = None
    for item in days:
        if item["count"]:
            if run is None:
                run = {"days": 0, "start": item["date"], "end": item["date"]}
            run["days"] += 1
            run["end"] = item["date"]
        elif run:
            runs.append(run)
            run = None
    if run:
        runs.append(run)
    empty = {"days": 0, "start": None, "end": None}
    longest = max(runs, key=lambda r: r["days"], default=empty)
    # Today is still in progress: yesterday's streak survives until UTC midnight.
    yesterday = (date.fromisoformat(snapshot["calendar_end"]) - timedelta(days=1)).isoformat()
    current = runs[-1] if runs and runs[-1]["end"] >= yesterday else empty
    since = (date.fromisoformat(snapshot["calendar_end"]) - timedelta(days=364)).isoformat()
    recent = [d for d in days if d["date"] >= since]
    return {
        "total": sum(d["count"] for d in days), "current": current, "longest": longest,
        "recent": sum(d["count"] for d in recent),
        "active_days": sum(d["count"] > 0 for d in recent), "recent_start": since,
    }


def text(x, y, value, size=14, color="text", anchor="start", weight=400):
    return (f'<text x="{x}" y="{y}" class="{color}" font-size="{size}" '
            f'text-anchor="{anchor}" font-weight="{weight}">{escape(str(value))}</text>')


def card(theme, title, description, body, updated, width=495, height=220):
    colors = ("#0d1117", "#30363d", "#e6edf3", "#919ba6", "#3fb950") if theme == "dark" else (
        "#ffffff", "#d1d9e0", "#1f2328", "#59636e", "#1a7f37")
    bg, border, fg, muted, accent = colors
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
            f'viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">'
            f'<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>'
            f'<style>text{{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif}}'
            f'.text{{fill:{fg}}}.muted{{fill:{muted}}}.accent{{fill:{accent}}}</style>'
            f'<rect x=".5" y=".5" width="{width-1}" height="{height-1}" rx="8" '
            f'fill="{bg}" stroke="{border}"/>'
            + text(20, 30, title, 17, "accent", weight=600) + body
            + text(20, height - 14, f"Updated {updated} UTC", 11, "muted") + '</svg>\n')


def date_range(run):
    return f'{run["start"]} – {run["end"]}' if run["days"] else "No active streak"


def render_cards(snapshot):
    m = metrics(snapshot)
    updated = snapshot["generated_at"][:16].replace("T", " ")
    cards = {}
    for theme in ("dark", "light"):
        rows = [
            ("Contributions · last 365 days", f'{m["recent"]:,}'),
            ("Active days · last 365 days", f'{m["active_days"]:,}'),
            ("Public source repositories", snapshot["public_repositories"]),
            ("Stars on public source repositories", snapshot["stars"]),
        ]
        body = text(20, 52, f'{m["recent_start"]} – {snapshot["calendar_end"]}', 11, "muted")
        for i, (label, value) in enumerate(rows):
            y = 83 + i * 29
            body += text(20, y, label) + text(475, y, value, anchor="end", weight=600)
        cards[f"stats-{theme}.svg"] = card(theme, "GitHub activity", str(rows), body, updated)

        columns = [
            (f'{m["total"]:,}', "Total contributions", f'Since {snapshot["calendar_start"]}'),
            (m["current"]["days"], "Current streak · days", date_range(m["current"])),
            (m["longest"]["days"], "Longest streak · days", date_range(m["longest"])),
        ]
        body = ""
        for i, (value, label, detail) in enumerate(columns):
            x = 115 + i * 230
            body += text(x, 91, value, 32, "accent", "middle", 700)
            body += text(x, 119, label, 14, anchor="middle", weight=600)
            body += text(x, 143, detail, 11, "muted", "middle")
        body += text(20, 181, f'Through {snapshot["calendar_end"]} · GitHub calendar dates · UTC cutoff', 12, "muted")
        cards[f"streak-{theme}.svg"] = card(
            theme, "Contribution streaks", str(columns), body, updated, width=690)

        languages = sorted(snapshot["language_bytes"].items(), key=lambda item: (-item[1], item[0]))
        total = sum(value for _, value in languages)
        shown = languages[:6]
        if len(languages) > 6:
            shown.append(("Other", sum(value for _, value in languages[6:])))
        body = text(20, 52, 'Public source repositories · share of detected bytes', 11, "muted")
        for i, (name, value) in enumerate(shown):
            body += text(20, 75 + i * 17, name, 12)
            body += text(475, 75 + i * 17, f'{value / total:.1%}' if total else "0.0%",
                         12, anchor="end")
        if not shown:
            body += text(20, 95, "No language data", 14, "muted")
        cards[f"top-langs-{theme}.svg"] = card(
            theme, "Repository languages", str(shown), body, updated)
    return cards


def stats_block(snapshot, cards):
    m = metrics(snapshot)
    updated = snapshot["generated_at"].replace("T", " ").replace("Z", " UTC")
    lines = [START, f'*Last successful refresh: **{updated}**. Scheduled every six hours.*', '',
             f'[![Stats refresh]({REPO}/actions/workflows/profile-stats.yml/badge.svg)]({REPO}/actions/workflows/profile-stats.yml)',
             f'[![Freshness checks]({REPO}/actions/workflows/profile-health.yml/badge.svg)]({REPO}/actions/workflows/profile-health.yml)', '',
             f'**{m["total"]:,} contributions since {snapshot["calendar_start"]}** · '
             f'**{m["current"]["days"]} day current streak** · **{m["longest"]["days"]} day longest streak**', '']
    for kind, alt in [("stats", "GitHub activity with explicit date ranges"),
                      ("top-langs", "Languages by bytes in public source repositories"),
                      ("streak", "Total contributions, current streak, and longest streak")]:
        def url(theme):
            name = f"{kind}-{theme}.svg"
            return f'{RAW}/{name}?v={sha256(cards[name].encode()).hexdigest()[:16]}'
        lines.extend(['<picture>',
                      f'  <source media="(prefers-color-scheme: dark)" srcset="{url("dark")}">',
                      f'  <source media="(prefers-color-scheme: light)" srcset="{url("light")}">',
                      f'  <img alt="{alt}" src="{url("light")}" width="{690 if kind == "streak" else 400}">',
                      '</picture>'])
    lines.extend(['', 'Counts follow GitHub’s contribution calendar; private contributions follow profile visibility.',
                  'Streaks use GitHub calendar dates and a UTC cutoff, with today allowed to be unfinished. Language shares measure',
                  'repository bytes, not authored lines or proficiency; forks are excluded and archived sources are included.',
                  f'[Live contribution calendar]({PROFILE}?tab=overview) · [Data and definitions](.github/STATS.md)', END])
    return '\n'.join(lines)


def replace_block(readme, block):
    if readme.count(START) != 1 or readme.count(END) != 1:
        raise ValueError("Expected exactly one stats block in README.md")
    result, count = re.subn(re.escape(START) + r'.*?' + re.escape(END), lambda _: block, readme, flags=re.S)
    if count != 1:
        raise ValueError("Stats markers are out of order")
    return result


def check(root, now):
    snapshot = json.loads((root / "generated/profile-stats.json").read_text())
    validate_snapshot(snapshot, now)
    cards = render_cards(snapshot)
    for name, content in cards.items():
        if (root / "generated" / name).read_text() != content:
            raise ValueError(f"{name} does not match the contribution snapshot")
    readme = (root / "README.md").read_text()
    if replace_block(readme, stats_block(snapshot, cards)) != readme:
        raise ValueError("README numbers, timestamp or image versions do not match the snapshot")
    print(f'Validated six cards and README against snapshot {snapshot["generated_at"]}')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    now = datetime.now(timezone.utc)
    if args.check:
        check(ROOT, now)
        return
    snapshot = fetch_snapshot(now)
    cards = render_cards(snapshot)
    # Complete all fetches, validation and rendering before touching published files.
    readme = replace_block((ROOT / "README.md").read_text(), stats_block(snapshot, cards))
    for name, content in cards.items():
        (ROOT / "generated" / name).write_text(content)
    (ROOT / "generated/profile-stats.json").write_text(json.dumps(snapshot, indent=2) + '\n')
    (ROOT / "README.md").write_text(readme)
    check(ROOT, now)
    print(json.dumps(metrics(snapshot), indent=2))


if __name__ == "__main__":
    main()
