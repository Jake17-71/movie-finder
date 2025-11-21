import { TabsSelectors } from '@/types'

const rootSelector: string = '[data-js-tabs]'

class Tabs {
  private readonly selectors: TabsSelectors = {
    root: rootSelector,
    button: `[data-js-tabs-button]`,
    content: `[data-js-tabs-content]`,
  }

  private readonly stateClasses: { isActive: string } = {
    isActive: 'is-active',
  }

  private readonly stateAttributes: { ariaSelected: string; tabIndex: string } =
    {
      ariaSelected: 'aria-selected',
      tabIndex: 'tabindex',
    }

  private rootElement: HTMLElement
  private readonly buttonElements: NodeListOf<HTMLButtonElement>
  private contentElements: NodeListOf<HTMLDivElement>
  private readonly state: { activeTabIndex: number }
  private readonly limitTabsIndex: number

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement
    this.buttonElements = this.rootElement.querySelectorAll<HTMLButtonElement>(
      this.selectors.button
    )
    this.contentElements = this.rootElement.querySelectorAll<HTMLDivElement>(
      this.selectors.content
    )
    this.state = {
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClasses.isActive)
      ),
    }
    this.limitTabsIndex = this.buttonElements.length - 1
    this.bindEvent()
  }

  updateUI(): void {
    const { activeTabIndex } = this.state

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive: boolean = index === activeTabIndex

      buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
      buttonElement.setAttribute(
        this.stateAttributes.ariaSelected,
        isActive.toString()
      )
      buttonElement.setAttribute(
        this.stateAttributes.tabIndex,
        isActive ? '0' : '-1'
      )
    })

    this.contentElements.forEach((contentElement, index) => {
      const isActive: boolean = index === activeTabIndex

      contentElement.classList.toggle(this.stateClasses.isActive, isActive)
    })
  }

  activeTab(newTabIndex: number): void {
    this.state.activeTabIndex = newTabIndex
    const buttonElement = this.buttonElements[newTabIndex]
    if (buttonElement) {
      buttonElement.focus()
    }
  }

  previousTab = (): void => {
    const newTabIndex: number =
      this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1

    this.activeTab(newTabIndex)
  }

  nextTab = (): void => {
    const newTabIndex: number =
      this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1

    this.activeTab(newTabIndex)
  }

  firstTab = (): void => {
    this.activeTab(0)
  }

  lastTab = (): void => {
    this.activeTab(this.limitTabsIndex)
  }

  onButtonClick(buttonIndex: number): void {
    this.state.activeTabIndex = buttonIndex
    this.updateUI()
  }

  onKeyDown = (event: KeyboardEvent): void => {
    // Ignore keyboard events from interactive elements
    if (!event.target) {
      return
    }

    const target = event.target as HTMLElement
    if (target.matches('input, textarea, select')) {
      return
    }

    const { code, metaKey } = event

    const action: (() => void) | undefined = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code]

    const isMacHomeKey: boolean = metaKey && code === 'ArrowLeft'
    if (isMacHomeKey) {
      this.firstTab()
      this.updateUI()
      return
    }
    const isMacEndKey: boolean = metaKey && code === 'ArrowRight'
    if (isMacEndKey) {
      this.lastTab()
      this.updateUI()
      return
    }

    if (action) {
      action()
      this.updateUI()
    }
  }

  bindEvent(): void {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener('click', () => this.onButtonClick(index))
    })
    this.rootElement.addEventListener('keydown', this.onKeyDown)
  }
}

class TabsCollection {
  constructor() {
    this.init()
  }

  init(): void {
    document.querySelectorAll<HTMLElement>(rootSelector).forEach((element) => {
      new Tabs(element)
    })
  }
}

export default TabsCollection