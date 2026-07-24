"""Generate one Japanese MP3 per beginner word.

Requires: python -m pip install edge-tts
"""

from __future__ import annotations

import asyncio
import csv
import re
from pathlib import Path

import edge_tts


ROOT = Path(__file__).resolve().parents[1]
WORDS_CSV = ROOT / "_data" / "words.csv"
OUTPUT_DIR = ROOT / "assets" / "audio" / "word-items"
VOICE = "ja-JP-NanamiNeural"
RATE = "-12%"
CONCURRENCY = 8


def load_jobs() -> list[tuple[str, Path]]:
    with WORDS_CSV.open(encoding="utf-8-sig", newline="") as source:
        rows = [
            {key: (value or "").strip() for key, value in row.items()}
            for row in csv.DictReader(source)
        ]

    jobs: list[tuple[str, Path]] = []
    for lesson_id in range(1, 49):
        lesson_key = str(lesson_id).zfill(3)
        lesson_words = [row for row in rows if lesson_key in row["lesson"]]
        for index, word in enumerate(lesson_words):
            reading = re.sub(r"@\d*", "", word["kana"]).strip()
            if reading:
                jobs.append(
                    (
                        reading,
                        OUTPUT_DIR / f"l{lesson_id}" / f"{index}.mp3",
                    )
                )
    return jobs


async def generate_one(
    reading: str,
    destination: Path,
    semaphore: asyncio.Semaphore,
) -> str:
    if destination.exists() and destination.stat().st_size > 1_000:
        return "skipped"

    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".mp3.part")

    async with semaphore:
        for attempt in range(4):
            try:
                communicate = edge_tts.Communicate(
                    reading,
                    VOICE,
                    rate=RATE,
                )
                await communicate.save(temporary)
                if temporary.stat().st_size <= 1_000:
                    raise RuntimeError("generated audio was unexpectedly small")
                temporary.replace(destination)
                return "generated"
            except Exception:
                temporary.unlink(missing_ok=True)
                if attempt == 3:
                    raise
                await asyncio.sleep(1.5 * (attempt + 1))
    return "generated"


async def main() -> None:
    jobs = load_jobs()
    semaphore = asyncio.Semaphore(CONCURRENCY)
    generated = 0
    skipped = 0

    tasks = [
        asyncio.create_task(generate_one(reading, destination, semaphore))
        for reading, destination in jobs
    ]
    for completed, task in enumerate(asyncio.as_completed(tasks), start=1):
        result = await task
        generated += result == "generated"
        skipped += result == "skipped"
        if completed % 100 == 0 or completed == len(tasks):
            print(
                f"{completed}/{len(tasks)} complete "
                f"({generated} generated, {skipped} skipped)",
                flush=True,
            )


if __name__ == "__main__":
    asyncio.run(main())
