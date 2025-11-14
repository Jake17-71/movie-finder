import MovieResults from './MovieResults.js'

class SearchForm {

  selectors = {
    manualFormSelector: `[data-js-manual-form]`,
    aiFormSelector: `[data-js-ai-form]`,

    filtersButtonSelector: `[data-js-filters-button]`,
    filtersContentSelector: `[data-js-filters-content]`,
    filtersSelectSelector: `[data-js-filters-select]`,
    filtersRangeSelector: `[data-js-filters-range]`,
    filtersRangeOutputSelector: `[data-js-filters-range-output]`,

    loadMoreButtonSelector: `[data-js-load-more]`,
  }

  stateClasses = {
    isActive: 'is-active',
  }

  // API Configuration
  apiConfig = {
    tmdb: {
      baseUrl: 'https://api.themoviedb.org/3',
      token: import.meta.env.VITE_TMDB_TOKEN,
      language: 'ru-RU',
    },
    groq: {
      baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
      token: import.meta.env.VITE_GROQ_TOKEN,
      model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
      temperature: 0.3,
    },
  }

  // AI Response Schema
  aiResponseSchema = {
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
  aiPrompts = {
    system: {
      ru: 'Ты - эксперт по кинематографу. Твоя задача - определить название фильма по описанию пользователя. Анализируй описание и верни точное название фильма на русском языке, год выхода и уровень уверенности. Если описание очень расплывчатое или подходит под несколько фильмов, выбери самый известный и популярный вариант. Отвечай строго в формате JSON согласно схеме.',
      en: 'You are a cinema expert. Your task is to identify a movie based on the user\'s description. Analyze the description and return the exact movie title in English, release year, and confidence level. If the description is vague or matches multiple films, choose the most famous and popular option. Respond strictly in JSON format according to the schema.',
    },
    user: {
      ru: (description) => `Определи фильм по описанию: "${description}"`,
      en: (description) => `Identify the movie from this description: "${description}"`,
    },
  }

  constructor () {
    this.manualFormElement = document.querySelector(this.selectors.manualFormSelector)
    this.aiFormElement = document.querySelector(this.selectors.aiFormSelector)

    this.filtersButtonElement = document.querySelector(this.selectors.filtersButtonSelector)
    this.filtersContentElement = document.querySelector(this.selectors.filtersContentSelector)
    this.filtersSelectElement = document.querySelector(this.selectors.filtersSelectSelector)

    this.filtersRangeElement = document.querySelector(this.selectors.filtersRangeSelector)
    this.filtersRangeOutputElement = document.querySelector(this.selectors.filtersRangeOutputSelector)

    this.loadMoreButtonElement = document.querySelector(this.selectors.loadMoreButtonSelector)

    this.movieResults = new MovieResults()
    this.isAnimating = false
    this.genresRU = [
      {id: 28, name: 'боевик'},
      {id: 12, name: 'приключения'},
      {id: 16, name: 'мультфильм'},
      {id: 35, name: 'комедия'},
      {id: 80, name: 'криминал'},
      {id: 99, name: 'документальный'},
      {id: 18, name: 'драма'},
      {id: 10751, name: 'семейный'},
      {id: 14, name: 'фэнтези'},
      {id: 36, name: 'история'},
      {id: 27, name: 'ужасы'},
      {id: 10402, name: 'музыка'},
      {id: 9648, name: 'детектив'},
      {id: 10749, name: 'мелодрама'},
      {id: 878, name: 'фантастика'},
      {id: 10770, name: 'телевизионный фильм'},
      {id: 53, name: 'триллер'},
      {id: 10752, name: 'военный'},
      {id: 37, name: 'вестерн'},
    ]
    this.moviesData = []
    this.paginationInfo = {
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
    }
    this.lastSearchParams = null
    this.lastSearchType = null

    this.loadSelectOptions()
    this.bindEvents()

    this.searchByFilters()
  }

  // Detect language (ru/en) by checking for cyrillic characters
  detectLanguage(text) {
    const cyrillicPattern = /[а-яё]/i
    return cyrillicPattern.test(text) ? 'ru' : 'en'
  }

  // Get headers for TMDB API requests
  getTmdbHeaders() {
    return {
      accept: 'application/json',
      Authorization: this.apiConfig.tmdb.token,
    }
  }

  // Get headers for Groq AI API requests
  getGroqHeaders() {
    return {
      'Authorization': this.apiConfig.groq.token,
      'Content-Type': 'application/json',
    }
  }

  // Log API errors to console
  handleApiError(error, context) {
    console.log(`Error in ${context}:`, error)
  }

  // Update pagination info from API response
  updatePaginationInfo(json) {
    this.paginationInfo = {
      currentPage: json.page,
      totalPages: json.total_pages,
      totalResults: json.total_results,
    }
  }

  // Update movies data - replace on page 1, append on subsequent pages
  updateMoviesData(newMovies, page) {
    if (page === 1) {
      this.moviesData = newMovies
    } else {
      this.moviesData = [...this.moviesData, ...newMovies]
    }
  }

  // Render movies and update results count
  renderResults() {
    this.movieResults.renderMovies(this.moviesData, this.paginationInfo.totalResults)
  }

  // Unified method for TMDB API requests
  makeTmdbRequest(url, searchType, params, page) {
    this.lastSearchType = searchType
    this.lastSearchParams = params

    return fetch(url, {
      method: 'GET',
      headers: this.getTmdbHeaders(),
    })
      .then(res => res.json())
      .then(json => {
        console.log(`Search by ${searchType} results:`, json)
        this.updatePaginationInfo(json)
        return json
      })
      .catch(error => {
        this.handleApiError(error, `search-${searchType}`)
        throw error
      })
  }

  // TMDB API Methods
  // Search movies by title with optional client-side filters
  searchByTitle(formData, page = 1) {
    const params = new URLSearchParams({
      query: formData.get('movie-title').trim(),
      include_adult: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
    })

    const url = `${this.apiConfig.tmdb.baseUrl}/search/movie?${params.toString()}`

    this.makeTmdbRequest(url, 'title', formData, page)
      .then(json => {
        const filteredResults = this.applyClientFilters(json.results, formData)
        this.updateMoviesData(filteredResults, page)
        this.renderResults()
      })
      .catch(() => {})
  }

  // Search movies by filters (genre, year, rating) or get popular movies
  searchByFilters(formData = null, page = 1) {
    const params = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
      sort_by: 'popularity.desc',
    })

