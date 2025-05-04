import { Movie } from '../model'

export function movieToDbMovie(movie: Movie) {
  return {
    title: movie.title.value,
    view_date: movie.viewDate?.value ?? null,
    image_url: movie.imageURL,
    premiere_date: movie.premiereDate?.value ?? null,
    movie_url: movie.movieURL,
    id: movie.id,
  }
}
