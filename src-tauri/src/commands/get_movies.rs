use std::{fs, path::PathBuf};

use tauri::command;

use super::shared::{Data, Movie, DATA_PATH};

#[command]
pub fn get_movies() -> Vec<Movie> {
    let path = PathBuf::from(DATA_PATH);
    let data = fs::read_to_string(path).unwrap();
    let data: Data = serde_json::from_str(&data).unwrap();
    data.movies
}
