const rootSelector = '[data-js-theme-change]'
const bodyElement = document.body

class ThemeChange {
  selectors = {
    root: rootSelector,
    button: `[data-js-theme-button]`,
    toggle: `[data-js-theme-button-toggle]`,
  }

  stateClasses = {
    isActive: 'is-active',
    light: 'light',
  }

  icons = {
    moon: `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
\t viewBox="0 0 512 512" xml:space="preserve">
<circle style="fill:#E5E5E5;" cx="256" cy="256" r="244.87"/>
<g>
\t<circle style="fill:#AFAFAF;" cx="77.913" cy="256" r="22.261"/>
\t<circle style="fill:#AFAFAF;" cx="144.696" cy="367.304" r="44.522"/>
\t<circle style="fill:#AFAFAF;" cx="367.304" cy="211.478" r="66.783"/>
</g>
<path d="M437.02,74.98C388.667,26.628,324.381,0,256,0S123.333,26.628,74.98,74.98C26.628,123.333,0,187.62,0,256
\ts26.628,132.667,74.98,181.02C123.333,485.372,187.619,512,256,512s132.667-26.628,181.02-74.98C485.372,388.667,512,324.38,512,256
\tS485.372,123.333,437.02,74.98z M256,489.739C127.116,489.739,22.261,384.884,22.261,256S127.116,22.261,256,22.261
\tS489.739,127.116,489.739,256S384.884,489.739,256,489.739z"/>
<path d="M256,44.522c-48.272,0-95.484,16.691-132.939,46.999c-4.779,3.867-5.518,10.876-1.651,15.654
\tc2.199,2.718,5.415,4.129,8.658,4.129c2.459,0,4.935-0.811,6.994-2.479C170.571,81.714,212.808,66.783,256,66.783
\tc6.146,0,11.13-4.983,11.13-11.13S262.146,44.522,256,44.522z"/>
<path d="M99.286,130.753c2.119,1.881,4.756,2.805,7.384,2.805c3.072,0,6.131-1.264,8.329-3.743l0.158-0.176
\tc4.115-4.567,3.749-11.605-0.818-15.72c-4.566-4.115-11.606-3.749-15.718,0.818l-0.27,0.302
\tC94.268,119.638,94.688,126.672,99.286,130.753z"/>
<path d="M111.304,256c0-18.412-14.979-33.391-33.391-33.391S44.522,237.588,44.522,256s14.979,33.391,33.391,33.391
\tS111.304,274.412,111.304,256z M77.913,267.13c-6.137,0-11.13-4.993-11.13-11.13c0-6.137,4.993-11.13,11.13-11.13
\ts11.13,4.993,11.13,11.13C89.043,262.137,84.05,267.13,77.913,267.13z"/>
<path d="M144.696,311.652c-30.687,0-55.652,24.966-55.652,55.652s24.966,55.652,55.652,55.652s55.652-24.966,55.652-55.652
\tS175.382,311.652,144.696,311.652z M144.696,400.696c-18.412,0-33.391-14.979-33.391-33.391s14.979-33.391,33.391-33.391
\ts33.391,14.979,33.391,33.391S163.108,400.696,144.696,400.696z"/>
<path d="M367.304,133.565c-42.961,0-77.913,34.952-77.913,77.913s34.952,77.913,77.913,77.913s77.913-34.952,77.913-77.913
\tS410.266,133.565,367.304,133.565z M367.304,267.13c-30.687,0-55.652-24.966-55.652-55.652s24.966-55.652,55.652-55.652
\ts55.652,24.966,55.652,55.652S397.991,267.13,367.304,267.13z"/>
</svg>`,
    sun: `<?xml version="1.0" encoding="iso-8859-1"?>
<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
\t viewBox="0 0 512 512" xml:space="preserve">
<circle style="fill:#FFFE9F;" cx="256" cy="256" r="133.565"/>
<path d="M256,111.304c-79.785,0-144.696,64.91-144.696,144.696S176.215,400.696,256,400.696S400.696,335.785,400.696,256
\tS335.785,111.304,256,111.304z M256,378.435c-67.511,0-122.435-54.924-122.435-122.435S188.489,133.565,256,133.565
\tS378.435,188.489,378.435,256S323.511,378.435,256,378.435z"/>
<path d="M256,155.826c-30.337,0-58.709,13.527-77.837,37.112c-3.872,4.774-3.141,11.784,1.633,15.656
\tc2.062,1.673,4.541,2.487,7.004,2.487c3.239,0,6.451-1.407,8.651-4.119c14.885-18.351,36.953-28.875,60.55-28.875
\tc6.147,0,11.13-4.983,11.13-11.13S262.147,155.826,256,155.826z"/>
<path d="M172.533,222.851c-5.946-1.514-12.003,2.104-13.532,8.045c-0.006,0.02-0.028,0.108-0.033,0.129
\tc-1.496,5.949,2.113,11.954,8.058,13.467c0.916,0.233,1.833,0.344,2.737,0.344c4.965,0,9.502-3.363,10.795-8.389
\tc0.006-0.02,0.028-0.108,0.033-0.129C182.087,230.368,178.479,224.364,172.533,222.851z"/>
<path d="M256,89.043c6.147,0,11.13-4.983,11.13-11.13V11.13C267.13,4.983,262.147,0,256,0s-11.13,4.983-11.13,11.13v66.783
\tC244.87,84.06,249.853,89.043,256,89.043z"/>
<path d="M256,422.957c-6.147,0-11.13,4.983-11.13,11.13v66.783c0,6.147,4.983,11.13,11.13,11.13s11.13-4.983,11.13-11.13v-66.783
\tC267.13,427.94,262.147,422.957,256,422.957z"/>
<path d="M122.203,137.944c2.174,2.174,5.022,3.26,7.87,3.26c2.848,0,5.698-1.086,7.87-3.26c4.346-4.346,4.346-11.394,0-15.741
\tL90.722,74.98c-4.346-4.346-11.394-4.346-15.742,0c-4.346,4.346-4.346,11.394,0,15.741L122.203,137.944z"/>
<path d="M389.797,374.056c-4.346-4.346-11.394-4.346-15.742,0c-4.346,4.346-4.346,11.394,0,15.741l47.222,47.222
\tc2.174,2.174,5.022,3.26,7.87,3.26c2.848,0,5.698-1.086,7.87-3.26c4.346-4.346,4.346-11.394,0-15.741L389.797,374.056z"/>
<path d="M89.043,256c0-6.147-4.983-11.13-11.13-11.13H11.13C4.983,244.87,0,249.853,0,256s4.983,11.13,11.13,11.13h66.783
\tC84.06,267.13,89.043,262.147,89.043,256z"/>
<path d="M500.87,244.87h-66.783c-6.147,0-11.13,4.983-11.13,11.13s4.983,11.13,11.13,11.13h66.783c6.147,0,11.13-4.983,11.13-11.13
\tS507.017,244.87,500.87,244.87z"/>
<path d="M122.203,374.056l-47.222,47.222c-4.346,4.346-4.346,11.394,0,15.741c2.174,2.174,5.022,3.26,7.87,3.26
\ts5.698-1.086,7.87-3.26l47.222-47.222c4.346-4.346,4.346-11.394,0-15.741C133.597,369.71,126.55,369.71,122.203,374.056z"/>
<path d="M381.926,141.204c2.848,0,5.698-1.086,7.87-3.26l47.222-47.222c4.346-4.346,4.346-11.394,0-15.741
\tc-4.346-4.346-11.394-4.346-15.742,0l-47.222,47.222c-4.346,4.346-4.346,11.394,0,15.741
\tC376.23,140.117,379.078,141.204,381.926,141.204z"/>
</svg>`,
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.buttonElement = this.rootElement.querySelector(this.selectors.button)
    this.toggleElement = this.rootElement.querySelector(this.selectors.toggle)

    this.loadTheme()
    this.updateIcon()
    this.bindEvent()
  }

