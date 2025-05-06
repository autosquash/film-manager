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

  const thereIsMovieInfo = Boolean(
    viewDateString || premiereDateString || movie.movieURL
  )
  const isExpandable = Boolean(movie.imageURL || thereIsMovieInfo) && !open
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
      onClick={isExpandable ? () => setOpen(true) : undefined}
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
              <div className={styles.imagePlaceholder}>
                {t('imageNotAvailable')}
              </div>
            )}
          </>
          {thereIsMovieInfo && (
            <div className={styles.infoColumn}>
              {viewDateString && (
                <span>
                  <strong>{t('view')}: </strong>
                  {viewDateString}
                </span>
              )}
              {premiereDateString && (
                <span>
                  <strong>{t('premiere')}: </strong>
                  {premiereDateString}
                </span>
              )}
              {movie.movieURL && <a href={`${movie.movieURL}`}>Web</a>}
            </div>
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
