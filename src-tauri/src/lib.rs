// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::{fs, path::PathBuf};
use tauri::command;
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_movies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
