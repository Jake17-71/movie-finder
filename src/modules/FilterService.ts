import { Movie, MovieFilters } from '@/types'

class FilterService {
  // Apply all client-side filters to movies array
  applyFilters(movies: Movie[], filters: MovieFilters): Movie[] {
    let results = movies

    results = this.filterByGenre(results, filters)
    results = this.filterByRating(results, filters)
    results = this.filterByYearRange(results, filters)

    return results
  }

  // Filter movies by genre ID
  filterByGenre(movies: Movie[], filters: MovieFilters): Movie[] {
    return movies.filter((movie) => {
      if (filters.genre === undefined) {
        return true
      }
      return movie.genre_ids.includes(parseInt(filters.genre))
    })
  }

  // Filter movies by minimum rating
  filterByRating(movies: Movie[], filters: MovieFilters): Movie[] {
    return movies.filter((movie) => {
      if (filters.rating === undefined) {
        return true
      }
      return movie.vote_average >= parseFloat(filters.rating)
    })
  }

  // Filter movies by year range
  filterByYearRange(movies: Movie[], filters: MovieFilters): Movie[] {
    const { yearFrom, yearTo } = filters

    if (!yearFrom && !yearTo) {
      return movies
    }

    return movies.filter((movie) => {
      if (!movie.release_date) {
        return false
      }

      const movieYear = new Date(movie.release_date).getFullYear()
      const minYear = yearFrom ? parseInt(yearFrom) : -Infinity
      const maxYear = yearTo ? parseInt(yearTo) : Infinity

      return movieYear >= minYear && movieYear <= maxYear
    })
  }

  // Extract filters from FormData
  extractFiltersFromFormData(formData: FormData): MovieFilters {
    return {
      genre: (formData.get('movie-genre') as string | null) ?? undefined,
      yearFrom: (formData.get('movie-year-from') as string | null) ?? undefined,
      yearTo: (formData.get('movie-year-to') as string | null) ?? undefined,
      rating: (formData.get('movie-rating') as string | null) ?? undefined,
    }
  }
}

export default FilterService