    if (formData) {
      const genre = formData.get('movie-genre')
      if (genre) {
        params.append('with_genres', genre)
      }

      const yearFrom = formData.get('movie-year-from')
      if (yearFrom) {
        params.append('primary_release_date.gte', `${yearFrom}-01-01`)
      }

      const yearTo = formData.get('movie-year-to')
      if (yearTo) {
        params.append('primary_release_date.lte', `${yearTo}-12-31`)
      }

      const rating = formData.get('movie-rating')
      if (rating) {
        params.append('vote_average.gte', rating)
      }
    }

    const url = `${this.apiConfig.tmdb.baseUrl}/discover/movie?${params.toString()}`

    this.makeTmdbRequest(url, 'filters', formData, page)
      .then(json => {
        this.updateMoviesData(json.results || [], page)
        this.renderResults()
      })
      .catch(() => {})
  }

  // Filters
  // Apply all client-side filters to movies array
  applyClientFilters(movies, formData) {
    let results = movies

    results = this.filterByGenre(results, formData)
    results = this.filterByRating(results, formData)
    results = this.filterByYearRange(results, formData)

    return results
  }

  // Filter movies by genre ID
  filterByGenre(movies, formData) {
    const genre = formData.get('movie-genre')
    if (!genre) return movies

    return movies.filter(movie =>
      movie.genre_ids && movie.genre_ids.includes(parseInt(genre))
    )
  }

  // Filter movies by minimum rating
  filterByRating(movies, formData) {
    const rating = formData.get('movie-rating')
    if (!rating) return movies

    return movies.filter(movie =>
      movie.vote_average && movie.vote_average >= parseFloat(rating)
    )
  }

  // Filter movies by year range
  filterByYearRange(movies, formData) {
    const yearFrom = formData.get('movie-year-from')
    const yearTo = formData.get('movie-year-to')

    if (!yearFrom && !yearTo) return movies

    return movies.filter(movie => {
      if (!movie.release_date) return false

      const movieYear = new Date(movie.release_date).getFullYear()
      const minYear = yearFrom ? parseInt(yearFrom) : -Infinity
      const maxYear = yearTo ? parseInt(yearTo) : Infinity

      return movieYear >= minYear && movieYear <= maxYear
    })
  }

  // AI Search Methods
  // Use AI to identify movie from natural language description
  searchWithAi(formData) {
    const userDescription = formData.get('ai-description')
    const language = this.detectLanguage(userDescription)

    const requestBody = {
      model: this.apiConfig.groq.model,
      messages: [
        {
          role: 'system',
          content: this.aiPrompts.system[language],
        },
        {
          role: 'user',
          content: this.aiPrompts.user[language](userDescription),
        },
      ],
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

    fetch(this.apiConfig.groq.baseUrl, {
      method: 'POST',
      headers: this.getGroqHeaders(),
      body: JSON.stringify(requestBody),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Groq API error: ${res.status}`)
        }
        return res.json()
      })
      .then(json => {
        if (!json.choices?.[0]?.message?.content) {
          throw new Error('Invalid response structure from Groq API')
        }

        const movieInfo = JSON.parse(json.choices[0].message.content)
        console.log('AI response:', movieInfo)

        this.searchMovieByAiResult(movieInfo)
      })
      .catch(error => this.handleApiError(error, 'searchWithAi'))
  }

  // Search TMDB using AI-identified movie info
  searchMovieByAiResult(movieInfo, page = 1) {
    const params = new URLSearchParams({
      query: movieInfo.movieTitle.trim(),
      include_adult: 'false',
      language: this.apiConfig.tmdb.language,
      page: page.toString(),
      year: movieInfo.releaseYear,
    })

    const url = `${this.apiConfig.tmdb.baseUrl}/search/movie?${params.toString()}`

    this.makeTmdbRequest(url, 'ai', movieInfo, page)
      .then(json => {
        this.updateMoviesData(json.results || [], page)
        this.renderResults()
      })
      .catch(() => {})
  }

  // Find movie in current results by ID
  getMovieById(movieId) {
    return this.moviesData.find(movie => movie.id === parseInt(movieId))
  }

  // Load next page of results based on last search type
  loadMoreResults() {
    if (this.paginationInfo.currentPage >= this.paginationInfo.totalPages) {
      console.log('No more pages to load')
      return
    }

    const nextPage = this.paginationInfo.currentPage + 1

    switch (this.lastSearchType) {
      case 'title':
        this.searchByTitle(this.lastSearchParams, nextPage)
        break
      case 'filters':
        this.searchByFilters(this.lastSearchParams, nextPage)
        break
      case 'ai':
        this.searchMovieByAiResult(this.lastSearchParams, nextPage)
        break
      default:
        console.log('Unknown search type')
    }
  }

  // UI Methods
  // Populate genre select with Russian genre names
  loadSelectOptions() {
    this.genresRU.forEach(( {id, name } ) => {
      const option = document.createElement("option")
      option.text = name
      option.value = id

      this.filtersSelectElement.appendChild(option)
    })
  }

  // Handle manual search form submission
  onManualFormSubmitButtonClick(e) {
    e.preventDefault()
    const formData = new FormData(this.manualFormElement)

    const hasTitle = formData.get('movie-title')?.trim()?.length > 0

    hasTitle ? this.searchByTitle(formData) : this.searchByFilters(formData)
  }

  // Handle AI search form submission
  onAiFormSubmitButtonClick(e) {
    e.preventDefault()
    const formData = new FormData(this.aiFormElement)
    this.searchWithAi(formData)
  }

  // Update range input display value
  onInputRangeChange() {
    this.filtersRangeOutputElement.innerText = this.filtersRangeElement.value
  }

  // Toggle filters accordion open/close
  onFiltersButtonClick() {
    if (this.isAnimating) return

    const isExpanded = this.filtersButtonElement.getAttribute('aria-expanded') === 'true'
    isExpanded ? this.closeFilters() : this.openFilters()
  }

  // Open filters with animation
  openFilters() {
    this.isAnimating = true
    this.filtersButtonElement.setAttribute('aria-expanded', 'true')

    this.filtersContentElement.style.display = 'flex'

    // Force reflow before adding class
    this.filtersContentElement.offsetHeight

    requestAnimationFrame(() => {
      this.filtersContentElement.classList.add(this.stateClasses.isActive)
    })

    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this.isAnimating = false
    }, transitionDuration)
  }

  // Close filters with animation
  closeFilters() {
    this.isAnimating = true
    this.filtersButtonElement.setAttribute('aria-expanded', 'false')

    this.filtersContentElement.classList.remove(this.stateClasses.isActive)

    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this.filtersContentElement.style.display = 'none'
      this.isAnimating = false
    }, transitionDuration)
  }

  // Get CSS transition duration in milliseconds
  getTransitionDuration() {
    const duration = getComputedStyle(this.filtersContentElement).transitionDuration
    return parseFloat(duration) * 1000
  }

  // Bind all event listeners
  bindEvents() {
    this.manualFormElement.addEventListener('submit', (e) => this.onManualFormSubmitButtonClick(e))
    this.aiFormElement.addEventListener('submit', (e) => this.onAiFormSubmitButtonClick(e))

    this.filtersButtonElement.addEventListener('click', () => this.onFiltersButtonClick())
    this.filtersRangeElement.addEventListener('input', () => this.onInputRangeChange())

    this.loadMoreButtonElement.addEventListener('click', () => this.loadMoreResults())
  }
}

export default SearchForm