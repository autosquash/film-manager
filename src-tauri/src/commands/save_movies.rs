use super::shared::{Data, Movie, DATA_PATH};

use serde_json::to_writer_pretty;
use std::fs::File;
use tauri::command;

#[command]
pub fn save_movies(movies: Vec<Movie>) -> Result<(), String> {
    let data = Data { movies };
    let file = File::create(DATA_PATH).map_err(|e| e.to_string())?;
    to_writer_pretty(file, &data).map_err(|e| e.to_string())?;
    Ok(())
}
