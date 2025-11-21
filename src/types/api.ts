// TMDB API Types
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  genre_ids: number[]
  original_language: string
  video: boolean
}

export interface TMDBResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// Groq AI API Types
export interface AIMovieInfo {
  movieTitle: string
  releaseYear: number
  confidence: 'high' | 'medium' | 'low'
}

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Filter Types
export interface MovieFilters {
  genre?: string
  yearFrom?: string
  yearTo?: string
  rating?: string
}

// Genre Type
export interface Genre {
  id: number
  name: string
}

// Api config
export interface ApiConfig {
  tmdb: {
    baseUrl: string
    token: string
    language: string
  }
  groq: {
    baseUrl: string
    token: string
    model: string
    temperature: number
  }
}

// Ai response schema
export interface AIResponseSchema {
  type: 'object'
  properties: {
    movieTitle: {
      type: 'string'
      description: string
    }
    releaseYear: {
      type: 'number'
      description: string
    }
    confidence: {
      type: 'string'
      enum: ['high', 'medium', 'low']
      description: string
    }
  }
  required: ['movieTitle', 'releaseYear', 'confidence']
  additionalProperties: false
}

// Language type
export type Language = 'ru' | 'en'

// Ai prompts type
export interface AIPrompts {
  system: Record<Language, string>
  user: Record<Language, (description: string) => string>
}