  onButtonClick() {
    const isLightNow = bodyElement.classList.contains(this.stateClasses.light)
    bodyElement.classList.toggle(this.stateClasses.light)
    this.toggleElement.classList.toggle(this.stateClasses.isActive)

    localStorage.setItem('theme', isLightNow ? 'dark' : 'light')

    this.updateIcon()
  }

  updateIcon() {
    const isLightNow = bodyElement.classList.contains(this.stateClasses.light)
    this.toggleElement.innerHTML = isLightNow ? this.icons.sun : this.icons.moon
  }

  loadTheme() {
    try {
      const savedTheme = localStorage.getItem('theme')

      if (savedTheme === null) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const themeToSet = prefersDark ? 'dark' : 'light'

        localStorage.setItem('theme', themeToSet)

        if (themeToSet === 'light') {
          bodyElement.classList.add(this.stateClasses.light)
          this.toggleElement.classList.add(this.stateClasses.isActive)
        }
      } else {
        if (savedTheme === 'light') {
          bodyElement.classList.add(this.stateClasses.light)
          this.toggleElement.classList.add(this.stateClasses.isActive)
        }
      }
    } catch (error) {
      console.log("Load Theme error:", error)
    }
  }

  bindEvent() {
    this.buttonElement.addEventListener('click', () => this.onButtonClick())
  }
}

class ThemeChangeCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new ThemeChange(element)
    })
  }
}

export default ThemeChangeCollection