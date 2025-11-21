import MovieResults from './MovieResults.ts'
import AlertCollection from './Alert.ts'
import ApiService from './ApiService.ts'
import FilterService from './FilterService.ts'
import PaginationService from './PaginationService.ts'
import LoaderService from './LoaderService.ts'
import {
  AIMovieInfo,
  Genre,
  Movie,
  SearchControllerSelectors,
  SearchType,
} from '@/types'
import Modals from '@/modules/Modals.ts'
import Alert from './Alert.ts'

class SearchController {
  selectors: SearchControllerSelectors = {
    manualFormSelector: `[data-js-manual-form]`,
    aiFormSelector: `[data-js-ai-form]`,

    filtersButtonSelector: `[data-js-filters-button]`,
    filtersContentSelector: `[data-js-filters-content]`,
    filtersSelectSelector: `[data-js-filters-select]`,
    filtersRangeSelector: `[data-js-filters-range]`,
    filtersRangeOutputSelector: `[data-js-filters-range-output]`,

    outputAiMovieTitleSelector: `[data-js-ai-movie-title]`,
    outputAiMovieYearSelector: `[data-js-ai-movie-year]`,
    outputAiMovieConfidenceSelector: `[data-js-ai-movie-confidence]`,
  }

  stateClasses: { isActive: string } = {
    isActive: 'is-active',
  }

  genresRU: Genre[] = [
    { id: 28, name: 'боевик' },
    { id: 12, name: 'приключения' },
    { id: 16, name: 'мультфильм' },
    { id: 35, name: 'комедия' },
    { id: 80, name: 'криминал' },
    { id: 99, name: 'документальный' },
    { id: 18, name: 'драма' },
    { id: 10751, name: 'семейный' },
    { id: 14, name: 'фэнтези' },
    { id: 36, name: 'история' },
    { id: 27, name: 'ужасы' },
    { id: 10402, name: 'музыка' },
    { id: 9648, name: 'детектив' },
    { id: 10749, name: 'мелодрама' },
    { id: 878, name: 'фантастика' },
    { id: 10770, name: 'телевизионный фильм' },
    { id: 53, name: 'триллер' },
    { id: 10752, name: 'военный' },
    { id: 37, name: 'вестерн' },
  ]

  private readonly manualFormElement: HTMLFormElement | null
  private readonly aiFormElement: HTMLFormElement | null
  private readonly filtersButtonElement: HTMLButtonElement | null
  private readonly filtersContentElement: HTMLDivElement | null
  private readonly filtersSelectElement: HTMLSelectElement | null
  private readonly filtersRangeElement: HTMLInputElement | null
  private readonly filtersRangeOutputElement: HTMLOutputElement | null
  private readonly outputAiMovieTitleElement: HTMLSpanElement | null
  private readonly outputAiMovieYearElement: HTMLSpanElement | null
  private readonly outputAiMovieConfidenceElement: HTMLSpanElement | null
  private readonly alert: Alert
  private readonly apiService: ApiService
  private readonly filterService: FilterService
  private readonly paginationService: PaginationService
  private readonly loaderService: LoaderService
  private readonly movieResults: MovieResults
  private isAnimating: boolean
  private moviesData: Movie[]
  private lastSearchParams: FormData | AIMovieInfo | null
  private lastSearchType: SearchType

  constructor(modals: Modals) {
    this.manualFormElement = document.querySelector(
      this.selectors.manualFormSelector
    )
    this.aiFormElement = document.querySelector(this.selectors.aiFormSelector)

    this.filtersButtonElement = document.querySelector(
      this.selectors.filtersButtonSelector
    )
    this.filtersContentElement = document.querySelector(
      this.selectors.filtersContentSelector
    )
    this.filtersSelectElement = document.querySelector(
      this.selectors.filtersSelectSelector
    )
    this.filtersRangeElement = document.querySelector(
      this.selectors.filtersRangeSelector
    )
    this.filtersRangeOutputElement = document.querySelector(
      this.selectors.filtersRangeOutputSelector
    )

    this.outputAiMovieTitleElement = document.querySelector(
      this.selectors.outputAiMovieTitleSelector
    )
    this.outputAiMovieYearElement = document.querySelector(
      this.selectors.outputAiMovieYearSelector
    )
    this.outputAiMovieConfidenceElement = document.querySelector(
      this.selectors.outputAiMovieConfidenceSelector
    )

    // Initialize services
    this.alert = new AlertCollection()
    this.apiService = new ApiService(this.alert)
    this.filterService = new FilterService()
    this.paginationService = new PaginationService()
    this.loaderService = new LoaderService()
    this.movieResults = new MovieResults(modals)

    // State
    this.isAnimating = false
    this.moviesData = []
    this.lastSearchParams = null
    this.lastSearchType = null

    this.loadSelectOptions()
    this.bindEvents()

    this.searchByFilters()
  }

