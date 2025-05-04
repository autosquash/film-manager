import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '../css/App.css'
import styles from '../css/App.module.css'
import { Movie } from '../utils/model'
import repository from '../utils/repository'
import Card from './Card'
import MovieForm from './MovieForm'
import Settings from './Settings'

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
  const { t } = useTranslation()

  const [displaySettings, setDisplaySettings] = useState(false)
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
        toast.error(t('updateFailed'), {
          icon: '⚠️',
        })
        return
      }
      setMoviesState({ movies: newMovies })
      notify(t('movieAdded'))
    }
    saveMovies()
  }

  if (displaySettings) {
    return (
      <div className={styles.container}>
        {' '}
        <Settings close={() => setDisplaySettings(false)} />
      </div>
    )
  }

  return (
    <div>
      <div className={styles.container}>
        <Toaster />
        {showForm ? (
          <MovieForm onSubmit={addMovie} close={() => setShowForm(false)} />
        ) : (
          <>
            <h1 className={styles.title}>
              {t('mainTitle', { numberOfMovies: moviesState.movies.length })}
            </h1>
            <button onClick={() => setShowForm(!showForm)}>
              {t('addMovie')}
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
      <div style={{ padding: 20 }} onClick={() => setDisplaySettings(true)}>
        {t('settings')}
      </div>
    </div>
  )
}
