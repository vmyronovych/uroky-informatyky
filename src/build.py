#!/usr/bin/env python3
"""Збирає index.html із src/shell.html та даних у src/*.json.

    python3 src/build.py

Один самодостатній HTML-файл на виході — саме його роздає GitHub Pages.
Схема «Windows на проєктор» лежить окремо в src/win/ і вшивається сюди ж.
"""
import json, re, pathlib
from datetime import date, timedelta

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'"
           "%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%93%9A%3C/text%3E%3C/svg%3E")

HEAD = """<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="description" content="КТП і конспекти уроків інформатики для 3 і 4 класів, 2026/2027">
<link rel="icon" href="%s">
<style>html,body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>
""" % FAVICON


def lesson_dates(cal):
    """Усі навчальні дні року, що припадають на день тижня уроку.

    Канікули й святкові дні з src/calendar.json відкидаються. Повертає більше
    днів, ніж уроків, — залишок це запас на перенесення.
    """
    def d(x):
        return date.fromisoformat(x)

    off = []
    for v in cal["vacations"]:
        off.append((d(v["from"]), d(v["to"])))
    for h in cal["holidays"]:
        off.append((d(h["date"]), d(h["date"])))

    days, x, end = [], d(cal["start"]), d(cal["end"])
    while x <= end:
        if x.isoweekday() == cal["weekday"] and not any(a <= x <= b for a, b in off):
            days.append(x.isoformat())
        x += timedelta(days=1)
    return days


def load(name):
    return json.loads((SRC / name).read_text(encoding="utf-8"))


def dedupe_line(s):
    parts = re.findall(r"«[^»]+»", s)
    if not parts:
        return s.strip()
    seen = []
    for p in parts:
        if p not in seen:
            seen.append(p)
    return " ".join(x.strip("«»") for x in seen)


def main():
    ktp3, ktp4 = load("ktp3.json"), load("ktp4.json")
    p3, p4 = load("plans3.json"), load("plans4.json")
    cal = load("calendar.json")

    days = lesson_dates(cal)
    n_lessons = cal["lessons"]
    if len(days) < n_lessons:
        raise SystemExit("src/calendar.json: навчальних днів %d, а уроків %d — "
                         "перевір канікули й свята" % (len(days), n_lessons))
    dates = days[:n_lessons]
    s2 = next(i for i, x in enumerate(dates, 1) if x >= cal["semester2from"])

    k3 = [{"n": d["n"], "topic": d["topic"], "res": d["res"], "line": d["line"]} for d in ktp3]
    k4 = [{"n": d["n"],
           "topic": re.sub(r"\s+", " ", d["topic"]).strip(),
           "res": d["res"].strip().rstrip(".;"),
           "line": dedupe_line(d["line"])} for d in ktp4]

    data = {"dates": dates, "s2": s2,
            "g3": {"ktp": k3, "plans": {str(p["n"]): p for p in p3}},
            "g4": {"ktp": k4, "plans": {str(p["n"]): p for p in p4}}}

    body = (SRC / "shell.html").read_text(encoding="utf-8")
    # схема «Windows на проєктор» — окремими файлами, бо вона завбільшки з решту сайту
    win = SRC / "win"
    for mark in ("/*__WIN_CSS__*/", "/*__WIN_JS__*/"):
        if mark not in body:
            raise SystemExit("src/shell.html: не знайдено плейсхолдер " + mark)
    body = body.replace("/*__WIN_CSS__*/", (win / "win.css").read_text(encoding="utf-8").rstrip())
    body = body.replace("/*__WIN_JS__*/", "\n\n".join(
        f.read_text(encoding="utf-8").rstrip() for f in sorted(win.glob("*.js"))))
    if "__DATA__" not in body:
        raise SystemExit("src/shell.html: не знайдено плейсхолдер __DATA__")
    body = body.replace("__DATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":")))

    doc = HEAD + body
    doc = doc.replace('\n<div class="wrap">', '\n</head>\n<body>\n<div class="wrap">', 1)
    doc = doc.rstrip() + "\n</body>\n</html>\n"

    out = ROOT / "index.html"
    out.write_text(doc, encoding="utf-8")
    print("index.html — %d КБ, уроків: 3 клас %d/%d конспектів, 4 клас %d/%d"
          % (len(doc.encode("utf-8")) // 1024, len(p3), len(k3), len(p4), len(k4)))
    print("І семестр %d (по %s), ІІ семестр %d (з %s), у запасі днів: %d"
          % (s2 - 1, dates[s2 - 2], n_lessons - s2 + 1, dates[s2 - 1],
             len(days) - n_lessons))


if __name__ == "__main__":
    main()
