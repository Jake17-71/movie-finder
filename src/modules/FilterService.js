class FilterService {
  // Apply all client-side filters to movies array
  applyFilters(movies, filters) {
    let results = movies

    results = this.filterByGenre(results, filters)
    results = this.filterByRating(results, filters)
    results = this.filterByYearRange(results, filters)

    return results
  }

  // Filter movies by genre ID
  filterByGenre(movies, filters) {
    if (!filters.genre) return movies

    return movies.filter(movie =>
      movie.genre_ids && movie.genre_ids.includes(parseInt(filters.genre))
    )
  }

  // Filter movies by minimum rating
  filterByRating(movies, filters) {
    if (!filters.rating) return movies

    return movies.filter(movie =>
      movie.vote_average && movie.vote_average >= parseFloat(filters.rating)
    )
  }

  // Filter movies by year range
  filterByYearRange(movies, filters) {
    const { yearFrom, yearTo } = filters

    if (!yearFrom && !yearTo) return movies

    return movies.filter(movie => {
      if (!movie.release_date) return false

      const movieYear = new Date(movie.release_date).getFullYear()
      const minYear = yearFrom ? parseInt(yearFrom) : -Infinity
      const maxYear = yearTo ? parseInt(yearTo) : Infinity

      return movieYear >= minYear && movieYear <= maxYear
    })
  }

  // Extract filters from FormData
  extractFiltersFromFormData(formData) {
    return {
      genre: formData.get('movie-genre'),
      yearFrom: formData.get('movie-year-from'),
      yearTo: formData.get('movie-year-to'),
      rating: formData.get('movie-rating'),
    }
  }
}

export default FilterService
