import { languages } from 'eslint-plugin-prettier'

class SearchForm {

  selectors = {
    manualFormSelector: `[data-js-manual-form]`,

    filtersButtonSelector: `[data-js-filters-button]`,
    filtersContentSelector: `[data-js-filters-content]`,
    filtersSelectSelector: `[data-js-filters-select]`,

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
    this.filtersSelectElement = document.querySelector(this.selectors.filtersSelectSelector)

    this.filtersRangeElement = document.querySelector(this.selectors.filtersRangeSelector)
    this.filtersRangeOutputElement = document.querySelector(this.selectors.filtersRangeOutputSelector)

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

    this.loadSelectOptions()
    this.bindEvents()
  }

  loadSelectOptions() {
    this.genresRU.forEach(( {id, name } ) => {
      const option = document.createElement("option")
      option.text = name
      option.value = id

      this.filtersSelectElement.appendChild(option)
    })
  }

  searchByTitle(formData) {
    const baseUrl = 'https://api.themoviedb.org/3/search/movie'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: import.meta.env.VITE_TMDB_TOKEN,
      },
    }

    const params = new URLSearchParams({
      query: formData.get('movie-title').trim(),
      include_adult: 'false',
      language: 'ru-RU',
      page: '1',
    })

    const url = `${baseUrl}?${params.toString()}`

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        const filteredResults = this.applyClientFilters(json.results, formData)
        console.log(filteredResults)
      })
      .catch((err) => console.error(err))
  }

  applyClientFilters(movies, formData) {
    let results = movies

    results = this.filterByGenre(results, formData)
    results = this.filterByRating(results, formData)
    results = this.filterByYearRange(results, formData)

    return results
  }

  filterByGenre(movies, formData) {
    const genre = formData.get('movie-genre')
    if (!genre) return movies

    return movies.filter(movie =>
      movie.genre_ids && movie.genre_ids.includes(parseInt(genre))
    )
  }

  filterByRating(movies, formData) {
    const rating = formData.get('movie-rating')
    if (!rating) return movies

    return movies.filter(movie =>
      movie.vote_average && movie.vote_average >= parseFloat(rating)
    )
  }

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

  searchByFilters(formData) {
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: import.meta.env.VITE_TMDB_TOKEN,
      },
    }

    const params = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language: 'ru-RU',
      page: '1',
      sort_by: 'popularity.desc',
    })

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

    const url = `${baseUrl}?${params.toString()}`

    fetch(url, options)
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.error(err));
  }

  onManualFormSubmitButtonClick(e) {
    e.preventDefault()
    const formData = new FormData(this.manualFormElement)

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const movieTitle = formData.get('movie-title')?.trim()
    const hasTitle = movieTitle && movieTitle.length > 0

    if (hasTitle) {
      // Используем /search/movie
      this.searchByTitle(formData)
    } else {
      // Используем /discover/movie
      this.searchByFilters(formData)
    }
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
    this.manualFormElement.addEventListener('submit', (e) => this.onManualFormSubmitButtonClick(e))

    this.filtersButtonElement.addEventListener('click', () => this.onFiltersButtonClick())

    this.filtersRangeElement.addEventListener('input', () => this.onInputRangeChange())
  }
}

export default SearchForm