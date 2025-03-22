// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod utils;
use serde::{Deserialize, Serialize};
use serde_json::to_writer_pretty;
use std::{
    fs::{self, File},
    path::PathBuf,
};
use tauri::command;
use utils::get_unique_filename;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
struct Movie {
    title: String,
    view_date: Option<String>,
    premiere_date: Option<String>,
    movie_url: Option<String>,
    image_url: Option<String>,
    id: Uuid,
}

#[derive(Serialize, Deserialize, Debug)]
struct Data {
    movies: Vec<Movie>,
}

const DATA_PATH: &str = "../data/movies.json";

#[command]
fn get_movies() -> Vec<Movie> {
    let path = PathBuf::from(DATA_PATH);
    let data = fs::read_to_string(path).unwrap();
    let data: Data = serde_json::from_str(&data).unwrap();
    data.movies
}

#[command]
fn save_movies(movies: Vec<Movie>) {
    let data = Data { movies };
    let file = File::create(DATA_PATH).unwrap();
    to_writer_pretty(file, &data).unwrap()
}

#[command]
fn save_image(file_bytes: Vec<u8>, file_name: String) -> Result<String, String> {
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
        Ok(_) => {
            println!("El archivo se guardó bien");
            Ok(unique_filename)
        }
        Err(err) => Err(format!("Error guardando archivo: {}", err)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_movies,
            save_movies,
            save_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[allow(dead_code)]
fn debug_path(path: &PathBuf) {
    println!("{:#?}", path.canonicalize().unwrap().display());
}
