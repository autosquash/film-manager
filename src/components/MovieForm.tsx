import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import styles from '../css/MovieForm.module.css'
import { Movie } from './Card'

interface MovieFormProps {
  onSubmit: (newMovie: Movie) => void
  close: () => void
}

const MovieForm: React.FC<MovieFormProps> = ({ onSubmit, close }) => {
  const [title, setTitle] = useState('')
  const [view_date, setView_date] = useState('')
  const [premiere_date, setPremiere_date] = useState('')
  const [titleError, setTitleError] = useState('')
  const [dateError, setDateError] = useState('')

  const validateDate = (date: string) => {
    return date === '' || /^\d{1,2}-\d{1,2}-\d{2}$/.test(date)
  }

  useEffect(() => {
    if (!validateDate(view_date) || !validateDate(premiere_date)) {
      setDateError('Las fechas deben tener el formato dd-mm-YY.')
    } else {
      setDateError('')
    }
  }, [view_date, premiere_date])

  useEffect(() => {
    if (titleError) {
      setTitleError('')
    }
  }, [title])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('El título es obligatorio.')
      return
    }
    if (dateError) {
      return
    }
    onSubmit({ title, view_date, premiere_date, id: uuidv4() })
    setTitle('')
    setView_date('')
    setPremiere_date('')
  }

  const errorToDisplay = titleError || dateError

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label>Título:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className={styles.field}>
        <label>Fecha de visionado (dd-mm-YY):</label>
        <input
          type="text"
          value={view_date}
          onChange={(e) => setView_date(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label>Fecha de estreno (dd-mm-YY):</label>
        <input
          type="text"
          value={premiere_date}
          onChange={(e) => setPremiere_date(e.target.value)}
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
