import argparse
import hashlib
import json
import os
import re
import shutil
import tarfile
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

import yaml


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def validate_archive(archive, name, destination):
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        raise ValueError("Invalid skill name")
    if archive.stat().st_size > 20 * 1024 * 1024:
        raise ValueError("Archive exceeds 20 MiB")
    with tarfile.open(archive, "r:gz") as bundle:
        members = bundle.getmembers()
        if len(members) > 1000 or sum(m.size for m in members) > 25 * 1024 * 1024:
            raise ValueError("Archive exceeds entry or expanded size limits")
        names = set()
        for member in members:
            path = PurePosixPath(member.name)
            if path.is_absolute() or ".." in path.parts or "\\" in member.name:
                raise ValueError("Unsafe archive path")
            if not path.parts or len(path.parts) > 20 or any(len(p.encode()) > 200 for p in path.parts):
                raise ValueError("Invalid archive path")
            if not (member.isfile() or member.isdir()):
                raise ValueError("Links and special archive entries are forbidden")
            key = str(path).casefold()
            if key in names:
                raise ValueError("Duplicate archive path")
            names.add(key)
        files = [PurePosixPath(m.name) for m in members if m.isfile()]
        if PurePosixPath("SKILL.md") in files:
            prefix = ()
        elif PurePosixPath(name, "SKILL.md") in files and all(p.parts[0] == name for p in files):
            prefix = (name,)
        else:
            raise ValueError("Archive must contain one matching skill root")
        destination.mkdir()
        for member in members:
            parts = PurePosixPath(member.name).parts
            if prefix and parts[:1] != prefix:
                raise ValueError("Entry outside skill root")
            relative = parts[len(prefix):]
            if not relative:
                continue
            target = destination.joinpath(*relative)
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with bundle.extractfile(member) as source, target.open("wb") as output:
                    shutil.copyfileobj(source, output)
                target.chmod(0o755 if member.mode & 0o111 else 0o644)
    source_hashes = {str(p.relative_to(destination)): digest(p) for p in sorted(destination.rglob("*")) if p.is_file()}
    for archive_path in list(destination.rglob("*.zip")):
        with zipfile.ZipFile(archive_path) as nested:
            entries = nested.infolist()
            if len(entries) > 1000 or sum(e.file_size for e in entries) > 25 * 1024 * 1024:
                raise ValueError("Supporting ZIP exceeds size limits")
            seen = set()
            for entry in entries:
                path = PurePosixPath(entry.filename)
                mode = entry.external_attr >> 16
                if path.is_absolute() or ".." in path.parts or "\\" in entry.filename or not path.parts:
                    raise ValueError("Unsafe supporting ZIP path")
                if len(path.parts) > 20 or any(len(p.encode()) > 200 for p in path.parts):
                    raise ValueError("Invalid supporting ZIP path")
                if mode & 0o170000 not in (0, 0o100000, 0o040000):
                    raise ValueError("Links and special supporting ZIP entries are forbidden")
                if str(path).casefold() in seen:
                    raise ValueError("Duplicate supporting ZIP path")
                seen.add(str(path).casefold())
            for entry in entries:
                path = PurePosixPath(entry.filename)
                if path.parts[0] != "references":
                    raise ValueError("Supporting ZIP must contain only references")
                target = destination.joinpath(*path.parts)
                if entry.is_dir():
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    if target.exists():
                        raise ValueError("Supporting ZIP collides with source files")
                    target.parent.mkdir(parents=True, exist_ok=True)
                    with nested.open(entry) as source, target.open("wb") as output:
                        shutil.copyfileobj(source, output)
                    target.chmod(0o644)
    if sum(p.stat().st_size for p in destination.rglob("*") if p.is_file()) > 50 * 1024 * 1024:
        raise ValueError("Materialized skill exceeds 50 MiB")
    text = (destination / "SKILL.md").read_text()
    parts = text.split("---", 2)
    if len(parts) != 3 or parts[0].strip():
        raise ValueError("Missing YAML frontmatter")
    metadata = yaml.safe_load(parts[1])
    if metadata.get("name") != name or not isinstance(metadata.get("description"), str) or not metadata["description"].strip():
        raise ValueError("Invalid skill name or description")
    if not re.search(r"^# " + re.escape(name) + r"\s*$", parts[2], re.M):
        raise ValueError("Skill H1 does not match its name")
    for markdown in destination.rglob("*.md"):
        for link in re.findall(r"\]\(([^)]+)\)", markdown.read_text()):
            if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", link) or link.startswith("#"):
                continue
            path = (markdown.parent / link.split("#")[0]).resolve()
            if not path.is_relative_to(destination.resolve()) or not path.exists():
                raise ValueError(f"Missing or unsafe local reference in {markdown.relative_to(destination)}")
    installed_hashes = {str(p.relative_to(destination)): digest(p) for p in sorted(destination.rglob("*")) if p.is_file()}
    if len({p.casefold() for p in installed_hashes}) != len(installed_hashes):
        raise ValueError("Materialized files collide ignoring case")
    return source_hashes, installed_hashes


