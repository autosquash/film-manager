import { describe, expect, it } from 'vitest'
import { normalizeDate } from '../utils/dateProcessing'

describe('normalizeDate', () => {
  it('returns null for empty input', () => {
    expect(normalizeDate('')).toBeNull()
  })

  it('normalizes date with full format', () => {
    expect(normalizeDate('01-02-2024')).toBe('2024-02-01')
  })

  it('adds leading zero to day and month', () => {
    expect(normalizeDate('1-2-2024')).toBe('2024-02-01')
  })

  it('converts 2-digit year to 4-digit', () => {
    expect(normalizeDate('5-6-23')).toBe('2023-06-05')
  })

  it('throws error on wrong number of segments', () => {
    expect(() => normalizeDate('01-02')).toThrow('Wrong length')
  })

  it('throws error if year is not 2 or 4 digits', () => {
    expect(() => normalizeDate('1-2-234')).toThrow(
      'Wrong length of year string: 3'
    )
  })

  it('throws error if day is longer than 2 digits', () => {
    expect(() => normalizeDate('123-1-2024')).toThrow(
      'Wrong length of day string'
    )
  })

  it('throws error if month is longer than 2 digits', () => {
    expect(() => normalizeDate('1-123-2024')).toThrow(
      'Wrong length of month string'
    )
  })

  it('throws error for day > 31', () => {
    expect(() => normalizeDate('32-1-2024')).toThrow('Invalid value for date')
  })

  it('throws error for month > 12', () => {
    expect(() => normalizeDate('1-13-2024')).toThrow('Invalid value for date')
  })
})
