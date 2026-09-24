"""Exercise the actual inline LOC publisher without cloning repositories."""

import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[2]


class LocTests(unittest.TestCase):
    def publish(self, total=10, language_code=10, marker=True):
        workflow = (ROOT / '.github/workflows/loc-counter.yml').read_text()
        step = workflow.split('      - name: Update README statistics\n', 1)[1]
        script = textwrap.dedent(step.split("python3 - <<'PY'\n", 1)[1].split('\n          PY', 1)[0])
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)
            original = ('before\n<!-- LOC_START -->\n**100** lines of code across **200** total lines '
                        'in **40** repositories\n<!-- LOC_END -->\nafter') if marker else 'before\nafter'
            (path / 'README.md').write_text(original)
            (path / 'loc-data.json').write_text(json.dumps({
                'header': {}, 'Python': {'code': language_code},
                'SUM': {'code': total, 'blank': 1, 'comment': 2},
            }))
            result = subprocess.run([sys.executable, '-c', script], cwd=directory,
                                    env={**os.environ, 'REPO_COUNT': '2'}, capture_output=True, text=True)
            return result, (path / 'README.md').read_text(), original

    def test_complete_scan_can_decrease_and_records_success_time(self):
        result, readme, _ = self.publish()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('**10** lines of code across **13** total lines in **2** repositories', readme)
        self.assertIn('<!-- LOC_UPDATED:', readme)
        self.assertTrue(readme.startswith('before\n') and readme.endswith('\nafter'))

    def test_invalid_or_partial_counts_leave_readme_untouched(self):
        for options in ({'total': 0}, {'language_code': 5}, {'marker': False}):
            with self.subTest(options=options):
                result, readme, original = self.publish(**options)
                self.assertNotEqual(result.returncode, 0)
                self.assertEqual(readme, original)


if __name__ == '__main__':
    unittest.main()
