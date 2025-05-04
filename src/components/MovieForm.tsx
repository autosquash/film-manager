import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from '../css/MovieForm.module.css'
import { DateString, Title, type Movie } from '../utils/model'
import ImageLoader, { FileData } from './ImageLoader'

type MovieInputState = Readonly<{
  title: string
  viewDate: string
  premiereDate: string
  imageURL: string
}>

interface Props {
  onSubmit: (newMovie: Movie) => void
  close: () => void
}

const MovieForm = ({ onSubmit, close }: Props) => {
  const [movie, setMovie] = useState<MovieInputState>(createInitialMovieState())
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [imageFileData, setImageFileData] = useState<FileData | null>(null)

  useEffect(() => {
    if (
      (movie.viewDate && !validateDate(movie.viewDate)) ||
      (movie.premiereDate && !validateDate(movie.premiereDate))
    ) {
      setDateError('Las fechas deben tener el formato dd-mm-YY.')
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
      setTitleError('El título es obligatorio.')
      return
    }
    const movieTitle = new Title(trimmedMovieTitle)
    if (dateError) {
      return
    }
    for (const date of [movie.viewDate, movie.premiereDate]) {
      if (!date) {
        continue
      }
      if (!validateDate(date)) {
        return
      }
    }
    const viewDate = movie.viewDate && normalizeDate(movie.viewDate)
    const premiereDate = movie.premiereDate && normalizeDate(movie.premiereDate)
    let imageURL: string | null = movie.imageURL

    if (imageFileData) {
      imageURL = await saveImage(imageFileData, movieTitle)
    }

    onSubmit({
      id: uuidv4(),
      title: movieTitle,
      viewDate: viewDate ? new DateString(viewDate) : null,
      premiereDate: premiereDate ? new DateString(premiereDate) : null,
      imageURL: imageURL,
      movieURL: null,
    })
    setMovie(createInitialMovieState())
  }

  const errorToDisplay = titleError || dateError

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Título:</label>
        <input
          type="text"
          name="title"
          value={movie.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Fecha de visionado (dd-mm-YY):</label>
        <input
          type="text"
          name="view_date"
          value={movie.viewDate}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label>Fecha de estreno (dd-mm-YY):</label>
        <input
          type="text"
          name="premiere_date"
          value={movie.premiereDate}
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
      <button type="submit">Agregar película</button>
      <button onClick={close} style={{ backgroundColor: 'darkred' }}>
        Cancelar
      </button>
    </form>
  )
}

// Module scope functions

const createInitialMovieState = () => ({
  title: '',
  viewDate: '',
  premiereDate: '',
  imageURL: '',
})

const validateDate = (date: string) => {
  return /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(date)
}

function normalizeDate(date: string): string | null {
  if (!date) {
    return null
  }
  const items = date.split('-')
  if (items.length !== 3) {
    throw new Error('Wrong length')
  }
  let [day, month, year] = items
  if (year.length == 2) {
    year = '20' + year
  }
  if (year.length !== 4) {
    throw new Error(`Wrong length of year string: ${year.length}`)
  }

  if (day.length === 1) {
    day = '0' + day
  }
  if (day.length !== 2) {
    throw new Error('Wrong length of day string')
  }

  if (month.length === 1) {
    month = '0' + month
  }
  if (month.length !== 2) {
    throw new Error('Wrong length of month string')
  }

  if (parseInt(day) > 31 || parseInt(month) > 12) {
    throw new Error('Invalid value for date')
  }
  return [year, month, day].join('-')
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
