#!/usr/bin/env python3
"""
Convert PDF files to Markdown and place them in src/api/data/.
Uses multiprocessing for parallel conversion.

Usage:
    python scripts/convert_pdfs_to_md.py <input_dir> <output_dir> [--exclude-pattern PATTERN] [--workers N]

Example:
    python scripts/convert_pdfs_to_md.py \
        /Users/oabouhajar/projects/simsar-ai/docs \
        src/api/data \
        --exclude-pattern "original" --exclude-pattern "schools copy" --exclude-pattern "big" \
        --workers 6
"""

import argparse
import multiprocessing as mp
import os
import sys
import time
from pathlib import Path


def find_pdfs(input_dir: str, exclude_patterns: list[str] | None = None) -> list[Path]:
    """Find all PDF files, optionally excluding paths matching any of the patterns."""
    pdf_files = []
    for root, _dirs, files in os.walk(input_dir):
        skip = False
        if exclude_patterns:
            for pat in exclude_patterns:
                if pat.strip("*/") in root:
                    skip = True
                    break
        if skip:
            continue
        for f in files:
            if f.lower().endswith(".pdf"):
                pdf_files.append(Path(root) / f)
    return sorted(pdf_files)


def _convert_one(args: tuple) -> tuple[str, bool, str]:
    """Worker function: convert a single PDF to markdown. Returns (md_name, success, message)."""
    pdf_path_str, input_dir_str, output_dir_str = args
    pdf_path = Path(pdf_path_str)
    input_dir = Path(input_dir_str)
    output_dir = Path(output_dir_str)

    rel = pdf_path.relative_to(input_dir)
    md_name = str(rel).replace(os.sep, "_").replace(".pdf", ".md").replace(".PDF", ".md")
    md_path = output_dir / md_name

    # Skip already-converted files
    if md_path.exists() and md_path.stat().st_size > 0:
        return (md_name, True, "skipped (exists)")

    try:
        import pymupdf4llm
        md_text = pymupdf4llm.to_markdown(str(pdf_path))
        if not md_text or not md_text.strip():
            return (md_name, False, "empty output")
        md_path.write_text(md_text, encoding="utf-8")
        return (md_name, True, "ok")
    except Exception as e:
        return (md_name, False, str(e))


def main():
    parser = argparse.ArgumentParser(description="Convert PDFs to Markdown (parallel)")
    parser.add_argument("input_dir", help="Root directory containing PDFs")
    parser.add_argument("output_dir", help="Output directory for .md files")
    parser.add_argument(
        "--exclude-pattern",
        action="append",
        default=None,
        help="Exclude paths containing this substring (can be specified multiple times)",
    )
    parser.add_argument(
        "--max-size-mb",
        type=float,
        default=100,
        help="Skip PDFs larger than this size in MB (default: 100)",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=max(1, mp.cpu_count() - 2),
        help=f"Number of parallel workers (default: {max(1, mp.cpu_count() - 2)})",
    )
    args = parser.parse_args()

    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    pdfs = find_pdfs(str(input_dir), args.exclude_pattern)
    total_found = len(pdfs)
    print(f"Found {total_found} PDF files (excluding: {args.exclude_pattern})")

    # Filter by max size
    max_bytes = int(args.max_size_mb * 1024 * 1024)
    oversized = [p for p in pdfs if p.stat().st_size > max_bytes]
    if oversized:
        print(f"Skipping {len(oversized)} files larger than {args.max_size_mb}MB")
        pdfs = [p for p in pdfs if p.stat().st_size <= max_bytes]

    total = len(pdfs)
    if total == 0:
        print("No PDFs to convert. Exiting.")
        sys.exit(0)

    print(f"Converting {total} PDFs with {args.workers} parallel workers...")

    # Build work items as plain strings (must be picklable for multiprocessing)
    work = [(str(p), str(input_dir), str(output_dir)) for p in pdfs]

    start = time.time()
    success = 0
    failed = 0
    done = 0

    with mp.Pool(processes=args.workers) as pool:
        for md_name, ok, msg in pool.imap_unordered(_convert_one, work):
            done += 1
            if ok:
                success += 1
            else:
                failed += 1
                print(f"  FAIL [{done}/{total}]: {md_name} -> {msg}", flush=True)

            if done % 10 == 0 or done == total:
                elapsed = time.time() - start
                rate = done / elapsed if elapsed > 0 else 0
                eta = (total - done) / rate if rate > 0 else 0
                print(
                    f"  Progress: {done}/{total} ({success} ok, {failed} fail) "
                    f"| {rate:.1f} files/s | ETA: {eta/60:.1f}min",
                    flush=True,
                )

    elapsed = time.time() - start
    print(f"\nDone in {elapsed/60:.1f}min. Success: {success}, Failed: {failed}, Total: {total}")


if __name__ == "__main__":
    main()
