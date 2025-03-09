export interface Movie {
  title: string
  view_date?: string | null
  image_url?: string | null
}

interface Props {
  movie: Movie
  color: string
}

export default function Card({ movie, color }: Props) {
  const parseViewDate = (viewDate: string | null | undefined) => {
    if (!viewDate || viewDate === 'unknown') {
      return ''
    }
    return `(vista el ${viewDate!.split('-').reverse().join('-')})`
  }
  const getViewDateString = (movie: Movie) => parseViewDate(movie.view_date)
  return (
    <div className="movie-card" style={{ backgroundColor: color }}>
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
  )
}
