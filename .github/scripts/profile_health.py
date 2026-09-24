"""Independently check freshness, even when a producer stops running."""

from datetime import datetime, timezone
import json
import re
import subprocess

from profile_stats import ROOT, check


def api(path):
    return json.loads(subprocess.check_output(
        ["gh", "api", f"repos/JadenRazo/JadenRazo/{path}"], text=True, timeout=60))


def require_recent(label, timestamp, now, hours):
    updated = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    age = (now - updated).total_seconds() / 3600
    if age < -5 / 60 or age > hours:
        raise ValueError(f"{label} is stale or future dated: {timestamp} (limit {hours}h)")
    print(f"{label}: {timestamp} ({age:.1f}h old)")


def main():
    now = datetime.now(timezone.utc)
    check(ROOT, now)
    for workflow in ("profile-stats.yml", "loc-counter.yml", "snake.yml"):
        if api(f"actions/workflows/{workflow}")["state"] != "active":
            raise ValueError(f"{workflow} is disabled")
    readme = (ROOT / "README.md").read_text()
    loc = re.search(r'<!-- LOC_UPDATED: ([\dT:Z-]+) -->', readme)
    if not loc:
        raise ValueError("LOC timestamp is missing")
    require_recent("LOC scan", loc[1], now, 72)
    # The output branch is written only after snake generation and validation.
    for name in ("github-snake.svg", "github-snake-dark.svg"):
        commits = api(f"commits?sha=output&path={name}&per_page=1")
        if not commits:
            raise ValueError(f"No published {name}")
        require_recent(name, commits[0]["commit"]["committer"]["date"], now, 36)


if __name__ == "__main__":
    main()
