// Common utility types

// Alert types
export type AlertType = 'success' | 'error' | 'info' | 'warning'

// Pagination info
export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalResults: number
}

// Search types
export type SearchType = 'title' | 'filters' | 'ai' | null

// Theme types
export type Theme = 'light' | 'dark'

// LoaderService selector
export interface LoaderServiceSelectors {
  loaderAiSelector: string
  loaderSelector: string
  aiFormSubmitButtonSelector: string
  manualFormSubmitButtonSelector: string
  loadMoreButtonSelector: string
}

// Alert selectors
export interface AlertSelectors {
  alert: string
  closeButton: string
}

// Alert message
export type Message = string

// Modals selectors
export interface ModalsSelectors {
  movieModalSelector: string
  movieModalContentSelector: string
  movieModalCloseButtonSelector: string
  movieModalPosterSelector: string
  movieModalTitleSelector: string
  movieModalYearSelector: string
  movieModalRatingSelector: string
  movieModalOverviewSelector: string
}

// Theme selectors
export interface ThemeSelectors {
  root: string
  button: string
  toggle: string
}

// Tabs selectors
export interface TabsSelectors {
  root: string
  button: string
  content: string
}

// MovieResult selectors
export interface MovieResultsSelectors {
  resultListSelector: string
  resultFoundNumberSelector: string
}

// Error messages
export interface ErrorMessages {
  // AI (Groq) errors
  BAD_REQUEST: string
  UNAUTHORIZED: string
  RATE_LIMIT: string
  SERVER_ERROR: string
  NETWORK_ERROR: string
  INVALID_RESPONSE: string

  // TMDB errors
  TMDB_UNAUTHORIZED: string
  TMDB_NOT_FOUND: string
  TMDB_RATE_LIMIT: string
  TMDB_SERVER_ERROR: string
  TMDB_NETWORK_ERROR: string
}

// SearchController selectors
export interface SearchControllerSelectors {
  manualFormSelector: string
  aiFormSelector: string

  filtersButtonSelector: string
  filtersContentSelector: string
  filtersSelectSelector: string
  filtersRangeSelector: string
  filtersRangeOutputSelector: string

  outputAiMovieTitleSelector: string
  outputAiMovieYearSelector: string
  outputAiMovieConfidenceSelector: string
}
