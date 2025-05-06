import type { Movie } from '../utils/model'
import MovieForm, { type MovieInputState } from './MovieForm'

interface Props {
  addMovie: (newMovie: Movie) => void
  close: () => void
}

export default function AddMoviePage({ addMovie, close }: Props) {
  return (
    <MovieForm
      onSubmit={addMovie}
      close={close}
      initialMovieState={createInitialMovieState()}
    />
  )
}

const createInitialMovieState = (): MovieInputState => ({
  id: null,
  title: '',
  viewDate: '',
  premiereDate: '',
  imageURL: '',
  movieURL: '',
})
