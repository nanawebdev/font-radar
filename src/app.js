import appStyle from './app.css?raw'

export const FRApp = {
  createRootEl() {
    console.log('creating root element')
    this.rootElement = document.createElement('div')
    this.rootElement.setAttribute('id', 'ext-font-radar')
    document.body.appendChild(this.rootElement)
  },
  start() {
    console.log('start')
    this.createRootEl()
    this.bindedOnMouseOver = this.onMouseOver.bind(this)
    document.addEventListener('mouseover', this.bindedOnMouseOver)
  },
  stop() {
    console.log('stop')
    document.body.removeChild(this.rootElement)
    document.removeEventListener('mouseover', this.bindedOnMouseOver)
  },
  init() {
    console.log('init')
    this.addStyles()
  },
  addStyles() {
    const stylesEl = document.createElement('style')
    stylesEl.textContent = appStyle
    document.head.appendChild(stylesEl)
  },
  onMouseOver(evt) {
    const element = evt.target

    function createPopup(rootElement) {
      const popup = document.createElement('div')

      // fontSizeWrapper
      const fontSizeWrapper = createElWithClasses('div', ['fr-wrapper', 'font-size-wrapper'])
      const fontSizeData = createElWithClasses('span')
      const fontSizeTitle = createElWithClasses('span', ['fr-title'])
      fontSizeTitle.textContent = 'Font-size'

      // fontWeightWrapper
      const fontWeightWrapper = createElWithClasses('div', ['fr-wrapper', 'font-weight-wrapper'])
      const fontWeightData = createElWithClasses('span')
      const fontWeightTitle = createElWithClasses('span', ['fr-title'])
      fontWeightTitle.textContent = 'Font-weight'

      // fontFamilyWrapper
      const fontFamilyWrapper = createElWithClasses('div', ['fr-wrapper', 'font-family-wrapper'])
      const fontFamilyData = createElWithClasses('span')
      const fontFamilyTitle = createElWithClasses('span', ['fr-title'])
      fontFamilyTitle.textContent = 'Font-family'

      // lineHeightWrapper
      const lineHeightWrapper = createElWithClasses('div', ['fr-wrapper', 'line-height-wrapper'])
      const lineHeightData = createElWithClasses('span')
      const lineHeightTitle = createElWithClasses('span', ['fr-title'])
      lineHeightTitle.textContent = 'Line-height'

      // fontColorWrapper
      const fontColorWrapper = createElWithClasses('div', ['fr-wrapper', 'font-color-wrapper'])
      const fontColorData = createElWithClasses('span')
      const fontColorDot = createElWithClasses('span', ['fr-color-dot'])
      const fontColorDataWithDot = createElWithClasses('span', ['fr-color-content'])
      fontColorDataWithDot.appendChild(fontColorDot)
      fontColorDataWithDot.appendChild(fontColorData)

      const fontHEXColorData = createElWithClasses('span')
      const color = `${getComputedStyle(element).color}`
      const hexColor = getRGB(color)
      const fontColorTitle = createElWithClasses('span', ['fr-title'])
      fontColorTitle.textContent = 'Font-color'

      // маска
      const mask = createElWithClasses('div', ['fr-popup-mask'])

      function getRGB(color) {
        const startOfrgb = color.indexOf('(') + 1
        const endOfRgb = color.indexOf(')')
        const rgb = color.slice(startOfrgb, endOfRgb).split(',')
        const r = Number(rgb[0])
        const g = Number(rgb[1])
        const b = Number(rgb[2])
        return rgbToHex(r, g, b)
      }

      function rgbToHex(r, g, b) {
        const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
        return hex
      }

      popup.classList.add('font-radar-popup')

      // fontSizeWrapper
      fontSizeData.textContent = `${getComputedStyle(element).fontSize}`
      // fontWeightWrapper
      fontWeightData.textContent = `${getComputedStyle(element).fontWeight}`
      //fontFamilyWrapper
      fontFamilyData.textContent = `${getComputedStyle(element).fontFamily}`
      //fontColorWrapper
      fontColorData.textContent = color
      fontColorDot.style.backgroundColor = color
      fontHEXColorData.textContent = hexColor
      // lineHeightWrapper
      lineHeightData.textContent = `${getComputedStyle(element).lineHeight}`

      // Добавляю заголовки
      lineHeightWrapper.appendChild(lineHeightTitle)
      fontColorWrapper.appendChild(fontColorTitle)
      fontFamilyWrapper.appendChild(fontFamilyTitle)
      fontWeightWrapper.appendChild(fontWeightTitle)
      fontSizeWrapper.appendChild(fontSizeTitle)

      // Добавляю данные о шрифтах
      lineHeightWrapper.appendChild(lineHeightData)
      fontColorWrapper.appendChild(fontHEXColorData)
      fontColorWrapper.appendChild(fontColorDataWithDot)
      fontFamilyWrapper.appendChild(fontFamilyData)
      fontWeightWrapper.appendChild(fontWeightData)
      fontSizeWrapper.appendChild(fontSizeData)

      // Добавляю контейнеры с заголовками и данными в попап
      popup.appendChild(mask)
      popup.appendChild(fontFamilyWrapper)
      popup.appendChild(fontColorWrapper)
      popup.appendChild(fontWeightWrapper)
      popup.appendChild(fontSizeWrapper)
      popup.appendChild(lineHeightWrapper)

      // popup.setAttribute('draggable', true)

      // console.log(this)
      rootElement.appendChild(popup)
      return popup
    }

    function removePopup(rootElement) {
      const previousPopup = document.querySelector('.font-radar-popup')
      if (previousPopup) {
        rootElement.removeChild(previousPopup)
      }
    }

    if (element.textContent !== '') {
      removePopup(this.rootElement)
      createPopup(this.rootElement)
    }

    function addClasses(element, classes) {
      classes.forEach((elClass) => {
        element.classList.add(elClass)
      })
    }

    function createElWithClasses(tagName, classes = []) {
      const el = document.createElement(tagName)
      addClasses(el, classes)
      return el
    }
  },
}