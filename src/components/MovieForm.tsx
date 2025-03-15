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
  view_date: '',
  premiere_date: '',
})

const MovieForm: React.FC<MovieFormProps> = ({ onSubmit, close }) => {
  const [movie, setMovie] = useState(createInitialMovieState())
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')

  const validateDate = (date: string) => {
    return date === '' || /^\d{1,2}-\d{1,2}-\d{2}$/.test(date)
  }

  useEffect(() => {
    if (!validateDate(movie.view_date) || !validateDate(movie.premiere_date)) {
      setDateError('Las fechas deben tener el formato dd-mm-YY.')
    } else {
      setDateError('')
    }
  }, [movie.view_date, movie.premiere_date])

  useEffect(() => {
    if (titleError) {
      setTitleError('')
    }
  }, [movie.title])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie({ ...movie, [e.target.name]: e.target.value })
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
    onSubmit({ ...movie, id: uuidv4() })
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
          value={movie.view_date}
          onChange={handleChange}
        />
      </div>
      <div className={styles.field}>
        <label>Fecha de estreno (dd-mm-YY):</label>
        <input
          type="text"
          name="premiere_date"
          value={movie.premiere_date}
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
