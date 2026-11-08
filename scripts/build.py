#!/usr/bin/env python3
"""Validate and package exactly the Chrome extension directory."""
import json, pathlib, zipfile, sys
root = pathlib.Path(__file__).resolve().parent.parent
ext = root / 'extension'
manifest = json.loads((ext / 'manifest.json').read_text(encoding='utf-8'))
assert manifest['manifest_version'] == 3
assert manifest['content_scripts'][0]['world'] == 'MAIN'
assert manifest['content_scripts'][0]['run_at'] == 'document_start'
for script in manifest['content_scripts']:
    for path in script.get('js', []): assert (ext / path).is_file(), path
for path in manifest.get('icons', {}).values(): assert (ext / path).is_file(), path
version = manifest['version']; assert version and all(x.isdigit() for x in version.split('.'))
out = root / 'dist' / f'etax-dojo-locale-fix-v{version}.zip'; out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(ext.rglob('*')):
        if f.is_file(): z.write(f, f.relative_to(ext).as_posix())
with zipfile.ZipFile(out) as z: assert 'manifest.json' in z.namelist()
print(out)
