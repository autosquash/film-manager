import { invoke } from '@tauri-apps/api/core'
import { DateString, Movie, Title } from '../model'

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
    view_date: movie.viewDate?.value ?? null,
    image_url: movie.imageURL,
    premiere_date: movie.premiereDate?.value ?? null,
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
    id: dbMovie.id,
    title: new Title(dbMovie.title),
    viewDate: dbMovie.view_date ? new DateString(dbMovie.view_date) : null,
    premiereDate: dbMovie.premiere_date
      ? new DateString(dbMovie.premiere_date)
      : null,
    imageURL: dbMovie.image_url,
    movieURL: dbMovie.movie_url,
  }))
}

export default { saveMovies, getMovies }
