class Modals {

  selectors = {
    movieModalSelector: `[data-js-movie-modal]`,
    movieModalContentSelector: `[data-js-movie-modal-content]`,
    movieModalCloseButtonSelector: `[data-js-movie-modal-close]`,
  }

  stateClasses = {
    isLock: 'is-lock',
  }

  constructor () {
    this.movieModalElement = document.querySelector(this.selectors.movieModalSelector)
    this.movieModalContentElement = document.querySelector(this.selectors.movieModalContentSelector)
    this.movieModalCloseButton = document.querySelector(this.selectors.movieModalCloseButtonSelector)

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

  // Open modal and lock body scroll
  openModal(movieId) {
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