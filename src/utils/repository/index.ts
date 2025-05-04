import { invoke } from '@tauri-apps/api/core'
import { DateString, Movie, Title } from '../model'
import { movieToDbMovie } from './dbTransform'
import type { DbMovie } from './types'

async function saveMovies(movies: readonly Movie[]): Promise<void> {
  const dbMovies = movies.map(movieToDbMovie)
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
