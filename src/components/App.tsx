import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import '../css/App.css'
import styles from '../css/App.module.css'
import Card, { Movie } from './Card'
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
  needsSave: boolean
}>

export default function App() {
  const [moviesState, setMoviesState] = useState<MoviesState>({
    movies: [],
    needsSave: false,
  })
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      setMoviesState({ movies: fetchedMovies, needsSave: false })
    })
  }, [])

  useEffect(() => {
    if (!moviesState.needsSave) {
      return
    }
    const saveMovies = async () => {
      try {
        await invoke<void>('save_movies', {
          movies: moviesState.movies,
        })
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

      notify('Las películas se actualizaron correctamente')
    }
    saveMovies()
    setMoviesState((prev) => ({ ...prev, needsSave: false }))
  }, [moviesState.needsSave])

  return (
    <div className={styles.container}>
      <Toaster />
      {showForm ? (
        <MovieForm
          onSubmit={(newMovie: Movie) => {
            setMoviesState((prev) => ({
              movies: [...prev.movies, newMovie],
              needsSave: true,
            }))
            setShowForm(false)
          }}
          close={() => setShowForm(false)}
        />
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
