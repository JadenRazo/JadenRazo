from copy import deepcopy
from datetime import date, datetime, timedelta, timezone
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
from xml.etree import ElementTree

import profile_stats as stats
from profile_health import require_recent


def snapshot(counts, start="2026-09-20"):
    begin = date.fromisoformat(start)
    end = begin + timedelta(days=len(counts) - 1)
    return {
        "schema_version": 1, "login": "JadenRazo", "generated_at": f"{end}T12:00:00Z",
        "calendar_start": start, "calendar_end": str(end),
        "days": [{"date": str(begin + timedelta(days=i)), "count": n} for i, n in enumerate(counts)],
        "public_repositories": 2, "stars": 3, "language_bytes": {"Python": 100, "Go": 300},
    }


class StreakTests(unittest.TestCase):
    def test_today_and_yesterday_are_one_current_streak(self):
        result = stats.metrics(snapshot([0, 0, 0, 6, 10]))
        self.assertEqual(result["total"], 16)
        self.assertEqual(result["current"], {"days": 2, "start": "2026-09-23", "end": "2026-09-24"})

    def test_unfinished_today_preserves_yesterday(self):
        self.assertEqual(stats.metrics(snapshot([3, 1, 0]))["current"]["days"], 2)

    def test_full_missed_day_resets_current_but_not_longest(self):
        result = stats.metrics(snapshot([3, 1, 0, 0]))
        self.assertEqual(result["current"]["days"], 0)
        self.assertEqual(result["longest"]["days"], 2)

    def test_no_activity(self):
        result = stats.metrics(snapshot([0]))
        self.assertEqual((result["current"]["days"], result["longest"]["days"]), (0, 0))

    def test_year_boundary_and_equal_longest_uses_earliest(self):
        result = stats.metrics(snapshot([1, 2, 3, 0, 1, 1, 1], "2025-12-30"))
        self.assertEqual(result["current"]["days"], 3)
        self.assertEqual(result["longest"]["start"], "2025-12-30")
        self.assertEqual(result["longest"]["end"], "2026-01-01")

    def test_leap_day_and_exact_365_day_window(self):
        result = stats.metrics(snapshot([1] * 366, "2024-01-01"))
        self.assertEqual(result["longest"]["days"], 366)
        self.assertEqual(result["recent"], 365)
        self.assertEqual(result["recent_start"], "2024-01-02")


