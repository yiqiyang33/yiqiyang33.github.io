#!/usr/bin/env python3
"""Generate the `email_scrambled` / `email_order` pair for _config.yml.

The site never ships the address in plain text. It stores a shuffled copy plus
the position each character belongs at; assets/js/email-scramble.js re-shuffles
on load and animates the characters back into order when a reader asks for it.

Usage:
    python3 tools/scramble_email.py you@example.edu
"""

import random
import re
import sys

# What a typical address harvester scans for.
HARVEST_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def scramble(email, attempts=1000):
    """Shuffle the address into a form no harvester regex will match."""
    pairs = list(enumerate(email))
    for _ in range(attempts):
        random.shuffle(pairs)
        candidate = "".join(char for _, char in pairs)
        # A match needs a dot somewhere after the "@"; deny it one.
        if candidate.index("@") < candidate.rindex("."):
            continue
        if HARVEST_RE.search(candidate) or candidate == email:
            continue
        return candidate, [position for position, _ in pairs]
    raise SystemExit("could not find a safe arrangement; try re-running")


def restore(scrambled, order):
    """Mirror of the browser animation, used here to prove the pair round-trips."""
    chars, order = list(scrambled), list(order)
    for _ in range(len(order)):
        swapped = False
        for i in range(len(order) - 1):
            if order[i] > order[i + 1]:
                order[i], order[i + 1] = order[i + 1], order[i]
                chars[i], chars[i + 1] = chars[i + 1], chars[i]
                swapped = True
        if not swapped:
            break
    return "".join(chars)


def main():
    if len(sys.argv) != 2 or "@" not in sys.argv[1] or "." not in sys.argv[1]:
        raise SystemExit("usage: python3 tools/scramble_email.py you@example.edu")

    email = sys.argv[1].strip()
    scrambled, order = scramble(email)

    if restore(scrambled, order) != email:
        raise SystemExit("round-trip failed; this is a bug, please re-run")

    print("Paste into _config.yml under `author:`\n")
    print('  email_scrambled: "%s"' % scrambled)
    print("  email_order: [%s]" % ", ".join(str(n) for n in order))


if __name__ == "__main__":
    main()
