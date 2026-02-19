#!/usr/bin/env python3
"""Updates the deploy monitor section in README.md with live site status."""

import json
import os
import re
from datetime import datetime

START_MARKER = "<!-- DEPLOY_MONITOR_START -->"
END_MARKER = "<!-- DEPLOY_MONITOR_END -->"


def format_status(sites: list) -> str:
    if not sites:
        return "```\n$ ezweb status\n  No sites reporting.\n```"

    lines = ["```"]
    lines.append("$ ezweb status")
    lines.append(
        f"{'SITE':<30} {'STATE':<10} {'HTTP':<6} {'LATENCY':<10} {'CONTAINER':<12}"
    )
    lines.append("-" * 70)

    for s in sites:
        domain = s.get("domain", "unknown")[:28]
        status = s.get("status", "—")
        http_code = s.get("http_status", 0)
        http_str = str(http_code) if http_code else "—"
        latency = s.get("latency_ms", 0)
        latency_str = f"{latency}ms" if latency else "—"
        container = s.get("container_status", "—") or "—"

        lines.append(
            f"{domain:<30} {status:<10} {http_str:<6} {latency_str:<10} {container:<12}"
        )

    checked = sites[0].get("checked_at", "") if sites else ""
    if checked:
        lines.append("")
        lines.append(f"Last check: {checked}")

    lines.append("```")
    return "\n".join(lines)


def main():
    raw = os.environ.get("STATUS_JSON", "[]")
    try:
        sites = json.loads(raw)
    except json.JSONDecodeError:
        sites = []

    status_block = format_status(sites)

    with open("README.md", "r") as f:
        readme = f.read()

    if START_MARKER not in readme:
        print("ERROR: Deploy monitor markers not found in README.md")
        return

    pattern = rf"({re.escape(START_MARKER)}).*?({re.escape(END_MARKER)})"
    replacement = f"{START_MARKER}\n{status_block}\n{END_MARKER}"
    readme = re.sub(pattern, replacement, readme, flags=re.DOTALL)

    with open("README.md", "w") as f:
        f.write(readme)

    print(f"Updated deploy monitor with {len(sites)} site(s)")


if __name__ == "__main__":
    main()