class ValidationTests(unittest.TestCase):
    def setUp(self):
        self.data = snapshot([1, 2, 0, 1, 3])
        self.now = datetime(2026, 9, 24, 13, tzinfo=timezone.utc)

    def test_missing_duplicate_future_and_invalid_days(self):
        for mutate in (
            lambda d: d["days"].pop(),
            lambda d: d["days"][1].update(date=d["days"][0]["date"]),
            lambda d: d["days"][-1].update(date="2026-09-25"),
            lambda d: d["days"][0].update(count=-1),
            lambda d: d["days"][0].update(count=True),
            lambda d: d.update(calendar_end="2026-09-23"),
        ):
            with self.subTest(mutate=mutate):
                data = deepcopy(self.data)
                mutate(data)
                with self.assertRaises(ValueError):
                    stats.validate_snapshot(data, self.now)

    def test_stale_and_future_snapshot(self):
        for now in (self.now + timedelta(days=2), self.now - timedelta(days=1)):
            with self.assertRaises(ValueError):
                stats.validate_snapshot(self.data, now)

    def test_all_themes_and_cache_versions_match_data(self):
        self.data["language_bytes"]["A&B <language>"] = 50
        cards = stats.render_cards(self.data)
        self.assertEqual(len(cards), 6)
        for card in cards.values():
            ElementTree.fromstring(card)
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "generated").mkdir()
            for name, card in cards.items():
                (root / "generated" / name).write_text(card)
            (root / "generated/profile-stats.json").write_text(json.dumps(self.data))
            block = stats.stats_block(self.data, cards)
            self.assertIn('https://github.com/JadenRazo/JadenRazo/actions/workflows/profile-stats.yml/badge.svg', block)
            self.assertNotIn('https://github.com/JadenRazo/actions/', block)
            (root / "README.md").write_text("before\n" + block + "\nafter")
            stats.check(root, self.now)
            # A readable SVG with stale values must fail, not just pass XML validation.
            (root / "generated/streak-light.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg"/>')
            with self.assertRaises(ValueError):
                stats.check(root, self.now)
            (root / "generated/streak-light.svg").write_text(cards["streak-light.svg"])
            (root / "README.md").write_text(block.replace("?v=", "?old="))
            with self.assertRaises(ValueError):
                stats.check(root, self.now)

    def test_bad_readme_markers_fail_without_overwriting_other_content(self):
        for text in ("no markers", stats.START + stats.START + stats.END, stats.END + stats.START):
            with self.assertRaises(ValueError):
                stats.replace_block(text, "new")
        self.assertEqual(stats.replace_block("a" + stats.START + stats.END + "z", "new"), "anewz")

    def test_health_rejects_stale_loc_or_snake(self):
        require_recent("LOC", "2026-09-24T12:00:00Z", self.now, 72)
        with self.assertRaises(ValueError):
            require_recent("LOC", "2026-08-30T12:00:00Z", self.now, 72)


class FetchTests(unittest.TestCase):
    def api(self, query, **variables):
        if "createdAt" in query:
            return {"user": {"login": "JadenRazo", "createdAt": "2025-12-31T23:00:00Z"}}
        if "contributionsCollection" in query:
            start = date.fromisoformat(variables["from"][:10])
            end = date.fromisoformat(variables["to"][:10])
            days = [{"date": str(start + timedelta(days=i)), "contributionCount": 1}
                    for i in range((end - start).days + 1)]
            return {"user": {"contributionsCollection": {"contributionCalendar": {
                "totalContributions": len(days), "weeks": [{"contributionDays": days}],
            }}}}
        next_page = variables["after"] is None
        return {"user": {"repositories": {
            "totalCount": 2, "pageInfo": {"hasNextPage": next_page, "endCursor": "next"},
            "nodes": [{"stargazerCount": 1, "languages": {
                "totalSize": 50, "pageInfo": {"hasNextPage": False},
                "edges": [{"size": 50, "node": {"name": "Python"}}],
            }}],
        }}}

    def test_pagination_and_all_years(self):
        data = stats.fetch_snapshot(datetime(2026, 1, 2, tzinfo=timezone.utc), self.api)
        self.assertEqual(stats.metrics(data)["current"]["days"], 3)
        self.assertEqual(data["public_repositories"], 2)
        self.assertEqual(data["language_bytes"], {"Python": 100})

    def test_partial_calendar_and_truncated_languages_fail(self):
        for failure in ("calendar", "languages", "inventory", "cursor"):
            def broken(query, **variables):
                data = self.api(query, **variables)
                if failure == "calendar" and "contributionsCollection" in query:
                    data["user"]["contributionsCollection"]["contributionCalendar"]["totalContributions"] += 1
                if "repositories" in query:
                    repos = data["user"]["repositories"]
                    if failure == "languages":
                        repos["nodes"][0]["languages"]["pageInfo"]["hasNextPage"] = True
                    if failure == "inventory":
                        repos["totalCount"] = 3
                    if failure == "cursor":
                        repos["pageInfo"]["hasNextPage"] = True
                return data
            with self.subTest(failure=failure), self.assertRaises(ValueError):
                stats.fetch_snapshot(datetime(2026, 1, 2, tzinfo=timezone.utc), broken)

    def test_graphql_errors_with_http_success_are_rejected(self):
        with patch.object(stats.subprocess, "run") as run:
            run.return_value.returncode = 0
            run.return_value.stdout = json.dumps({"data": {"user": None}, "errors": [{"message": "no access"}]})
            with self.assertRaises(ValueError):
                stats.graphql("query{}")


if __name__ == "__main__":
    unittest.main()
