import { invoke } from '@tauri-apps/api/core'
import { Movie, Title } from '../utils/model'

export interface DbMovie {
  title: string
  view_date: string | null
  image_url: string | null
  premiere_date: string | null
  movie_url: string | null
  id: string
}

async function saveMovies(movies: readonly Movie[]) {
  const dbMovies = movies.map((movie) => ({
    title: movie.title.value,
    view_date: movie.viewDate,
    image_url: movie.imageUrl,
    premiere_date: movie.premiereDate,
    movie_url: movie.movieURL,
    id: movie.id,
  }))
  await invoke<void>('save_movies', {
    movies: dbMovies satisfies readonly DbMovie[],
  })
}

async function getMovies(): Promise<Movie[]> {
  const movies = await invoke<DbMovie[]>('get_movies')
  return movies.map((dbMovie) => ({
    title: new Title(dbMovie.title),
    viewDate: dbMovie.view_date,
    imageUrl: dbMovie.image_url,
    premiereDate: dbMovie.premiere_date,
    movieURL: dbMovie.movie_url,
    id: dbMovie.id,
  }))
}

export default { saveMovies, getMovies }
