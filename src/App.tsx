import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import './App.css'

interface Movie {
  title: string
  year: number
  genre: string
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
      <h1>Listado de Películas</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <strong>{movie.title}</strong> ({movie.year}) - {movie.genre}
          </li>
        ))}
      </ul>
    </div>
  )
}
