import appStyle from './../app.css?raw'

window.FRApp = {
  initialized: false,
  started: false,

  isMoving: false,
  initialPopupPosition: {
    x: null,
    y: null,
  },
  currentPopupPosition: {
    x: null,
    y: null,
  },
  prevMousePosition: {
    x: null,
    y: null,
  },

  createRootEl() {
    // console.log('creating root element')
    this.rootElement = document.createElement('div')
    this.rootElement.setAttribute('id', 'ext-font-radar')
    document.body.appendChild(this.rootElement)
  },

  start() {
    if (this.started) {
      return
    }
    if (!this.initialized) {
      this.init()
      this.initialized = true
    }
    // console.log('start')
    this.createRootEl()
    this.bindedOnMouseOver = this.onMouseOver.bind(this)
    document.addEventListener('mouseover', this.bindedOnMouseOver)

    this.initialPopupPosition.x = window.innerWidth - 300 - 50
    this.initialPopupPosition.y = window.innerHeight / 2 - 500 / 2

    this.setPopupPosition(this.initialPopupPosition)

    this.bindedOnMouseDown = this.onMouseDown.bind(this)
    this.bindedOnMouseUp = this.onMouseUp.bind(this)
    this.bindedOnDoubleClick = this.onDoubleClick.bind(this)
    this.bindedOnMouseMove = this.onMouseMove.bind(this)

    this.rootElement.addEventListener('mousedown', this.bindedOnMouseDown)
    this.rootElement.addEventListener('mouseup', this.bindedOnMouseUp)
    this.rootElement.addEventListener('dblclick', this.bindedOnDoubleClick)
    document.body.addEventListener('mousemove', this.bindedOnMouseMove)

    this.started = true
  },

  stop() {
    if (!this.started) {
      return
    }
    // console.log('stop')
    document.body.removeChild(this.rootElement)
    document.removeEventListener('mouseover', this.bindedOnMouseOver)

    this.rootElement.removeEventListener('mousedown', this.bindedOnMouseDown)
    this.rootElement.removeEventListener('mouseup', this.bindedOnMouseUp)
    this.rootElement.removeEventListener('dblclick', this.bindedOnDoubleClick)
    document.body.removeEventListener('mousemove', this.bindedOnMouseMove)
    this.started = false
  },

  init() {
    // console.log('init')
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
      const fontSizeData = createElWithClasses('span', ['fr-data'])
      const fontSizeTitle = createElWithClasses('span', ['fr-title'])
      fontSizeTitle.textContent = 'Font-size'

      // fontWeightWrapper
      const fontWeightWrapper = createElWithClasses('div', ['fr-wrapper', 'font-weight-wrapper'])
      const fontWeightData = createElWithClasses('span', ['fr-data'])
      const fontWeightTitle = createElWithClasses('span', ['fr-title'])
      fontWeightTitle.textContent = 'Font-weight'

      // fontFamilyWrapper
      const fontFamilyWrapper = createElWithClasses('div', ['fr-wrapper', 'font-family-wrapper'])
      const fontFamilyData = createElWithClasses('span', ['fr-data'])

      // lineHeightWrapper
      const lineHeightWrapper = createElWithClasses('div', ['fr-wrapper', 'line-height-wrapper'])
      const lineHeightData = createElWithClasses('span', ['fr-data'])
      const lineHeightTitle = createElWithClasses('span', ['fr-title'])
      lineHeightTitle.textContent = 'Line-height'

      //letter-spacing wrapper
      const letterSpacingWrapper = createElWithClasses('div', ['fr-wrapper', 'letter-spacing-wrapper'])
      const letterSpacinData = createElWithClasses('span', ['fr-data'])
      const letterSpacinTitle = createElWithClasses('span', ['fr-title'])
      letterSpacinTitle.textContent = 'Letter-spacing'

      // fontColorWrapper
      const fontColorWrapper = createElWithClasses('div', ['fr-wrapper', 'font-color-wrapper', ['fr-data']])
      const fontColorData = createElWithClasses('span')
      const fontHEXColorData = createElWithClasses('span')

      // Окошко с визуалтзацией цвета
      const fontColorDot = createElWithClasses('div', ['fr-color-dot'])
      // контейнер для hex & rgba
      const fontColorContent = createElWithClasses('span', ['fr-color-content'])
      const color = `${getComputedStyle(element).color}`
      const hexColor = getRGB(color)

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
      // letterSpacinData
      letterSpacinData.textContent = `${getComputedStyle(element).letterSpacing}`

      // Добавляю заголовки
      lineHeightWrapper.appendChild(lineHeightTitle)
      fontWeightWrapper.appendChild(fontWeightTitle)
      fontSizeWrapper.appendChild(fontSizeTitle)
      letterSpacingWrapper.appendChild(letterSpacinTitle)

      // Добавляю данные о шрифтах
      fontColorWrapper.appendChild(fontColorData)
      fontColorContent.appendChild(fontColorData)
      fontColorContent.appendChild(fontHEXColorData)
      fontColorWrapper.appendChild(fontColorDot)
      lineHeightWrapper.appendChild(lineHeightData)
      fontColorWrapper.appendChild(fontColorContent)
      fontFamilyWrapper.appendChild(fontFamilyData)
      fontWeightWrapper.appendChild(fontWeightData)
      fontSizeWrapper.appendChild(fontSizeData)
      letterSpacingWrapper.appendChild(letterSpacinData)

      // Добавляю контейнеры с заголовками и данными в попап
      popup.appendChild(mask)
      popup.appendChild(fontFamilyWrapper)
      popup.appendChild(fontColorWrapper)
      popup.appendChild(fontWeightWrapper)
      popup.appendChild(fontSizeWrapper)
      popup.appendChild(lineHeightWrapper)
      popup.appendChild(letterSpacingWrapper)

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

  onMouseDown(e) {
    this.isMoving = true
    this.rootElement.style.cursor = 'grabbing'
    this.prevMousePosition.x = e.clientX
    this.prevMousePosition.y = e.clientY
  },

  onMouseUp() {
    this.isMoving = false
    this.rootElement.style.cursor = 'grab'
  },

  onDoubleClick() {
    this.setPopupPosition(this.initialPopupPosition)
  },

  onMouseMove(e) {
    if (!this.isMoving) {
      return
    }

    const deltaMouseX = e.clientX - this.prevMousePosition.x
    const deltaMouseY = e.clientY - this.prevMousePosition.y

    const newPopupPosition = {
      x: this.currentPopupPosition.x + deltaMouseX,
      y: this.currentPopupPosition.y + deltaMouseY,
    }

    this.setPopupPosition(newPopupPosition)

    this.prevMousePosition.x = e.clientX
    this.prevMousePosition.y = e.clientY
  },

  setPopupPosition(position) {
    this.currentPopupPosition.x = position.x
    this.currentPopupPosition.y = position.y

    this.rootElement.style.transform = `translate(${this.currentPopupPosition.x}px, ${this.currentPopupPosition.y}px)`
  },
}
