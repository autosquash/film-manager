export interface Movie {
  title: Title
  viewDate: string | null
  imageUrl: string | null
  premiereDate: string | null
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
