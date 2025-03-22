use regex::Regex;
use std::path::Path;
use uuid::Uuid;

/// Generates a unique filename within the given directory based on the original filename.
/// - If the base name is unused, it's returned as-is.
/// - If it ends with _DDD (digits), it will try incrementing the number.
/// - If not, _001 will be appended.
/// - If all names up to _999 are taken, fallback to UUID.
pub fn get_unique_filename(images_dir: &Path, original_filename: &str) -> Result<String, String> {
    // 1) We separate extension and base name
    // - If original_filename = "foto_001.png":
    // - base = "foto\_001"
    // - ext = "png"
    let path = Path::new(original_filename);

    let ext = path
        .extension()
        .and_then(|e| e.to_str())
        .ok_or("missing extension")?
        .to_string();

    let base = path
        .file_stem()
        .and_then(|b| b.to_str())
        .ok_or("missing base name")?
        .to_string();

    // Regex to match base names ending in _digits (e.g., "photo_001")
    let pattern = Regex::new(r"^(.*)_(\d{3})$").unwrap();

    // 2) We build the path based on base + extension
    // and check if it exists
    let mut final_name = format_filename(&base, &ext);
    let mut candidate_path = images_dir.join(&final_name);
    if !candidate_path.exists() {
        // Si NO existe, usamos este nombre
        return Ok(final_name);
    }

    let mut candidate_base = base.clone();
    let start_number = if let Some(caps) = pattern.captures(&base) {
        candidate_base = caps.get(1).unwrap().as_str().to_string();
        caps.get(2).unwrap().as_str().parse::<u32>().unwrap_or(0) + 1
    } else {
        0
    };

    for number in start_number..=999 {
        let padded = format!("{:03}", number);
        let new_base = format!("{}_{}", candidate_base, padded);
        final_name = format_filename(&new_base, &ext);
        candidate_path = images_dir.join(&final_name);
        if !candidate_path.exists() {
            return Ok(final_name);
        }
    }

    // Fallback to UUID
    let uuid_str = Uuid::new_v4().to_string();
    Ok(format_filename(&uuid_str, &ext))
}

fn format_filename(base: &str, ext: &str) -> String {
    if ext.is_empty() {
        base.to_string()
    } else {
        format!("{}.{}", base, ext)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs::File;
    use tempdir::TempDir;

    fn touch_file(dir: &Path, filename: &str) {
        let path = dir.join(filename);
        File::create(path).expect("Failed to create file");
    }

    #[test]
    fn uses_original_name_if_available() {
        let tmp_dir = TempDir::new("tests").unwrap();
        let name = get_unique_filename(tmp_dir.path(), "foto.png").unwrap();
        assert_eq!(name, "foto.png");
    }

    #[test]
    fn adds_000_if_original_taken() {
        let tmp_dir = TempDir::new("tests").unwrap();
        touch_file(tmp_dir.path(), "foto.png");

        let name = get_unique_filename(tmp_dir.path(), "foto.png").unwrap();
        assert_eq!(name, "foto_000.png");
    }

    #[test]
    fn jumps_the_numbers_already_existing() {
        let tmp_dir = TempDir::new("tests").unwrap();
        touch_file(tmp_dir.path(), "foto.png");
        touch_file(tmp_dir.path(), "foto_000.png");
        touch_file(tmp_dir.path(), "foto_001.png");

        let name = get_unique_filename(tmp_dir.path(), "foto.png").unwrap();
        assert_eq!(name, "foto_002.png");
    }

    #[test]
    fn increments_to_the_next_available_number_if_current_one_exists() {
        let tmp_dir = TempDir::new("tests").unwrap();
        touch_file(tmp_dir.path(), "foto_100.png");
        touch_file(tmp_dir.path(), "foto_101.png");
        touch_file(tmp_dir.path(), "foto_102.png");

        let name = get_unique_filename(tmp_dir.path(), "foto_100.png").unwrap();
        assert_eq!(name, "foto_103.png");
    }

    #[test]
    fn returns_original_if_foto_997_is_available() {
        let tmp_dir = TempDir::new("tests").unwrap();

        let name = get_unique_filename(tmp_dir.path(), "foto_997.png").unwrap();
        assert_eq!(name, "foto_997.png");
    }

    #[test]
    fn goes_to_998_if_foto_997_taken() {
        let tmp_dir = TempDir::new("tests").unwrap();
        touch_file(tmp_dir.path(), "foto_997.png");

        let name = get_unique_filename(tmp_dir.path(), "foto_997.png").unwrap();
        assert_eq!(name, "foto_998.png");
    }

    #[test]
    fn falls_back_to_uuid_if_all_taken() {
        let tmp_dir = TempDir::new("tests").unwrap();
        for i in 997..=999 {
            let filename = format!("foto_{:03}.png", i);
            touch_file(tmp_dir.path(), &filename);
        }

        let name = get_unique_filename(tmp_dir.path(), "foto_997.png").unwrap();

        let uuid_length = 36;
        let ext_length = 4;
        assert!(
            name.ends_with(".png") && name.len() == uuid_length + ext_length,
            "Expected UUID fallback, got: {}",
            name
        );
    }

    #[test]
    fn errors_if_no_extension() {
        let tmp_dir = TempDir::new("").unwrap();
        let result = get_unique_filename(tmp_dir.path(), "file_without_ext");
        assert!(result.is_err());
    }

    #[test]
    fn errors_if_no_base_name() {
        let tmp_dir = TempDir::new("").unwrap();
        let result = get_unique_filename(tmp_dir.path(), ".hiddenfile");
        assert!(result.is_err());
    }
}
