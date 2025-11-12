class Modals {

  selectors = {
    movieCardSelector: `[data-js-movie-card]`,
    movieModalSelector: `[data-js-movie-modal]`,

    movieModalContentSelector: `[data-js-movie-modal-content]`,
    movieModalCloseButtonSelector: `[data-js-movie-modal-close]`,
  }

  stateClasses = {
    isLock: 'is-lock',
  }

  constructor () {
    this.movieCardElements = document.querySelectorAll(this.selectors.movieCardSelector)
    this.movieModalElement = document.querySelector(this.selectors.movieModalSelector)

    this.movieModalContentElement = document.querySelector(this.selectors.movieModalContentSelector)
    this.movieModalCloseButton = document.querySelector(this.selectors.movieModalCloseButtonSelector)

    this.bindEvents()
  }

  onMovieCardClick(e) {
    const cardElement = e.currentTarget
    const movieId = cardElement.dataset.jsMovieCard

    this.openModal(movieId)
  }

  onMovieCardKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const cardElement = e.currentTarget
      const movieId = cardElement.dataset.jsMovieCard

      this.openModal(movieId)
    }
  }

  openModal(movieId) {
    this.movieModalElement.showModal()
    document.documentElement.classList.add(this.stateClasses.isLock)
  }

  closeModal() {
    this.movieModalElement.close()
    document.documentElement.classList.remove(this.stateClasses.isLock)
  }

  onModalCloseButtonClick() {
    this.closeModal()
  }

  onMovieModalContentClick(e) {
    if (!this.movieModalContentElement.contains(e.target)) {
      this.closeModal()
    }
  }

  bindEvents() {
    this.movieCardElements.forEach((card) => {
      card.addEventListener('click', (e) => this.onMovieCardClick(e))
      card.addEventListener('keydown', (e) => this.onMovieCardKeyDown(e))
    })

    this.movieModalCloseButton.addEventListener('click', () => this.onModalCloseButtonClick())
    this.movieModalElement.addEventListener('click', (e) => this.onMovieModalContentClick(e))
  }
}

export default Modals