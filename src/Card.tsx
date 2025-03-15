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

  const viewDateString = parseViewDate(movie.view_date)

  const isExpandable = Boolean(movie.image_url || viewDateString)
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
      onClick={isExpandable ? () => setOpen(!open) : undefined}
    >
      <span>
        <strong>{movie.title}</strong>
      </span>
      {open ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0 24px',
            fontSize: '14px',
            userSelect: 'none',
          }}
        >
          <>
            {movie.image_url ? (
              <img
                src={`data/${movie.image_url}`}
                alt={movie.title}
                className={styles.movieThumbnail}
              />
            ) : (
              <p>
                <em>Imagen no disponible</em>
              </p>
            )}
          </>
          {viewDateString && (
            <p>
              <strong>Vista: </strong>
              {viewDateString}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

const parseViewDate = (viewDate: string | null | undefined): string => {
  if (!viewDate || viewDate === 'unknown') {
    return ''
  }
  return viewDate!.split('-').reverse().join('-')
}
