const rootSelector = '[data-js-input-mask]'

class Example {
  selectors = {
    root: rootSelector,
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.bindEvent()
  }

  bindEvent() {}
}

class ExampleCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Example(element)
    })
  }
}

export default ExampleCollection