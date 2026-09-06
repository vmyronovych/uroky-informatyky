#!/usr/bin/env python3
"""Збирає index.html із src/shell.html та даних у src/*.json.

    python3 src/build.py

Один самодостатній HTML-файл на виході — саме його роздає GitHub Pages.
"""
import json, re, pathlib

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
    dates = load("dates.json")

    k3 = [{"n": d["n"], "topic": d["topic"], "res": d["res"], "line": d["line"]} for d in ktp3]
    k4 = [{"n": d["n"],
           "topic": re.sub(r"\s+", " ", d["topic"]).strip(),
           "res": d["res"].strip().rstrip(".;"),
           "line": dedupe_line(d["line"])} for d in ktp4]

    data = {"dates": dates,
            "g3": {"ktp": k3, "plans": {str(p["n"]): p for p in p3}},
            "g4": {"ktp": k4, "plans": {str(p["n"]): p for p in p4}}}

    body = (SRC / "shell.html").read_text(encoding="utf-8")
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


if __name__ == "__main__":
    main()
