import Alert from '@/modules/Alert.ts'
import {
  AIMovieInfo,
  AIResponseSchema,
  ApiConfig,
  ErrorMessages,
  GroqMessage,
  Message,
  MovieFilters,
  TMDBResponse,
  Language,
  AIPrompts,
} from '@/types'

class ApiService {
  // API Configuration
  private apiConfig: ApiConfig = {
    tmdb: {
      baseUrl: 'https://api.themoviedb.org/3',
      token: import.meta.env.VITE_TMDB_TOKEN as string,
      language: 'ru-RU',
    },
    groq: {
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      token: import.meta.env.VITE_GROQ_TOKEN as string,
      model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
      temperature: 0.3,
    },
  }

  // AI Response Schema
  private aiResponseSchema: AIResponseSchema = {
    type: 'object',
    properties: {
      movieTitle: {
        type: 'string',
        description: 'Точное название фильма',
      },
      releaseYear: {
        type: 'number',
        description: 'Год выхода фильма',
      },
      confidence: {
        type: 'string',
        enum: ['high', 'medium', 'low'],
        description: 'Уверенность в правильности определения фильма',
      },
    },
    required: ['movieTitle', 'releaseYear', 'confidence'],
    additionalProperties: false,
  }

  // AI Prompts
  private aiPrompts: AIPrompts = {
    system: {
      ru: 'Ты - эксперт по кинематографу. Твоя задача - определить название фильма по описанию пользователя. Анализируй описание и верни точное название фильма на русском языке, год выхода и уровень уверенности. Если описание очень расплывчатое или подходит под несколько фильмов, выбери самый известный и популярный вариант. Отвечай строго в формате JSON согласно схеме.',
      en: "You are a cinema expert. Your task is to identify a movie based on the user's description. Analyze the description and return the exact movie title in English, release year, and confidence level. If the description is vague or matches multiple films, choose the most famous and popular option. Respond strictly in JSON format according to the schema.",
    },
    user: {
      ru: (description: string): string =>
        `Определи фильм по описанию: "${description}"`,
      en: (description: string): string =>
        `Identify the movie from this description: "${description}"`,
    },
  }

  private alert: Alert

  constructor(alertService: Alert) {
    this.alert = alertService
  }

  // Detect language (ru/en) by checking for cyrillic characters
  private detectLanguage(text: string): Language {
    const cyrillicPattern = /[а-яё]/i
    return cyrillicPattern.test(text) ? 'ru' : 'en'
  }

  // Get headers for TMDB API requests
  private getTmdbHeaders(): HeadersInit {
    return {
      accept: 'application/json',
      Authorization: this.apiConfig.tmdb.token,
    }
  }

  // Get headers for Groq AI API requests
  private getGroqHeaders(): HeadersInit {
    return {
      Authorization: this.apiConfig.groq.token,
      'Content-Type': 'application/json',
    }
  }

  // Log API errors to console and show user-friendly messages
  private handleApiError(error: Error, context: string): void {
    console.log(`Error in ${context}:`, error)

    const errorMessages: ErrorMessages = {
      // AI (Groq) errors
      BAD_REQUEST:
        'Неправильный формат запроса. Попробуйте описать фильм по-другому.',
      UNAUTHORIZED: 'Ошибка авторизации API. Проверьте настройки.',
      RATE_LIMIT: 'Превышен лимит запросов. Попробуйте позже.',
      SERVER_ERROR: 'Сервер временно недоступен. Попробуйте позже.',
      NETWORK_ERROR:
        'Не удалось связаться с сервером. Проверьте подключение к интернету.',
      INVALID_RESPONSE:
        'Получен некорректный ответ от сервера. Попробуйте еще раз.',

      // TMDB errors
      TMDB_UNAUTHORIZED: 'Ошибка авторизации TMDB API. Проверьте настройки.',
      TMDB_NOT_FOUND: 'Запрашиваемые данные не найдены.',
      TMDB_RATE_LIMIT:
        'Превышен лимит запросов к базе данных фильмов. Попробуйте позже.',
      TMDB_SERVER_ERROR:
        'Сервер базы данных фильмов временно недоступен. Попробуйте позже.',
      TMDB_NETWORK_ERROR:
        'Не удалось связаться с базой данных фильмов. Проверьте подключение к интернету.',
    }

    const errorType = error.message as keyof ErrorMessages
    const message: Message =
      errorMessages[errorType] ||
      'Произошла неизвестная ошибка. Попробуйте еще раз.'

    this.alert.showError(message)
  }

