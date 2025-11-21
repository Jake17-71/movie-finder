import { LoaderServiceSelectors } from '@/types'

class LoaderService {
  private readonly loaderAiElement: HTMLDivElement
  private readonly loaderElement: HTMLDivElement
  private readonly aiFormSubmitButtonElement: HTMLButtonElement
  private readonly manualFormSubmitButtonElement: HTMLButtonElement
  readonly loadMoreButtonElement: HTMLButtonElement

  private readonly selectors: LoaderServiceSelectors = {
    loaderAiSelector: `[data-js-ai-loading-spinner]`,
    loaderSelector: `[data-js-loading-spinner]`,
    aiFormSubmitButtonSelector: `[data-js-ai-form-submit]`,
    manualFormSubmitButtonSelector: `[data-js-manual-form-submit]`,
    loadMoreButtonSelector: `[data-js-load-more]`,
  }

  constructor() {
    this.loaderAiElement = document.querySelector(
      this.selectors.loaderAiSelector
    ) as HTMLDivElement
    this.loaderElement = document.querySelector(
      this.selectors.loaderSelector
    ) as HTMLDivElement
    this.aiFormSubmitButtonElement = document.querySelector(
      this.selectors.aiFormSubmitButtonSelector
    ) as HTMLButtonElement
    this.manualFormSubmitButtonElement = document.querySelector(
      this.selectors.manualFormSubmitButtonSelector
    ) as HTMLButtonElement
    this.loadMoreButtonElement = document.querySelector(
      this.selectors.loadMoreButtonSelector
    ) as HTMLButtonElement
  }

  // Show AI loader
  showAiLoader(): void {
    this.loaderAiElement.removeAttribute('hidden')
  }

  // Hide AI loader
  hideAiLoader(): void {
    this.loaderAiElement.setAttribute('hidden', '')
  }

  // Show main loader
  showLoader(): void {
    this.loaderElement.removeAttribute('hidden')
  }

  // Hide main loader
  hideLoader(): void {
    this.loaderElement.setAttribute('hidden', '')
  }

  // Disable all buttons
  disableButtons(): void {
    this.loadMoreButtonElement.setAttribute('disabled', '')
    this.aiFormSubmitButtonElement.setAttribute('disabled', '')
    this.manualFormSubmitButtonElement.setAttribute('disabled', '')
  }

  // Enable all buttons
  enableButtons(): void {
    this.loadMoreButtonElement.removeAttribute('disabled')
    this.aiFormSubmitButtonElement.removeAttribute('disabled')
    this.manualFormSubmitButtonElement.removeAttribute('disabled')
  }
}

export default LoaderService