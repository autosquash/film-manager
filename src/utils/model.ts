export interface Movie {
  title: Title
  viewDate: DateString | null
  premiereDate: DateString | null
  imageURL: string | null
  movieURL: string | null
  id: string
}

export class Title {
  readonly value: string
  constructor(value: string) {
    if (!value.trim()) {
      throw new Error("Title shouldn't be empty")
    }
    this.value = value
  }
}
export class DateString {
  readonly value: string
  constructor(value: string) {
    if (!value.trim()) {
      throw new Error("Title shouldn't be empty")
    }
    this.value = value
  }
  simpleFormat(): string {
    if (!this.value) {
      return ''
    }
    const [year, month, day] = this.value.split('-')
    if (year.length !== 4) {
      throw new Error('Wrong year length in date: ' + this.value)
    }
    return [day, month, year].join('-')
  }
}
