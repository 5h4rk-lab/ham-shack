#!/usr/bin/env python3
"""Find and download freely-licensed images from Wikimedia Commons (public domain / CC0 / CC BY / CC BY-SA)
and record author + license for the site's credits page.

  python3 scripts/fetch_images.py search "yagi antenna"        # list candidates (no download)
  python3 scripts/fetch_images.py get key "File:Some_name.jpg" # download one by exact title
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "site" / "public" / "img"
CREDITS = ROOT / "data" / "image-credits.json"
API = "https://commons.wikimedia.org/w/api.php"
UA = "ham-shack-study-site/1.0 (private learning project; contact via github.com/5h4rk-lab)"
OK = re.compile(r"^(public domain|cc0|cc[ -]by(?:[ -]sa)?\b|pd\b|attribution|gfdl 1\.[23]? ?\(?.*cc)", re.I)
BAD = re.compile(r"\bnc\b|\bnd\b|non-?commercial|no derivatives|fair use|copyrighted", re.I)


def call(params, tries=5):
    url = API + "?" + urllib.parse.urlencode({**params, "format": "json", "formatversion": 2})
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            return json.load(urllib.request.urlopen(req, timeout=30))
        except Exception as e:  # 429s and transient errors
            time.sleep(3 * (i + 1))
    raise SystemExit("API failed: " + url)


def info(titles):
    d = call({"action": "query", "titles": "|".join(titles), "prop": "imageinfo",
              "iiprop": "url|size|mime|extmetadata", "iiurlwidth": 900})
    out = []
    for p in d["query"]["pages"]:
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        m = ii.get("extmetadata", {})
        lic = (m.get("LicenseShortName", {}) or {}).get("value", "")
        author = re.sub(r"<[^>]+>", "", (m.get("Artist", {}) or {}).get("value", "")).strip()
        out.append(dict(title=p["title"], license=lic, author=author, width=ii["width"], height=ii["height"],
                        mime=ii["mime"], thumb=ii.get("thumburl") or ii["url"], page=ii["descriptionurl"],
                        free=bool(OK.search(lic)) and not BAD.search(lic)))
    return out


def search(q, n=6):
    d = call({"action": "query", "list": "search", "srsearch": q + " filetype:bitmap", "srnamespace": 6, "srlimit": n})
    titles = [h["title"] for h in d["query"]["search"]]
    time.sleep(1)
    return info(titles) if titles else []


def get(key, title):
    (i,) = info([title])
    if not i["free"]:
        raise SystemExit(f"license not allowed: {i['license']}")
    ext = ".png" if "png" in i["mime"] else ".jpg"
    OUT.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(i["thumb"], headers={"User-Agent": UA})
    for t in range(5):
        try:
            (OUT / f"{key}{ext}").write_bytes(urllib.request.urlopen(req, timeout=60).read())
            break
        except Exception:
            time.sleep(4 * (t + 1))
    else:
        raise SystemExit("download failed")
    cr = json.loads(CREDITS.read_text()) if CREDITS.exists() else {}
    cr[key] = dict(file=f"img/{key}{ext}", title=i["title"], author=i["author"], license=i["license"], source=i["page"])
    CREDITS.write_text(json.dumps(dict(sorted(cr.items())), indent=1, ensure_ascii=False))
    print("saved", key, i["license"], "|", i["author"][:50])


if __name__ == "__main__":
    if sys.argv[1] == "search":
        for r in search(sys.argv[2]):
            print(("OK  " if r["free"] else "NO  ") + r["title"], "|", r["license"], f'{r["width"]}x{r["height"]}')
    else:
        get(sys.argv[2], sys.argv[3])
