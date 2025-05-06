import { getCurrentWindow } from '@tauri-apps/api/window'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import '../css/App.css'
import styles from '../css/App.module.css'
import type { Movie } from '../utils/model'
import repository from '../utils/repository'
import AddMoviePage from './AddMoviePage'
import EditMoviePage from './EditMoviePage'
import MainPage from './MainPage'
import Settings from './Settings'

const notify = (msg: string) => toast(msg)

type MoviesState = Readonly<{
  movies: readonly Movie[]
}>

type FormKind = 'add' | 'edit' | null

export default function App() {
  const { t, i18n } = useTranslation()

  const [showSettings, setShowSettings] = useState(false)
  const [moviesState, setMoviesState] = useState<MoviesState>({
    movies: [],
  })
  const [formKind, setFormKind] = useState<FormKind>(null)
  const [selected, setSelected] = useState<Movie | null>(null)

  useEffect(() => {
    const window = getCurrentWindow()
    window.setTitle(t('appTitle'))
  }, [i18n.language])

  useEffect(() => {
    repository.getMovies().then((fetchedMovies) => {
      setMoviesState({ movies: fetchedMovies })
    })
  }, [])

  useEffect(() => {
    if (moviesState.movies.length === 0) {
      return
    }
    const saveMovies = async () => {
      try {
        await repository.saveMovies(moviesState.movies)
      } catch (err) {
        console.error(err)
        toast.error(t('updateFailed'), {
          icon: '⚠️',
        })
        return
      }
    }
    saveMovies()
  }, [moviesState.movies])

  const updateMovie = (edited: Movie) => {
    const newMovies = moviesState.movies.map((movie) => {
      if (movie.id === edited.id) {
        return edited
      }
      return movie
    })
    setFormKind(null)
    const saveMovies = async () => {
      setMoviesState({ movies: newMovies })
      notify(t('movieUpdated'))
    }
    saveMovies()
  }
  const addMovie = (newMovie: Movie) => {
    const newMovies = [...moviesState.movies, newMovie]
    setFormKind(null)
    const saveMovies = async () => {
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

  const displayAddMovieForm = () => setFormKind('add')
  const displayEditMovieForm = (movie: Movie) => {
    setSelected(movie)
    setFormKind('edit')
  }
  const closeForm = () => setFormKind(null)
  const displaySettings = () => setShowSettings(true)

  return (
    <div>
      <div className={styles.container}>
        <Toaster />
        {formKind === 'add' ? (
          <AddMoviePage addMovie={addMovie} close={closeForm} />
        ) : formKind === 'edit' && selected ? (
          <EditMoviePage
            updateMovie={updateMovie}
            close={() => {
              closeForm()
              setSelected(null)
            }}
            movie={selected}
          />
        ) : (
          <MainPage
            movies={moviesState.movies}
            displayAddMovieForm={displayAddMovieForm}
            displayEditMovieForm={displayEditMovieForm}
          />
        )}
      </div>
      <div style={{ padding: 20 }} onClick={displaySettings}>
        {t('settings')}
      </div>
    </div>
  )
}