def no_symlink(path):
    for part in [path, *path.parents]:
        if part.is_symlink():
            raise ValueError("Symlink destination is forbidden")


def main():
    parser = argparse.ArgumentParser(description="Validate and install approved complete Notion skill archives")
    parser.add_argument("plan", type=Path)
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    work = Path.home() / ".skills/work/skill-sync"
    work.mkdir(parents=True, exist_ok=True)
    plan = json.loads(args.plan.read_text())
    excluded = set(plan.get("excluded", [])) | {"git"}
    rows = plan["skills"]
    if len({r["name"] for r in rows}) != len(rows) or not rows:
        raise ValueError("Duplicate or empty inventory")
    no_symlink(args.destination)
    no_symlink(args.manifest)
    if args.destination.resolve().is_relative_to(Path.home() / ".skills/system"):
        raise ValueError("System skills are not installation targets")
    previous = json.loads(args.manifest.read_text()) if args.manifest.exists() else {}
    records = {}
    with tempfile.TemporaryDirectory(prefix="stage-", dir=work) as temporary:
        stage = Path(temporary)
        for row in rows:
            name = row["name"]
            if name in excluded:
                raise ValueError("Excluded skill in installation plan")
            if not re.fullmatch(r"[0-9a-fA-F-]{32,36}", row["page_id"]) or not row["version_id"]:
                raise ValueError("Missing Notion source identity or version")
            archive = Path(row["archive"])
            source_files, files = validate_archive(archive, name, stage / name)
            records[name] = {"page_id": row["page_id"], "version_id": row["version_id"], "archive_sha256": digest(archive), "source_files_sha256": source_files, "files_sha256": files}
            no_symlink(args.destination / name)
            target = args.destination / name
            if name in previous.get("skills", {}) and target.exists():
                if any(p.is_symlink() for p in target.rglob("*")):
                    raise ValueError("Installed skill contains a symlink")
                actual = {str(p.relative_to(target)): digest(p) for p in sorted(target.rglob("*")) if p.is_file()}
                if actual != previous["skills"][name]["files_sha256"]:
                    raise ValueError(f"Unexpected local edits in {name}; preserve and resolve before refreshing")
        print(f"Validated {len(records)} complete skill archives ({sum(len(r['files_sha256']) for r in records.values())} files)")
        if not args.apply:
            return
        args.destination.mkdir(parents=True, exist_ok=True)
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        if args.destination.stat().st_dev != stage.stat().st_dev:
            raise ValueError("Staging and installations must share a filesystem")
        backup = Path(tempfile.mkdtemp(prefix="backup-", dir=work))
        installed = []
        moved = []
        try:
            for name in records:
                target = args.destination / name
                if target.exists():
                    target.rename(backup / name)
                    moved.append(name)
                (stage / name).rename(target)
                installed.append(name)
            for name, record in records.items():
                target = args.destination / name
                actual = {str(p.relative_to(target)): digest(p) for p in sorted(target.rglob("*")) if p.is_file()}
                if actual != record["files_sha256"]:
                    raise ValueError("Installed content differs from validated source")
            manifest = {"source": "Notion", "refreshed_at": datetime.now(timezone.utc).isoformat(), "destination": str(args.destination), "excluded": sorted(excluded), "skills": records}
            output = args.manifest.with_suffix(".pending.json")
            output.write_text(json.dumps(manifest, indent=2) + "\n")
            os.replace(output, args.manifest)
        except Exception:
            for name in reversed(installed):
                shutil.rmtree(args.destination / name)
            for name in moved:
                (backup / name).rename(args.destination / name)
            raise
        print(f"Installed and hash-verified {len(records)} skills; previous copies retained at {backup}")


if __name__ == "__main__":
    main()
