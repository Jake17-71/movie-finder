class PaginationService {
  constructor() {
    this.currentPage = 1
    this.totalPages = 0
    this.totalResults = 0
  }

  // Update pagination info from API response
  update(apiResponse) {
    this.currentPage = apiResponse.page
    this.totalPages = apiResponse.total_pages
    this.totalResults = apiResponse.total_results
  }

  // Reset pagination to initial state
  reset() {
    this.currentPage = 1
    this.totalPages = 0
    this.totalResults = 0
  }

  // Check if there are more pages to load
  hasMorePages() {
    return this.currentPage < this.totalPages
  }

  // Get next page number
  getNextPage() {
    return this.hasMorePages() ? this.currentPage + 1 : null
  }

  // Get current pagination info
  getInfo() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalResults: this.totalResults,
    }
  }
}

export default PaginationService
