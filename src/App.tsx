import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import './App.css'

interface Movie {
  title: string
  view_date: string
}

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    invoke<Movie[]>('get_movies').then((fetchedMovies) => {
      console.log(fetchedMovies)
      setMovies(fetchedMovies)
    })
  }, [])

  return (
    <div className="container">
      <h1> Listado de Películas</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <strong>{movie.title}</strong>{' '}
            {['unknown', '', undefined, null].includes(movie.view_date)
              ? ''
              : `(vista el ${movie.view_date.split('-').reverse().join('-')})`}
          </li>
        ))}
      </ul>
    </div>
  )
}
