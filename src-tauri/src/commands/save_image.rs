use super::utils::get_unique_filename;
use std::{fs, path::PathBuf};
use tauri::command;

#[command]
pub fn save_image(file_bytes: Vec<u8>, file_name: String) -> Result<String, String> {
    let images_dir = PathBuf::from("../data/images");

    // Ensure "images" directory exist
    if let Err(err) = fs::create_dir_all(&images_dir) {
        return Err(format!("Error creando directorio: {}", err));
    }

    let unique_filename = get_unique_filename(&images_dir, &file_name)?;

    // Build the full path: images/<filename>
    let file_path = images_dir.join(&unique_filename);

    // Write the bytes in that path
    match fs::write(&file_path, file_bytes) {
        Ok(_) => Ok(unique_filename),
        Err(err) => Err(format!("Error guardando archivo: {}", err)),
    }
}