  // Search Methods

  // Search movies by title with optional client-side filters
  searchByTitle(formData: FormData, page = 1): void {
    this.loaderService.disableButtons()
    this.loaderService.showLoader()

    const query = String(formData.get('movie-title'))
    const filters = this.filterService.extractFiltersFromFormData(formData)

    this.lastSearchType = 'title'
    this.lastSearchParams = formData

    this.apiService
      .searchByTitle(query, page)
      .then((json) => {
        this.paginationService.update(json)
        const filteredResults = this.filterService.applyFilters(
          json.results,
          filters
        )
        this.updateMoviesData(filteredResults, page)
        this.renderResults()
      })
      .catch(() => {})
      .finally(() => {
        this.loaderService.enableButtons()
        this.loaderService.hideLoader()
      })
  }

  // Search movies by filters (genre, year, rating) or get popular movies
  searchByFilters(formData: FormData | null = null, page = 1): void {
    this.loaderService.disableButtons()
    this.loaderService.showLoader()

    const filters = formData
      ? this.filterService.extractFiltersFromFormData(formData)
      : {}

    this.lastSearchType = 'filters'
    this.lastSearchParams = formData

    this.apiService
      .searchByFilters(filters, page)
      .then((json) => {
        this.paginationService.update(json)
        this.updateMoviesData(json.results || [], page)
        this.renderResults()
      })
      .catch(() => {})
      .finally(() => {
        this.loaderService.enableButtons()
        this.loaderService.hideLoader()
      })
  }

  // Use AI to identify movie from natural language description
  searchWithAi(formData: FormData): void {
    this.loaderService.disableButtons()
    this.loaderService.showAiLoader()

    const userDescription = String(formData.get('ai-description'))

    this.apiService
      .searchWithAi(userDescription)
      .then((movieInfo) => {
        this.updateAiOutputInfo(movieInfo)
        this.searchMovieByAiResult(movieInfo)
      })
      .catch(() => {
        this.loaderService.enableButtons()
        this.loaderService.hideAiLoader()
      })
  }

  // Search TMDB using AI-identified movie info
  searchMovieByAiResult(movieInfo: AIMovieInfo, page = 1): void {
    // Кнопки уже отключены в searchWithAi, не отключаем повторно при page = 1
    if (page > 1) {
      this.loaderService.disableButtons()
    } else {
      // При первом вызове (после AI) скрываем AI loader
      this.loaderService.hideAiLoader()
    }

    this.loaderService.showLoader()

    this.lastSearchType = 'ai'
    this.lastSearchParams = movieInfo

    this.apiService
      .searchByAiResult(movieInfo, page)
      .then((json) => {
        this.paginationService.update(json)
        this.updateMoviesData(json.results || [], page)
        this.renderResults()
      })
      .catch(() => {})
      .finally(() => {
        this.loaderService.enableButtons()
        this.loaderService.hideLoader()
      })
  }

  // Load next page of results based on last search type
  loadMoreResults(): void {
    if (!this.paginationService.hasMorePages()) {
      console.log('No more pages to load')
      return
    }

    const nextPage = this.paginationService.getNextPage()
    if (!nextPage || !this.lastSearchParams) {
      return
    }

    switch (this.lastSearchType) {
      case 'title':
        this.searchByTitle(this.lastSearchParams as FormData, nextPage)
        break
      case 'filters':
        this.searchByFilters(this.lastSearchParams as FormData | null, nextPage)
        break
      case 'ai':
        this.searchMovieByAiResult(
          this.lastSearchParams as AIMovieInfo,
          nextPage
        )
        break
      default:
        console.log('Unknown search type')
    }
  }

  // Data Management

  // Update movies data - replace on page 1, append on subsequent pages
  updateMoviesData(newMovies: Movie[], page: number): void {
    if (page === 1) {
      this.moviesData = newMovies
    } else {
      this.moviesData = [...this.moviesData, ...newMovies]
    }
  }

  // Render movies and update results count
  renderResults(): void {
    const { totalResults } = this.paginationService.getInfo()
    this.movieResults.renderMovies(this.moviesData, totalResults)
  }

