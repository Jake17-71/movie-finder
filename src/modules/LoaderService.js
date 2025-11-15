class LoaderService {
  selectors = {
    loaderAiSelector: `[data-js-ai-loading-spinner]`,
    loaderSelector: `[data-js-loading-spinner]`,
    aiFormSubmitButtonSelector: `[data-js-ai-form-submit]`,
    manualFormSubmitButtonSelector: `[data-js-manual-form-submit]`,
    loadMoreButtonSelector: `[data-js-load-more]`,
  }

  constructor() {
    this.loaderAiElement = document.querySelector(this.selectors.loaderAiSelector)
    this.loaderElement = document.querySelector(this.selectors.loaderSelector)
    this.aiFormSubmitButtonElement = document.querySelector(this.selectors.aiFormSubmitButtonSelector)
    this.manualFormSubmitButtonElement = document.querySelector(this.selectors.manualFormSubmitButtonSelector)
    this.loadMoreButtonElement = document.querySelector(this.selectors.loadMoreButtonSelector)
  }

  // Show AI loader
  showAiLoader() {
    this.loaderAiElement?.removeAttribute('hidden')
  }

  // Hide AI loader
  hideAiLoader() {
    this.loaderAiElement?.setAttribute('hidden', '')
  }

  // Show main loader
  showLoader() {
    this.loaderElement?.removeAttribute('hidden')
  }

  // Hide main loader
  hideLoader() {
    this.loaderElement?.setAttribute('hidden', '')
  }

  // Disable all buttons
  disableButtons() {
    this.loadMoreButtonElement?.setAttribute('disabled', '')
    this.aiFormSubmitButtonElement?.setAttribute('disabled', '')
    this.manualFormSubmitButtonElement?.setAttribute('disabled', '')
  }

  // Enable all buttons
  enableButtons() {
    this.loadMoreButtonElement?.removeAttribute('disabled')
    this.aiFormSubmitButtonElement?.removeAttribute('disabled')
    this.manualFormSubmitButtonElement?.removeAttribute('disabled')
  }
}

export default LoaderService
