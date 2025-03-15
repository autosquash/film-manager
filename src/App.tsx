import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import Card, { Movie } from './Card'
import './css/App.css'
import styles from './css/App.module.css'

const colors = [
  'orange',
  'MediumOrchid',
  'LawnGreen',
  'Peru',
  'coral',
  'LightSeaGreen',
]

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      setMovies(fetchedMovies)
    })
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Ya hemos visto como mínimo {movies.length} películas
      </h1>
      <ul className={styles.moviesList}>
        {movies.map((movie, index) => (
          <li key={movie.id}>
            <Card movie={movie} color={colors[index % colors.length]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
