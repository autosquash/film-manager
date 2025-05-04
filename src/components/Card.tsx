import { useState } from 'react'
import styles from '../css/Card.module.css'
import type { Movie } from '../utils/model'

interface Props {
  movie: Movie
  color: string
}

export default function Card({ movie, color }: Props) {
  const [open, setOpen] = useState(false)

  const viewDateString = movie.viewDate?.simpleFormat()
  const premiereDateString = movie.premiereDate?.simpleFormat()

  const isExpandable = Boolean(
    movie.imageURL || viewDateString || premiereDateString
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
        <strong>{movie.title.value}</strong>
      </span>
      {open ? (
        <div className={styles.content}>
          <>
            {movie.imageURL ? (
              <img
                src={`data/${movie.imageURL}`}
                alt={movie.title.value}
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
