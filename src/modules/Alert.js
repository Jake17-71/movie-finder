class Alert {
  selectors = {
    alert: '[data-js-alert]',
    closeButton: '[data-js-alert-close]',
  }

  stateClasses = {
    isVisible: 'is-visible',
  }

  alertConfig = {
    autoCloseDelay: 5000,
    animationDuration: 300,
  }

  icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
  }

  constructor() {
    this.alertElement = null
    this.closeButtonElement = null
    this.autoCloseTimer = null
    this.hideTimer = null
  }

  createAlertElement(message, type = 'info') {
    const alert = document.createElement('div')
    alert.className = `alert alert--${type}`
    alert.dataset.jsAlert = ''
    alert.setAttribute('role', 'alert')
    alert.setAttribute('aria-live', 'polite')

    alert.innerHTML = `
      <div class="alert__icon" aria-hidden="true">
        ${this.icons[type] || this.icons.info}
      </div>
      <div class="alert__content">
        <p class="alert__message">${this.escapeHtml(message)}</p>
      </div>
      <button
        type="button"
        class="alert__close"
        aria-label="Закрыть уведомление"
        data-js-alert-close
      >
        ${this.icons.close}
      </button>
    `

    return alert
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  removePreviousAlert() {
    if (!this.alertElement) return

    this.clearAutoCloseTimer()
    this.clearHideTimer()

    if (this.closeButtonElement) {
      this.closeButtonElement.removeEventListener('click', this.onCloseButtonClick)
    }
    if (this.alertElement) {
      this.alertElement.removeEventListener('mouseenter', this.onAlertMouseEnter)
      this.alertElement.removeEventListener('mouseleave', this.onAlertMouseLeave)
      this.alertElement.remove()
    }

    this.alertElement = null
    this.closeButtonElement = null
  }

  show(message, type = 'info') {
    this.removePreviousAlert()

    this.alertElement = this.createAlertElement(message, type)
    document.body.appendChild(this.alertElement)

    this.closeButtonElement = this.alertElement.querySelector(this.selectors.closeButton)
    this.bindEvents()

    requestAnimationFrame(() => {
      this.alertElement.classList.add(this.stateClasses.isVisible)
    })

    this.startAutoCloseTimer()
  }

  hide() {
    if (!this.alertElement) return

    this.clearAutoCloseTimer()

    this.alertElement.classList.remove(this.stateClasses.isVisible)

    this.clearHideTimer()
    this.hideTimer = setTimeout(() => {
      if (this.alertElement) {
        this.alertElement.remove()
        this.alertElement = null
        this.closeButtonElement = null
      }
    }, this.alertConfig.animationDuration)
  }

  startAutoCloseTimer() {
    this.clearAutoCloseTimer()

    this.autoCloseTimer = setTimeout(() => {
      this.hide()
    }, this.alertConfig.autoCloseDelay)
  }

  clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer)
      this.autoCloseTimer = null
    }
  }

  clearHideTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
  }

  onCloseButtonClick = () => {
    this.hide()
  }

  onAlertMouseEnter = () => {
    this.clearAutoCloseTimer()
  }

  onAlertMouseLeave = () => {
    this.startAutoCloseTimer()
  }

  bindEvents() {
    if (!this.closeButtonElement || !this.alertElement) return

    this.closeButtonElement.addEventListener('click', this.onCloseButtonClick)
    this.alertElement.addEventListener('mouseenter', this.onAlertMouseEnter)
    this.alertElement.addEventListener('mouseleave', this.onAlertMouseLeave)
  }
}

class AlertCollection {
  constructor() {
    this.alertInstance = new Alert()
  }

  showSuccess(message) {
    this.alertInstance.show(message, 'success')
  }

  showError(message) {
    this.alertInstance.show(message, 'error')
  }

  showInfo(message) {
    this.alertInstance.show(message, 'info')
  }

  showWarning(message) {
    this.alertInstance.show(message, 'warning')
  }

  hide() {
    this.alertInstance.hide()
  }
}

export default AlertCollection