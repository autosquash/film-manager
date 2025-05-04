import { DateString, Movie, Title } from '../model'
import { DbMovie } from './types'

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

export function dbMovieToMovie(dbMovie: DbMovie): Movie {
  return {
    title: new Title(dbMovie.title),
    viewDate: dbMovie.view_date ? new DateString(dbMovie.view_date) : null,
    premiereDate: dbMovie.premiere_date
      ? new DateString(dbMovie.premiere_date)
      : null,
    imageURL: dbMovie.image_url,
    movieURL: dbMovie.movie_url,
    id: dbMovie.id,
  }
}