  // Find movie in current results by ID
  getMovieById(movieId: string): Movie | undefined {
    return this.moviesData.find((movie) => movie.id === parseInt(movieId))
  }

  // UI Methods

  // Update Ai output
  updateAiOutputInfo(movieInfo: AIMovieInfo): void {
    const { movieTitle, releaseYear, confidence } = movieInfo

    if (this.outputAiMovieTitleElement) {
      this.outputAiMovieTitleElement.textContent = movieTitle
    }
    if (this.outputAiMovieYearElement) {
      this.outputAiMovieYearElement.textContent = String(releaseYear)
    }
    if (this.outputAiMovieConfidenceElement) {
      this.outputAiMovieConfidenceElement.setAttribute(
        'data-confidence',
        confidence
      )
    }
  }

  // Populate genre select with Russian genre names
  loadSelectOptions(): void {
    if (!this.filtersSelectElement) {
      return
    }

    this.genresRU.forEach(({ id, name }: Genre): void => {
      const option = document.createElement('option')
      option.text = name
      option.value = String(id)

      if (this.filtersSelectElement) {
        this.filtersSelectElement.appendChild(option)
      }
    })
  }

  // Event Handlers

  // Handle manual search form submission
  onManualFormSubmitButtonClick(e: SubmitEvent): void {
    e.preventDefault()
    if (!this.manualFormElement) {
      return
    }

    const formData = new FormData(this.manualFormElement)

    const hasTitle = String(formData.get('movie-title'))?.trim()?.length > 0

    hasTitle ? this.searchByTitle(formData) : this.searchByFilters(formData)
  }

  // Handle AI search form submission
  onAiFormSubmitButtonClick(e: SubmitEvent): void {
    e.preventDefault()
    if (!this.aiFormElement) {
      return
    }

    const formData = new FormData(this.aiFormElement)
    this.searchWithAi(formData)
  }

  // Update range input display value
  onInputRangeChange(): void {
    if (!this.filtersRangeOutputElement || !this.filtersRangeElement) {
      return
    }

    this.filtersRangeOutputElement.innerText = this.filtersRangeElement.value
  }

  // Toggle filters accordion open/close
  onFiltersButtonClick(): void {
    if (this.isAnimating || !this.filtersButtonElement) {
      return
    }

    const isExpanded =
      this.filtersButtonElement.getAttribute('aria-expanded') === 'true'
    isExpanded ? this.closeFilters() : this.openFilters()
  }

  // Open filters with animation
  openFilters(): void {
    if (!this.filtersButtonElement || !this.filtersContentElement) {
      return
    }

    this.isAnimating = true
    this.filtersButtonElement.setAttribute('aria-expanded', 'true')

    this.filtersContentElement.style.display = 'flex'

    // Force reflow before adding class
    this.filtersContentElement.offsetHeight

    requestAnimationFrame(() => {
      if (this.filtersContentElement) {
        this.filtersContentElement.classList.add(this.stateClasses.isActive)
      }
    })

    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this.isAnimating = false
    }, transitionDuration)
  }

  // Close filters with animation
  closeFilters(): void {
    if (!this.filtersButtonElement || !this.filtersContentElement) {
      return
    }

    this.isAnimating = true
    this.filtersButtonElement.setAttribute('aria-expanded', 'false')

    this.filtersContentElement.classList.remove(this.stateClasses.isActive)

    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      if (this.filtersContentElement) {
        this.filtersContentElement.style.display = 'none'
      }
      this.isAnimating = false
    }, transitionDuration)
  }

  // Get CSS transition duration in milliseconds
  getTransitionDuration(): number {
    if (!this.filtersContentElement) {
      return 0
    }

    const duration = getComputedStyle(
      this.filtersContentElement
    ).transitionDuration
    return parseFloat(duration) * 1000
  }

  // Bind all event listeners
  bindEvents(): void {
    this.manualFormElement?.addEventListener('submit', (e: SubmitEvent) =>
      this.onManualFormSubmitButtonClick(e)
    )
    this.aiFormElement?.addEventListener('submit', (e: SubmitEvent) =>
      this.onAiFormSubmitButtonClick(e)
    )
    this.filtersButtonElement?.addEventListener('click', () =>
      this.onFiltersButtonClick()
    )
    this.filtersRangeElement?.addEventListener('input', () =>
      this.onInputRangeChange()
    )
    this.loaderService.loadMoreButtonElement.addEventListener('click', () =>
      this.loadMoreResults()
    )
  }
}

export default SearchController