import { useState } from 'react'
import styles from './css/Card.module.css'

export interface Movie {
  title: string
  view_date?: string | null
  image_url?: string | null
}

interface Props {
  movie: Movie
  color: string
}

export default function Card({ movie, color }: Props) {
  const [open, setOpen] = useState(false)
  const parseViewDate = (viewDate: string | null | undefined) => {
    if (!viewDate || viewDate === 'unknown') {
      return ''
    }
    return `(vista el ${viewDate!.split('-').reverse().join('-')})`
  }
  const getViewDateString = (movie: Movie) => parseViewDate(movie.view_date)

  const isExpandable = Boolean(movie.image_url)
  const cardClassNames = `${styles.movieCard} ${
    isExpandable ? styles.movieCardExpandable : ''
  }`
  const cardStyle = {
    '--background-color': color,
    cursor: isExpandable ? 'pointer' : 'default',
  }
  return (
    <div
      className={cardClassNames}
      style={cardStyle}
      onClick={() => setOpen(!open)}
    >
      <span>
        <strong>{movie.title}</strong> {getViewDateString(movie)}
      </span>
      {open ? (
        <div>
          {movie.image_url && (
            <img
              src={`data/${movie.image_url}`}
              alt={movie.title}
              className={styles.movieThumbnail}
            />
          )}
        </div>
      ) : null}
    </div>
  )
}
