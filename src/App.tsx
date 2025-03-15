import { invoke } from '@tauri-apps/api/core'
import { useEffect, useState } from 'react'
import Card, { Movie } from './Card'
import './css/App.css'

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
      console.log(fetchedMovies)
      setMovies(fetchedMovies)
    })
  }, [])

  return (
    <div className="container">
      <h1>Ya hemos visto como mínimo {movies.length} películas</h1>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <Card movie={movie} color={colors[index % colors.length]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
