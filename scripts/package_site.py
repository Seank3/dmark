"""Package the deployable build, source, and standalone offline preview."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

root = Path(__file__).resolve().parents[1]
archive = root.parent / "dmark-website.zip"
preview = root.parent / "dmark-preview.html"
include_dirs = ("dist", "public", "scripts", "source-media", "src", "tests")
include_files = (".gitignore", "README.md", "index.html", "package.json", "package-lock.json", "netlify.toml", "vercel.json", "vite.config.js")

with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=6) as output:
    for directory in include_dirs:
        for path in sorted((root / directory).rglob("*")):
            if path.is_file() and "__pycache__" not in path.parts:
                output.write(path, Path("dmark-site") / path.relative_to(root))
    for filename in include_files:
        output.write(root / filename, Path("dmark-site") / filename)
    output.write(preview, "dmark-preview.html")

print(f"Wrote {archive} ({archive.stat().st_size / 1024 / 1024:.2f} MiB)")
