import { describe, expect, it } from 'vitest'
import { DateString, Title } from '../utils/model'
import { dbMovieToMovie, movieToDbMovie } from '../utils/repository/dbTransform'

describe('movieToDbMovie', () => {
  it('maps all fields correctly when all values are present', () => {
    const movie = {
      title: new Title('Inception'),
      viewDate: new DateString('2023-07-01'),
      premiereDate: new DateString('2010-07-16'),
      imageURL: 'inception.jpg',
      movieURL: 'http://movies.com/inception',
      id: 'abc123',
    }

    const result = movieToDbMovie(movie)

    expect(result).toEqual({
      title: 'Inception',
      view_date: '2023-07-01',
      image_url: 'inception.jpg',
      premiere_date: '2010-07-16',
      movie_url: 'http://movies.com/inception',
      id: 'abc123',
    })
  })

  it('sets view_date and premiere_date to null if not provided', () => {
    const movie = {
      title: new Title('The Matrix'),
      viewDate: null,
      premiereDate: null,
      imageURL: 'matrix.jpg',
      movieURL: 'http://movies.com/matrix',
      id: 'xyz789',
    }

    const result = movieToDbMovie(movie)

    expect(result).toEqual({
      title: 'The Matrix',
      view_date: null,
      premiere_date: null,
      image_url: 'matrix.jpg',
      movie_url: 'http://movies.com/matrix',
      id: 'xyz789',
    })
  })
})

describe('dbMovieToMovie', () => {
  it('maps all fields correctly when all values are present', () => {
    const dbMovie = {
      title: 'Interstellar',
      view_date: '2023-01-01',
      premiere_date: '2014-11-07',
      image_url: 'interstellar.jpg',
      movie_url: 'http://movies.com/interstellar',
      id: 'm001',
    }

    const result = dbMovieToMovie(dbMovie)

    expect(result).toEqual({
      title: new Title('Interstellar'),
      viewDate: new DateString('2023-01-01'),
      premiereDate: new DateString('2014-11-07'),
      imageURL: 'interstellar.jpg',
      movieURL: 'http://movies.com/interstellar',
      id: 'm001',
    })
  })

  it('sets viewDate and premiereDate to null if not present', () => {
    const dbMovie = {
      title: 'Tenet',
      view_date: null,
      premiere_date: null,
      image_url: 'tenet.jpg',
      movie_url: 'http://movies.com/tenet',
      id: 'm002',
    }

    const result = dbMovieToMovie(dbMovie)

    expect(result).toEqual({
      title: new Title('Tenet'),
      viewDate: null,
      premiereDate: null,
      imageURL: 'tenet.jpg',
      movieURL: 'http://movies.com/tenet',
      id: 'm002',
    })
  })
})
