import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import './App.css'

interface Movie {
  title: string
  view_date?: string | null
  image_url?: string | null
}

const colors = [
  'orange',
  'MediumOrchid',
  'LawnGreen',
  'Peru',
  'coral',
  'LightSeaGreen',
]

const parseViewDate = (viewDate: string | null | undefined) => {
  if (!viewDate || viewDate === 'unknown') {
    return ''
  }
  return `(vista el ${viewDate!.split('-').reverse().join('-')})`
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      console.log(fetchedMovies)
      setMovies(fetchedMovies)
    })
  }, [])

  const getViewDateString = (movie: Movie) => parseViewDate(movie.view_date)

  return (
    <div className="container">
      <h1>Ya hemos visto como mínimo {movies.length} películas</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <div
              className="movie-card"
              style={{ backgroundColor: colors[index % colors.length] }}
            >
              <span>
                <strong>{movie.title}</strong> {getViewDateString(movie)}
              </span>
              {movie.image_url && (
                <img
                  src={`data/${movie.image_url}`}
                  alt={movie.title}
                  className="movie-thumbnail"
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
