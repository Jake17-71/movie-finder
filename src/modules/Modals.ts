import { ModalsSelectors, Movie } from '@/types'
import SearchController from './SearchController.ts'

class Modals {
  private readonly selectors: ModalsSelectors = {
    movieModalSelector: `[data-js-movie-modal]`,
    movieModalContentSelector: `[data-js-movie-modal-content]`,
    movieModalCloseButtonSelector: `[data-js-movie-modal-close]`,
    movieModalPosterSelector: `[data-js-movie-modal-poster]`,
    movieModalTitleSelector: `[data-js-movie-modal-title]`,
    movieModalYearSelector: `[data-js-movie-modal-year]`,
    movieModalRatingSelector: `[data-js-movie-modal-rating]`,
    movieModalOverviewSelector: `[data-js-movie-modal-overview]`,
  }

  private readonly stateClasses: { isLock: string } = {
    isLock: 'is-lock',
  }

  private movieModalElement: HTMLDialogElement | null
  private movieModalContentElement: HTMLDivElement | null
  private movieModalCloseButton: HTMLButtonElement | null
  private readonly movieModalPosterElement: HTMLImageElement | null
  private readonly movieModalTitleElement: HTMLHeadingElement | null
  private readonly movieModalYearElement: HTMLParagraphElement | null
  private readonly movieModalRatingElement: HTMLSpanElement | null
  private readonly movieModalOverviewElement: HTMLParagraphElement | null

  searchForm: SearchController

  constructor(searchForm?: SearchController) {
    this.movieModalElement = document.querySelector(
      this.selectors.movieModalSelector
    )
    this.movieModalContentElement = document.querySelector(
      this.selectors.movieModalContentSelector
    )
    this.movieModalCloseButton = document.querySelector(
      this.selectors.movieModalCloseButtonSelector
    )
    this.movieModalPosterElement = document.querySelector(
      this.selectors.movieModalPosterSelector
    )
    this.movieModalTitleElement = document.querySelector(
      this.selectors.movieModalTitleSelector
    )
    this.movieModalYearElement = document.querySelector(
      this.selectors.movieModalYearSelector
    )
    this.movieModalRatingElement = document.querySelector(
      this.selectors.movieModalRatingSelector
    )
    this.movieModalOverviewElement = document.querySelector(
      this.selectors.movieModalOverviewSelector
    )

    this.searchForm = searchForm as SearchController

    this.bindEvents()
  }

  // Handle movie card click event
  onMovieCardClick(e: PointerEvent): void {
    this.handleCardActivation(e.currentTarget as HTMLElement)
  }

  // Handle keyboard navigation for movie cards (Enter/Space)
  onMovieCardKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.handleCardActivation(e.currentTarget as HTMLElement)
    }
  }

  // Extract movie ID and open modal
  handleCardActivation(cardElement: HTMLElement): void {
    const movieId = cardElement.dataset.jsMovieCard

    if (!movieId) {
      console.error('Movie ID not found on card element')
      return
    }

    this.openModal(movieId)
  }

  // Clear movie modal info
  clearModalInfo(): void {
    if (
      !this.movieModalPosterElement ||
      !this.movieModalTitleElement ||
      !this.movieModalYearElement ||
      !this.movieModalRatingElement ||
      !this.movieModalOverviewElement
    ) {
      return
    }

    this.movieModalPosterElement.src = ''
    this.movieModalPosterElement.alt = ''
    this.movieModalTitleElement.textContent = ''
    this.movieModalYearElement.textContent = ''
    this.movieModalRatingElement.textContent = ''
    this.movieModalOverviewElement.textContent = ''
  }

  // Update movie modal info
  updateModalInfo(movieInfo: Movie): void {
    this.clearModalInfo()

    if (
      !this.movieModalPosterElement ||
      !this.movieModalTitleElement ||
      !this.movieModalYearElement ||
      !this.movieModalRatingElement ||
      !this.movieModalOverviewElement
    ) {
      return
    }

    const title = movieInfo.title || 'Unknown Title'
    const year = movieInfo.release_date
      ? new Date(movieInfo.release_date).getFullYear()
      : 'N/A'
    const rating = movieInfo.vote_average
      ? Math.round(movieInfo.vote_average * 10) / 10
      : 0
    const overview = movieInfo.overview || 'Overview not found'
    const posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`

    this.movieModalTitleElement.textContent = title
    this.movieModalYearElement.textContent = String(year)
    this.movieModalRatingElement.textContent = String(rating)
    this.movieModalOverviewElement.textContent = overview
    this.movieModalPosterElement.src = posterUrl
    this.movieModalPosterElement.alt = title
  }

  // Open modal and lock body scroll
  openModal(movieId: string): void {
    const movieInfo: Movie | undefined = this.searchForm.getMovieById(movieId)

    if (!movieInfo) {
      console.error(`Movie with ID ${movieId} not found`)
      return
    }

    this.updateModalInfo(movieInfo)

    this.movieModalElement?.showModal()
    document.documentElement.classList.add(this.stateClasses.isLock)
  }

  // Close modal and unlock body scroll
  closeModal(): void {
    this.movieModalElement?.close()
    document.documentElement.classList.remove(this.stateClasses.isLock)
  }

  // Close modal when clicking outside content area (backdrop)
  onMovieModalContentClick(e: PointerEvent): void {
    if (!this.movieModalContentElement?.contains(e.target as Node)) {
      this.closeModal()
    }
  }

  // Bind modal event listeners
  bindEvents(): void {
    this.movieModalCloseButton?.addEventListener('click', () =>
      this.closeModal()
    )
    this.movieModalElement?.addEventListener('click', (e: PointerEvent) =>
      this.onMovieModalContentClick(e)
    )
  }
}

export default Modals