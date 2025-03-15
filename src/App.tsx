import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import './App.css'

interface Movie {
  title: string
  view_date: string
}

const colors = [
  'orange',
  'purple',
  'green',
  'SaddleBrown',
  'coral',
  'LightSeaGreen',
]

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      console.log(fetchedMovies)
      setMovies(fetchedMovies)
    })
  }, [])

  const getViewDateString = (movie: Movie) =>
    !movie.view_date || movie.view_date === 'unknown'
      ? ''
      : `(vista el ${movie.view_date.split('-').reverse().join('-')})`

  return (
    <div className="container">
      <h1> Listado de Películas</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <span style={{ color: colors[index % colors.length] }}>
              <strong>{movie.title}</strong> {getViewDateString(movie)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
