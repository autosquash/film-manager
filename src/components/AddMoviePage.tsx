import type { Movie } from '../utils/model'
import MovieForm from './MovieForm'

interface Props {
  addMovie: (newMovie: Movie) => void
  close: () => void
}

export default function AddMoviePage({ addMovie, close }: Props) {
  return <MovieForm onSubmit={addMovie} close={close} />
}
