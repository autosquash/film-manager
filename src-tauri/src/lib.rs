// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod commands;

// use commands::get_movies;

use std::path::PathBuf;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::get_movies::get_movies,
            commands::save_movies::save_movies,
            commands::save_image::save_image
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[allow(dead_code)]
fn debug_path(path: &PathBuf) {
    println!("{:#?}", path.canonicalize().unwrap().display());
}
