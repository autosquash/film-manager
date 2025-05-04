import { invoke } from '@tauri-apps/api/core'
import type { Movie } from '../model'
import { dbMovieToMovie, movieToDbMovie } from './dbTransform'
import type { DbMovie } from './types'

async function saveMovies(movies: readonly Movie[]): Promise<void> {
  const dbMovies = movies.map(movieToDbMovie)
  await invoke<void>('save_movies', {
    movies: dbMovies satisfies readonly DbMovie[],
  })
}

async function getMovies(): Promise<Movie[]> {
  const movies = await invoke<DbMovie[]>('get_movies')
  return movies.map(dbMovieToMovie)
}

export default { saveMovies, getMovies }
