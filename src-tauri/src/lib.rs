// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
struct Movie {
    title: String,
    view_date: String,
    image_url: Option<String>,
    id: Option<Uuid>,
}

#[command]
fn get_movies() -> Vec<Movie> {
    let path = PathBuf::from("../data/movies.json");
    let data = fs::read_to_string(path).unwrap_or("[]".to_string());
    let movies = serde_json::from_str(&data).unwrap_or_else(|_| vec![]);
    let new_movies = movies
        .into_iter()
        .map(|movie: Movie| match movie.id {
            Some(_) => movie,
            None => Movie {
                title: movie.title,
                view_date: movie.view_date,
                image_url: movie.image_url,
                id: Some(Uuid::new_v4()),
            },
        })
        .collect();
    new_movies
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_movies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
