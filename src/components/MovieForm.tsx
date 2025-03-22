import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from '../css/MovieForm.module.css'
import { convertTitleToFileNameBase } from '../utils/transformations'
import { Movie } from './Card'
import ImageLoader, { FileData } from './ImageLoader'

interface Props {
  onSubmit: (newMovie: Movie) => void
  close: () => void
}

const MovieForm: React.FC<Props> = ({ onSubmit, close }) => {
  const [movie, setMovie] = useState(createInitialMovieState())
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')
  const [imageFileData, setImageFileData] = useState<FileData | null>(null)

  useEffect(() => {
    if (!validateDate(movie.viewDate) || !validateDate(movie.premiereDate)) {
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
    const field = e.target.name
    const value = e.target.value
    setMovie({ ...movie, [field]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!movie.title.trim()) {
      setTitleError('El título es obligatorio.')
      return
    }
    if (dateError) {
      return
    }
    for (const date of [movie.viewDate, movie.premiereDate]) {
      if (!validateDate(date)) {
        return
      }
    }
    const viewDate = normalizeDate(movie.viewDate)
    const premiereDate = normalizeDate(movie.premiereDate)
    let imageURL: string | null = movie.imageURL

    if (imageFileData) {
      const { fileBytes, ext } = imageFileData
      const fileName = convertTitleToFileNameBase(movie.title) + '.' + ext
      const name = await invoke<string>('save_image', {
        fileBytes,
        fileName,
      })
      imageURL = `images/${name}`
    }

    onSubmit({
      id: uuidv4(),
      title: movie.title,
      view_date: viewDate,
      premiere_date: premiereDate,
      image_url: imageURL,
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

const createInitialMovieState = () => ({
  title: '',
  viewDate: '',
  premiereDate: '',
  imageURL: '',
})

const validateDate = (date: string) => {
  return date === '' || /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(date)
}

function normalizeDate(date: string): string | null {
  if (!date) {
    return null
  }
  const items = date.split('-')
  if (items.length !== 3) {
    throw new Error('Wrong length')
  }
  let [day, month, year] = date
  if (year.length == 2) {
    year = '20' + year
  }
  if (year.length !== 4) {
    throw new Error('Wrong length of year string')
  }
  if (day.length === 1) {
    day = '0' + day
  }
  if (month.length === 1) {
    month = '0' + month
  }

  if (day.length !== 2) {
    throw new Error('Wrong length of day string')
  }
  if (month.length !== 2) {
    throw new Error('Wrong length of month string')
  }
  if (parseInt(day) > 31 || parseInt(month) > 12) {
    throw new Error('Invalid value for date')
  }
  return [year, month, day].join('-')
}

export default MovieForm
