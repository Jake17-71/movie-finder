class Modals {

  selectors = {
    movieModalSelector: `[data-js-movie-modal]`,
    movieModalContentSelector: `[data-js-movie-modal-content]`,
    movieModalCloseButtonSelector: `[data-js-movie-modal-close]`,
    movieModalPosterSelector: `[data-js-movie-modal-poster]`,
    movieModalTitleSelector: `[data-js-movie-modal-title]`,
    movieModalYearSelector: `[data-js-movie-modal-year]`,
    movieModalRatingSelector: `[data-js-movie-modal-rating]`,
    movieModalOverviewSelector: `[data-js-movie-modal-overview]`,
  }

  stateClasses = {
    isLock: 'is-lock',
  }

  constructor (searchForm) {
    this.movieModalElement = document.querySelector(this.selectors.movieModalSelector)
    this.movieModalContentElement = document.querySelector(this.selectors.movieModalContentSelector)
    this.movieModalCloseButton = document.querySelector(this.selectors.movieModalCloseButtonSelector)
    this.movieModalPosterElement = document.querySelector(this.selectors.movieModalPosterSelector)
    this.movieModalTitleElement = document.querySelector(this.selectors.movieModalTitleSelector)
    this.movieModalYearElement = document.querySelector(this.selectors.movieModalYearSelector)
    this.movieModalRatingElement = document.querySelector(this.selectors.movieModalRatingSelector)
    this.movieModalOverviewElement = document.querySelector(this.selectors.movieModalOverviewSelector)

    this.searchForm = searchForm

    this.bindEvents()
  }

  // Handle movie card click event
  onMovieCardClick(e) {
    this.handleCardActivation(e.currentTarget)
  }

  // Handle keyboard navigation for movie cards (Enter/Space)
  onMovieCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this.handleCardActivation(e.currentTarget)
    }
  }

  // Extract movie ID and open modal
  handleCardActivation(cardElement) {
    const movieId = cardElement.dataset.jsMovieCard
    this.openModal(movieId)
  }

  // Clear movie modal info
  clearModalInfo() {
    this.movieModalPosterElement.src = ''
    this.movieModalPosterElement.alt = ''
    this.movieModalTitleElement.textContent = ''
    this.movieModalYearElement.textContent = ''
    this.movieModalRatingElement.textContent = ''
    this.movieModalOverviewElement.textContent = ''
  }

  // Update movie modal info
  updateModalInfo(movieInfo) {
    this.clearModalInfo()

    const title = movieInfo.title || 'Unknown Title'
    const year = movieInfo.release_date ? new Date(movieInfo.release_date).getFullYear() : 'N/A'
    const rating = movieInfo.vote_average ? Math.round(movieInfo.vote_average * 10) / 10 : 0
    const overview = movieInfo.overview || 'Overview not found'
    const posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`

    this.movieModalTitleElement.textContent = title
    this.movieModalYearElement.textContent = year
    this.movieModalRatingElement.textContent = rating
    this.movieModalOverviewElement.textContent = overview
    this.movieModalPosterElement.src = posterUrl
    this.movieModalPosterElement.alt = title
  }

  // Open modal and lock body scroll
  openModal(movieId) {
    const movieInfo = this.searchForm.getMovieById(movieId)

    if (!movieInfo) {
      console.error(`Movie with ID ${movieId} not found`)
      return
    }

    this.updateModalInfo(movieInfo)

    this.movieModalElement.showModal()
    document.documentElement.classList.add(this.stateClasses.isLock)
  }

  // Close modal and unlock body scroll
  closeModal() {
    this.movieModalElement.close()
    document.documentElement.classList.remove(this.stateClasses.isLock)
  }

  // Close modal when clicking outside content area (backdrop)
  onMovieModalContentClick(e) {
    if (!this.movieModalContentElement.contains(e.target)) {
      this.closeModal()
    }
  }

  // Bind modal event listeners
  bindEvents() {
    this.movieModalCloseButton.addEventListener('click', () => this.closeModal())
    this.movieModalElement.addEventListener('click', (e) => this.onMovieModalContentClick(e))
  }
}

export default Modals