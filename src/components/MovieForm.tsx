import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from '../css/MovieForm.module.css'
import { Movie } from './Card'

interface MovieFormProps {
  onSubmit: (newMovie: Movie) => void
  close: () => void
}

const createInitialMovieState = () => ({
  title: '',
  viewDate: '',
  premiereDate: '',
})

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

const MovieForm: React.FC<MovieFormProps> = ({ onSubmit, close }) => {
  const [movie, setMovie] = useState(createInitialMovieState())
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')

  const validateDate = (date: string) => {
    return date === '' || /^\d{1,2}-\d{1,2}-\d{2,4}$/.test(date)
  }

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!movie.title.trim()) {
      setTitleError('El título es obligatorio.')
      return
    }
    if (dateError) {
      return
    }
    for (const date in [movie.viewDate, movie.premiereDate]) {
      if (!validateDate(date)) {
        return
      }
    }
    const viewDate = normalizeDate(movie.viewDate)
    const premiereDate = normalizeDate(movie.premiereDate)

    onSubmit({
      id: uuidv4(),
      title: movie.title,
      view_date: viewDate,
      premiere_date: premiereDate,
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
      {errorToDisplay && <p className={styles.error}>{errorToDisplay}</p>}
      <button type="submit">Agregar película</button>
      <button onClick={close} style={{ backgroundColor: 'darkred' }}>
        Cancelar
      </button>
    </form>
  )
}

export default MovieForm
