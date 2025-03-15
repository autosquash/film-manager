// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use serde::{Deserialize, Serialize};
use serde_json::to_writer_pretty;
use std::fs::{self, File};
use std::path::PathBuf;
use tauri::command;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug)]
struct Movie {
    title: String,
    view_date: Option<String>,
    premiere_date: Option<String>,
    movie_url: Option<String>,
    image_url: Option<String>,
    id: Option<Uuid>,
}

#[derive(Serialize, Deserialize, Debug)]
struct Data {
    movies: Vec<Movie>,
}

const PATH: &str = "../data/movies.json";

#[command]
fn get_movies() -> Vec<Movie> {
    let path = PathBuf::from(PATH);
    let data = fs::read_to_string(path).unwrap();
    let movies_result: Result<Vec<Movie>, serde_json::Error> = serde_json::from_str(&data);
    let movies: Vec<Movie> = match movies_result {
        Ok(_) => movies_result.unwrap(),
        Err(_) => {
            let data: Data = serde_json::from_str(&data).unwrap();
            data.movies
        }
    };

    if movies.len() == 0 {
        return vec![];
    }

    let new_movies = movies
        .into_iter()
        .map(|movie: Movie| match movie.id {
            Some(_) => movie,
            None => Movie {
                title: movie.title,
                view_date: movie.view_date,
                premiere_date: movie.premiere_date,
                movie_url: movie.movie_url,
                image_url: movie.image_url,
                id: Some(Uuid::new_v4()),
            },
        })
        .collect();

    let data = Data { movies: new_movies };

    let json = serde_json::to_string_pretty(&data).unwrap();
    println!("{}", json);

    let file = File::create("../data/movies-output.json").unwrap();
    to_writer_pretty(file, &data).unwrap();

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
