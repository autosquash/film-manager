import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from '../css/Card.module.css'
import type { Movie } from '../utils/model'

interface Props {
  movie: Movie
  color: string
  edit: () => void
}

export default function Card({ movie, color, edit }: Props) {
  const { t } = useTranslation()
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
                <em>{t('imageNotAvailable')}</em>
              </p>
            )}
          </>
          {viewDateString && (
            <p>
              <strong>{t('view')}: </strong>
              {viewDateString}
            </p>
          )}
          {premiereDateString && (
            <p>
              <strong>{t('premiere')}: </strong>
              {premiereDateString}
            </p>
          )}
          <div className={styles.buttonContainer}>
            {' '}
            <button onClick={edit}>{t('edit')}</button>
            <button
              className={styles.closeButton}
              onClick={() => setOpen(false)}
            >
              {t('close')}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
