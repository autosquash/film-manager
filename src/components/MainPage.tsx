import { useTranslation } from 'react-i18next'
import styles from '../css/App.module.css'
import { Movie } from '../utils/model'
import Card from './Card'

const colors = [
  'orange',
  'MediumOrchid',
  'LawnGreen',
  'Peru',
  'coral',
  'LightSeaGreen',
]

interface Props {
  movies: readonly Movie[]
  showForm: () => void
}

export default function MainPage({ movies, showForm }: Props) {
  const { t } = useTranslation()
  return (
    <>
      <h1 className={styles.title}>
        {t('mainTitle', { numberOfMovies: movies.length })}
      </h1>
      <button onClick={showForm}>{t('addMovie')}</button>
      <ul className={styles.moviesList}>
        {movies.map((movie, index) => (
          <li key={movie.id}>
            <Card movie={movie} color={colors[index % colors.length]} />
          </li>
        ))}
      </ul>
    </>
  )
}