  // Unified method for TMDB API requests
  private makeTmdbRequest(url: string): Promise<TMDBResponse> {
    return fetch(url, {
      method: 'GET',
      headers: this.getTmdbHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('TMDB_UNAUTHORIZED')
          } else if (res.status === 404) {
            throw new Error('TMDB_NOT_FOUND')
          } else if (res.status === 429) {
            throw new Error('TMDB_RATE_LIMIT')
          } else if (res.status >= 500) {
            throw new Error('TMDB_SERVER_ERROR')
          } else {
            throw new Error('TMDB_NETWORK_ERROR')
          }
        }
        return res.json()
      })
      .then((json: TMDBResponse) => {
        console.log('TMDB API response:', json)
        return json
      })
      .catch((error: Error) => {
        this.handleApiError(error, 'TMDB request')
        throw error
      })
  }

  // Search movies by title
  searchByTitle(query: string, page = 1): Promise<TMDBResponse> {
    const params = new URLSearchParams({
      query: query.trim(),
      include_adult: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
    })

    const url = `${this.apiConfig.tmdb.baseUrl}/search/movie?${params.toString()}`
    return this.makeTmdbRequest(url)
  }

  // Search movies by filters (genre, year, rating) or get popular movies
  searchByFilters(filters: MovieFilters = {}, page = 1): Promise<TMDBResponse> {
    const params = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
      sort_by: 'popularity.desc',
    })

    if (filters.genre) {
      params.append('with_genres', filters.genre)
    }

    if (filters.yearFrom) {
      params.append('primary_release_date.gte', `${filters.yearFrom}-01-01`)
    }

    if (filters.yearTo) {
      params.append('primary_release_date.lte', `${filters.yearTo}-12-31`)
    }

    if (filters.rating) {
      params.append('vote_average.gte', filters.rating)
    }

    const url = `${this.apiConfig.tmdb.baseUrl}/discover/movie?${params.toString()}`
    return this.makeTmdbRequest(url)
  }

  // Search movie by AI-identified info
  searchByAiResult(movieInfo: AIMovieInfo, page = 1): Promise<TMDBResponse> {
    const params = new URLSearchParams({
      query: movieInfo.movieTitle.trim(),
      include_adult: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
      year: movieInfo.releaseYear.toString(),
    })

    const url = `${this.apiConfig.tmdb.baseUrl}/search/movie?${params.toString()}`
    return this.makeTmdbRequest(url)
  }

  // Use AI to identify movie from natural language description
  searchWithAi(userDescription: string): Promise<AIMovieInfo> {
    const language = this.detectLanguage(userDescription)

    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: this.aiPrompts.system[language],
      },
      {
        role: 'user',
        content: this.aiPrompts.user[language](userDescription),
      },
    ]

    const requestBody = {
      model: this.apiConfig.groq.model,
      messages,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'movie_identification',
          schema: this.aiResponseSchema,
          strict: true,
        },
      },
      temperature: this.apiConfig.groq.temperature,
    }

    return fetch(this.apiConfig.groq.baseUrl, {
      method: 'POST',
      headers: this.getGroqHeaders(),
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 400) {
            throw new Error('BAD_REQUEST')
          } else if (res.status === 401) {
            throw new Error('UNAUTHORIZED')
          } else if (res.status === 429) {
            throw new Error('RATE_LIMIT')
          } else if (res.status >= 500) {
            throw new Error('SERVER_ERROR')
          } else {
            throw new Error('NETWORK_ERROR')
          }
        }
        return res.json()
      })
      .then((json) => {
        if (!json.choices?.[0]?.message?.content) {
          throw new Error('INVALID_RESPONSE')
        }

        const movieInfo = JSON.parse(
          json.choices[0].message.content
        ) as AIMovieInfo
        console.log('AI response:', movieInfo)
        return movieInfo
      })
      .catch((error: Error) => {
        this.handleApiError(error, 'searchWithAi')
        throw error
      })
  }
}

export default ApiService