// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Serialize, Deserialize, Debug)]
struct Movie {
    title: String,
    view_date: String,
}

#[command]
fn get_movies() -> Vec<Movie> {
    let path = PathBuf::from("../data/movies.json");
    let data = fs::read_to_string(path).unwrap_or("[]".to_string());
    println!("{:#?}", data);
    serde_json::from_str(&data).unwrap_or_else(|_| vec![])
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_movies])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
