"""Create a network-independent, interactive preview from `npm run build`.

The file viewer runs HTML in a sandbox with no network access. This bundles the
production JS/CSS, fonts, and imagery into one HTML file so the visitor can
actually see and navigate the website in that viewer.
"""

import base64
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
OUT = ROOT.parent / "dmark-preview.html"


def data_uri(path: Path) -> str:
    media_type = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    if path.suffix == ".woff2":
        media_type = "font/woff2"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{media_type};base64,{encoded}"


html = (DIST / "index.html").read_text(encoding="utf-8")
css_path = next((DIST / "assets").glob("*.css"))
js_path = next((DIST / "assets").glob("*.js"))
css = css_path.read_text(encoding="utf-8")
js = js_path.read_text(encoding="utf-8")

css = re.sub(
    r"/fonts/([\w.-]+)",
    lambda match: data_uri(DIST / "fonts" / match.group(1)),
    css,
)
js = re.sub(
    r"/images/([\w.-]+)",
    lambda match: data_uri(DIST / "images" / match.group(1)),
    js,
)

# Prevent an embedded string from accidentally terminating the inline element.
js = re.sub(r"</script", r"<\\/script", js, flags=re.IGNORECASE)
css = re.sub(r"</style", r"<\\/style", css, flags=re.IGNORECASE)

html = re.sub(r"\s*<script[^>]*src=\"/assets/[^\"]+\"[^>]*></script>", "", html)
html = re.sub(r"\s*<link[^>]*href=\"/assets/[^\"]+\"[^>]*>", "", html)
html = re.sub(r"\s*<link[^>]*(?:rel=\"icon\"|rel=\"preload\")[^>]*>", "", html)
html = re.sub(r"\s*<meta property=\"og:image\"[^>]*>", "", html)
html = html.replace(
    "</head>",
    "<style>" + css + "</style>"
    + "<script>window.__DMARK_STANDALONE__ = true;</script>"
    + '<script type="module">' + js + "</script></head>",
)

OUT.write_text(html, encoding="utf-8")
print(f"Wrote {OUT} ({OUT.stat().st_size / 1024 / 1024:.2f} MiB)")
