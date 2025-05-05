import type { Movie } from '../utils/model'
import MovieForm from './MovieForm'

interface Props {
  updateMovie: (movie: Movie) => void
  close: () => void
  movie: Movie
}

export default function EditMoviePage({ updateMovie, close, movie }: Props) {
  return (
    <MovieForm
      onSubmit={updateMovie}
      close={close}
      initialMovieState={{
        id: movie.id,
        title: movie.title.value,
        viewDate: movie.viewDate?.simpleFormat() || '',
        premiereDate: movie.premiereDate?.simpleFormat() || '',
        imageURL: movie.imageURL || '',
      }}
    />
  )
}
