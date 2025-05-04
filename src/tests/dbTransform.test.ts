import { describe, expect, it } from 'vitest'
import { DateString, Title } from '../utils/model'
import { movieToDbMovie } from '../utils/repository/dbTransform'

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
