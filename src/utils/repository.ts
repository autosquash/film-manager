import { invoke } from '@tauri-apps/api/core'

export interface Movie {
  title: string
  view_date?: string | null
  image_url?: string | null
  premiere_date?: string | null
  movie_url?: string | null
  id: string
}

async function saveMovies(movies: readonly Movie[]) {
  await invoke<void>('save_movies', {
    movies,
  })
}

async function getMovies(): Promise<Movie[]> {
  return invoke<Movie[]>('get_movies')
}

export default { saveMovies, getMovies }
