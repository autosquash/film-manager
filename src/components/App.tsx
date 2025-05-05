import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '../css/App.css'
import styles from '../css/App.module.css'
import { Movie } from '../utils/model'
import repository from '../utils/repository'
import AddMoviePage from './AddMoviePage'
import MainPage from './MainPage'
import Settings from './Settings'

const notify = (msg: string) => toast(msg)

type MoviesState = Readonly<{
  movies: readonly Movie[]
}>

export default function App() {
  const { t } = useTranslation()

  const [showSettings, setShowSettings] = useState(false)
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

  if (showSettings) {
    const closeSettings = () => setShowSettings(false)
    return (
      <div className={styles.container}>
        {' '}
        <Settings close={closeSettings} />
      </div>
    )
  }

  const displayForm = () => setShowForm(true)
  const closeForm = () => setShowForm(false)
  const displaySettings = () => setShowSettings(true)

  return (
    <div>
      <div className={styles.container}>
        <Toaster />
        {showForm ? (
          <AddMoviePage addMovie={addMovie} close={closeForm} />
        ) : (
          <MainPage movies={moviesState.movies} showForm={displayForm} />
        )}
      </div>
      <div style={{ padding: 20 }} onClick={displaySettings}>
        {t('settings')}
      </div>
    </div>
  )
}
