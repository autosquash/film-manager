use serde::{Deserialize, Serialize};

use uuid::Uuid;

pub const DATA_PATH: &str = "../data/movies.json";

#[derive(Serialize, Deserialize, Debug)]
pub struct Movie {
    title: String,
    view_date: Option<String>,
    premiere_date: Option<String>,
    movie_url: Option<String>,
    image_url: Option<String>,
    id: Uuid,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Data {
    pub movies: Vec<Movie>,
}
