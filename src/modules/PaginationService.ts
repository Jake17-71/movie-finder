import type { TMDBResponse, PaginationInfo } from '@/types'

class PaginationService {
  private currentPage: number = 1
  private totalPages: number = 0
  private totalResults: number = 0

  // Update pagination info from API response
  update(apiResponse: TMDBResponse): void {
    this.currentPage = apiResponse.page
    this.totalPages = apiResponse.total_pages
    this.totalResults = apiResponse.total_results
  }

  // Reset pagination to initial state
  reset(): void {
    this.currentPage = 1
    this.totalPages = 0
    this.totalResults = 0
  }

  // Check if there are more pages to load
  hasMorePages(): boolean {
    return this.currentPage < this.totalPages
  }

  // Get next page number
  getNextPage(): number | null {
    return this.hasMorePages() ? this.currentPage + 1 : null
  }

  // Get current pagination info
  getInfo(): PaginationInfo {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      totalResults: this.totalResults,
    }
  }
}

export default PaginationService