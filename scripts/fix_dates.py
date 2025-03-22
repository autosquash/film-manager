import json
import os
from datetime import datetime

INPUT_FILE = "data/movies.json"
OUTPUT_DIR = "output"
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "movies_normalized.json")

# Accepts dates in these two formats
DATE_FORMATS = ["%d-%m-%y", "%Y-%m-%d"]
OUTPUT_FORMAT = "%Y-%m-%d"


def normalize_date(value: object) -> str | None:
    if value is None or value in ("", "unknown"):
        return None
    if isinstance(value, str):
        for fmt in DATE_FORMATS:
            try:
                return datetime.strptime(value, fmt).strftime(OUTPUT_FORMAT)
            except ValueError:
                continue
    raise ValueError(f"Formato de fecha no reconocido: {value}")


def main() -> None:
    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    movies = data.get("movies")
    if not movies:
        print("No movies found")
        return

    date_fields = ["view_date", "premiere_date"]
    new_movies: list[dict[str, object]] = []
    for movie in data.get("movies", []):
        new_movie: dict[str, object] = {}
        for field in movie.keys():
            original = movie.get(field)
            if field in date_fields:
                new_movie[field] = normalize_date(original)
            else:
                new_movie[field] = original
        new_movies.append(new_movie)

    # Create directory if it doesn't exist
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Save normalized file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as file:
        json.dump({"movies": new_movies}, file, indent=2, ensure_ascii=False)

    print(f"Archivo guardado en: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
