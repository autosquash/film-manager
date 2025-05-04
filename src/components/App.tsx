import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import '../css/App.css'
import styles from '../css/App.module.css'
import { Movie } from '../utils/model'
import repository from '../utils/repository'
import Card from './Card'
import MovieForm from './MovieForm'

const notify = (msg: string) => toast(msg)

const colors = [
  'orange',
  'MediumOrchid',
  'LawnGreen',
  'Peru',
  'coral',
  'LightSeaGreen',
]

type MoviesState = Readonly<{
  movies: readonly Movie[]
}>

export default function App() {
  const [moviesState, setMoviesState] = useState<MoviesState>({
    movies: [],
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    repository.getMovies().then((fetchedMovies) => {
      setMoviesState({ movies: fetchedMovies })
    })
  }, [])

  const addMovie = (newMovie: Movie) => {
    const newMovies = [...moviesState.movies, newMovie]

    setShowForm(false)
    const saveMovies = async () => {
      try {
        await repository.saveMovies(newMovies)
      } catch (err) {
        console.error(err)
        toast.error(
          'Hubo un error y las películas no se guardaron correctamente',
          {
            icon: '⚠️',
          }
        )
        return
      }
      setMoviesState({ movies: newMovies })
      notify('La película se añadió correctamente')
    }
    saveMovies()
  }

  return (
    <div className={styles.container}>
      <Toaster />
      {showForm ? (
        <MovieForm onSubmit={addMovie} close={() => setShowForm(false)} />
      ) : (
        <>
          <h1 className={styles.title}>
            Ya hemos visto como mínimo {moviesState.movies.length} películas
          </h1>
          <button onClick={() => setShowForm(!showForm)}>
            Añadir película
          </button>
          <ul className={styles.moviesList}>
            {moviesState.movies.map((movie, index) => (
              <li key={movie.id}>
                <Card movie={movie} color={colors[index % colors.length]} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
