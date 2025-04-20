import { useState } from 'react'
import styles from '../css/Card.module.css'
import type { Movie } from '../model'

interface Props {
  movie: Movie
  color: string
}

export default function Card({ movie, color }: Props) {
  const [open, setOpen] = useState(false)

  const viewDateString = parseDate(movie.viewDate)
  const premiereDateString = parseDate(movie.premiereDate)

  const isExpandable = Boolean(
    movie.imageUrl || viewDateString || premiereDateString
  )
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
            {movie.imageUrl ? (
              <img
                src={`data/${movie.imageUrl}`}
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
          {premiereDateString && (
            <p>
              <strong>Estreno: </strong>
              {premiereDateString}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}

const parseDate = (date: string | null | undefined): string => {
  if (!date) {
    return ''
  }
  const [year, month, day] = date.split('-')
  if (year.length !== 4) {
    throw new Error('Wrong year length in date: ' + date)
  }
  return [day, month, year].join('-')
}
