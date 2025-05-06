import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import styles from '../css/MovieForm.module.css'
import { normalizeDate } from '../utils/dateProcessing'
import { Title, type Movie } from '../utils/model'
import ImageLoader, { FileData } from './ImageLoader'

export type MovieInputState = Readonly<{
  title: string
  viewDate: string
  premiereDate: string
  imageURL: string
  movieURL: string
  id: string | null
}>

interface Props {
  onSubmit: (newMovie: Movie) => void
  close: () => void
  initialMovieState: MovieInputState
}

const MovieForm = ({ onSubmit, close, initialMovieState }: Props) => {
  const { t } = useTranslation()
  const [movie, setMovie] = useState<MovieInputState>(initialMovieState)
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [imageFileData, setImageFileData] = useState<FileData | null>(null)

  useEffect(() => {
    if (
      (movie.viewDate && !validateDate(movie.viewDate)) ||
      (movie.premiereDate && !validateDate(movie.premiereDate))
    ) {
      setDateError(t('formatDates', { format: 'dd-mm-YY' }))
    } else {
      setDateError('')
    }
  }, [movie.viewDate, movie.premiereDate])

  useEffect(() => {
    if (titleError) {
      setTitleError('')
    }
  }, [movie.title])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let field = e.target.name
    const value = e.target.value
    switch (field) {
      case 'view_date':
        field = 'viewDate'
        break
      case 'premiere_date':
        field = 'premiereDate'
        break
      case 'movie_url':
        field = 'movieURL'
        break
      default:
        break
    }
    const newMovie = { ...movie, [field]: value }
    setMovie(newMovie)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedMovieTitle = movie.title.trim()
    if (!trimmedMovieTitle) {
      setTitleError(t('titleIsMandatory'))
      return
    }
    const movieTitle = new Title(trimmedMovieTitle)

    if (dateError) {
      return
    }
    // Check anyway
    const someDateIsNotValid = [movie.viewDate, movie.premiereDate]
      .filter(Boolean)
      .some((d) => !validateDate(d))

    if (someDateIsNotValid) {
      return
    }

    let imageURL: string | null = movie.imageURL

    if (imageFileData) {
      imageURL = await saveImage(imageFileData, movieTitle)
    }

    onSubmit({
      id: movie.id || uuidv4(),
      title: movieTitle,
      viewDate: normalizeDate(movie.viewDate),
      premiereDate: normalizeDate(movie.premiereDate),
      imageURL,
      movieURL: movie.movieURL || null,
    })
    setMovie(initialMovieState)
  }

  const errorToDisplay = titleError || dateError

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>{t('title')}:</label>
        <input
          type="text"
          name="title"
          value={movie.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>{t('viewDate')} (dd-mm-YY):</label>
        <input
          type="text"
          name="view_date"
          value={movie.viewDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label>{t('premiereDate')} (dd-mm-YY):</label>
        <input
          type="text"
          name="premiere_date"
          value={movie.premiereDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label>{t('movieURL')}:</label>
        <input
          type="text"
          name="movie_url"
          value={movie.movieURL}
          onChange={handleChange}
        />
      </div>

      <ImageLoader
        movieTitle={movie.title}
        onSave={(fileData: FileData) => {
          setImageFileData(fileData)
        }}
      />

      {errorToDisplay && <p className={styles.error}>{errorToDisplay}</p>}
      <button type="submit">
        {movie.id ? t('submitMovieUpdate') : t('submitMovie')}
      </button>
      <button onClick={close} style={{ backgroundColor: 'darkred' }}>
        {t('cancel')}
      </button>
    </form>
  )
}

// Module scope functions

const validateDate = (date: string) => {
  return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(date)
}

async function saveImage(
  imageFileData: FileData,
  movieTitle: Title
): Promise<string> {
  const { fileBytes, ext } = imageFileData
  const name = await invoke<string>('save_image', {
    fileBytes,
    movieTitle: movieTitle.value,
    ext,
  })
  return `images/${name}`
}

export default MovieForm
