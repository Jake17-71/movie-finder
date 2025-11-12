class SearchForm {

  selectors = {
    manualFormSelector: `[data-js-manual-form]`,
    filtersButtonSelector: `[data-js-filters-button]`,
    filtersContentSelector: `[data-js-filters-content]`,

    filtersRangeSelector: `[data-js-filters-range]`,
    filtersRangeOutputSelector: `[data-js-filters-range-output]`,
  }

  stateClasses = {
    isActive: 'is-active',
  }

  constructor () {
    this.manualFormElement = document.querySelector(this.selectors.manualFormSelector)

    this.filtersButtonElement = document.querySelector(this.selectors.filtersButtonSelector)
    this.filtersContentElement = document.querySelector(this.selectors.filtersContentSelector)

    this.filtersRangeElement = document.querySelector(this.selectors.filtersRangeSelector)
    this.filtersRangeOutputElement = document.querySelector(this.selectors.filtersRangeOutputSelector)

    this.isAnimating = false

    this.bindEvents()
  }

  onInputRangeChange() {
    this.filtersRangeOutputElement.innerText = this.filtersRangeElement.value
  }

  onFiltersButtonClick() {
    if (this.isAnimating) return

    const isExpanded = this.filtersButtonElement.getAttribute('aria-expanded') === 'true'

    if (isExpanded) {
      this.closeFilters()
    } else {
      this.openFilters()
    }
  }

  openFilters() {
    this.isAnimating = true
    this.filtersButtonElement.setAttribute('aria-expanded', 'true')

    this.filtersContentElement.style.display = 'flex'

    this.filtersContentElement.offsetHeight

    requestAnimationFrame(() => {
      this.filtersContentElement.classList.add(this.stateClasses.isActive)
    })

    const transitionDuration = this.getTransitionDuration()
    setTimeout(() => {
      this.isAnimating = false
    }, transitionDuration)
  }

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

  getTransitionDuration() {
    const duration = getComputedStyle(this.filtersContentElement).transitionDuration
    return parseFloat(duration) * 1000
  }

  bindEvents() {
    this.filtersButtonElement.addEventListener('click', () => this.onFiltersButtonClick())

    this.filtersRangeElement.addEventListener('input', () => this.onInputRangeChange())
  }
}

export default SearchForm