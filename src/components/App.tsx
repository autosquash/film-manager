import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import '../css/App.css'
import styles from '../css/App.module.css'
import Card, { Movie } from './Card'
import MovieForm from './MovieForm'

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
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      setMovies(fetchedMovies)
    })
  }, [])

  useEffect(() => {
    if (!movies.length) {
      return
    }
    invoke<void>('save_movies', { movies }).then(() => {
      alert('Se guardaron las películas')
    })
  }, [movies])

  return (
    <div className={styles.container}>
      {showForm ? (
        <MovieForm
          onSubmit={(newMovie: Movie) => {
            setMovies([...movies, newMovie])
            setShowForm(false)
          }}
          close={() => setShowForm(false)}
        />
      ) : (
        <>
          <h1 className={styles.title}>
            Ya hemos visto como mínimo {movies.length} películas
          </h1>
          <button onClick={() => setShowForm(!showForm)}>
            Añadir película
          </button>
          <ul className={styles.moviesList}>
            {movies.map((movie, index) => (
              <li key={movie.id}>
                <Card movie={movie} color={colors[index % colors.length]} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
