const extStarter = document.getElementById("fr-starter");

function addStyles() {
  const stylesEl = document.createElement("style");
  stylesEl.textContent = `
    @font-face {
        font-family: "Roboto mono";
        src: url("./RobotoMono-Regular.woff") format("woff"),
        url("./RobotoMono-Regular.woff2") format("woff2");
        font-weight: 400;
    }

    #ext-font-radar {
        z-index: 10000;
        position: fixed;
        top: 50%;
        right: 1%;
        transform: translateY(-50%);
    }
    
    #ext-font-radar .font-radar-popup {
      font-family: "Roboto mono",  monospace;
      display: flex;
      flex-direction: column;
      width: 300px;
      height: auto;
      background-color: #edeef0;
      box-shadow: 1px 3px 5px 0px #6d6d6d;
      padding: 16px 24px;
      padding-bottom: 20px;
      position: relative;
    }
    
    #ext-font-radar .fr-title {
      font-family: "Roboto mono",  monospace;
      font-weight: normal;
      font-size: 12px;
      line-height: 16px;
      font-weight: 400;
      padding-bottom: 6px;
      color: #7A7A7A;
    }
    
    #ext-font-radar .fr-wrapper {
      display: flex;
      flex-direction: column;
      padding-top: 12px;
      text-transform: uppercase;
      font-size: 18px;
      line-height: 22px;
      font-weight: 400;
      color: #000000;
    }

    #ext-font-radar .fr-color-content {
      display: flex;
      align-items: center;
    }

    #ext-font-radar .fr-color-dot {
      display: inline-block;
      width: 15px;
      height: 15px;
      background: transparent;
      border-radius: 50%;
      border: 1px solid #ccc;
      margin-right: 10px;
    }

    #ext-font-radar .fr-wrapper.font-family-wrapper {
      padding-top: 0;
    }

    .fr-popup-mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cccccc;
      opacity: 0;
      z-index: 2;
      background-position: center;
      cursor: pointer;
    }

    .font-radar-popup:hover .fr-popup-mask {
        opacity: 1;
    }
    `;
  document.head.appendChild(stylesEl);
}

let isStarted = false;
extStarter.addEventListener("click", async () => {
  console.log("extStarter");

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  extStarter.textContent = isStarted ? "Start" : "Stop";
  const fn = isStarted ? destroy : init;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fn,
  });
  isStarted = !isStarted;
});

let firstTime = false;

function createApp() {
  if (window.FRApp) {
    return;
  }
  window.FRApp = {
    createRootEl() {
      console.log("creating root element");
      this.rootElement = document.createElement("div");
      this.rootElement.setAttribute("id", "ext-font-radar");
      document.body.appendChild(this.rootElement);
    },
    start() {
      console.log("start");
      this.createRootEl();
      this.bindedOnMouseOver = this.onMouseOver.bind(this);
      document.addEventListener("mouseover", this.bindedOnMouseOver);
    },
    stop() {
      console.log("stop");
      document.body.removeChild(this.rootElement);
      document.removeEventListener("mouseover", this.bindedOnMouseOver);
    },
    init() {
      console.log("init");
      addStyles();
    },
    onMouseOver(evt) {
      const element = evt.target;

      function createPopup(rootElement) {
        const popup = document.createElement("div");

        // fontSizeWrapper
        const fontSizeWrapper = createElWithClasses("div", [
          "fr-wrapper",
          "font-size-wrapper",
        ]);
        const fontSizeData = createElWithClasses("span");
        const fontSizeTitle = createElWithClasses("span", ["fr-title"]);
        fontSizeTitle.textContent = "Font-size";

        // fontWeightWrapper
        const fontWeightWrapper = createElWithClasses("div", [
          "fr-wrapper",
          "font-weight-wrapper",
        ]);
        const fontWeightData = createElWithClasses("span");
        const fontWeightTitle = createElWithClasses("span", ["fr-title"]);
        fontWeightTitle.textContent = "Font-weight";

        // fontFamilyWrapper
        const fontFamilyWrapper = createElWithClasses("div", [
          "fr-wrapper",
          "font-family-wrapper",
        ]);
        const fontFamilyData = createElWithClasses("span");
        const fontFamilyTitle = createElWithClasses("span", ["fr-title"]);
        fontFamilyTitle.textContent = "Font-family";

        // lineHeightWrapper
        const lineHeightWrapper = createElWithClasses("div", [
          "fr-wrapper",
          "line-height-wrapper",
        ]);
        const lineHeightData = createElWithClasses("span");
        const lineHeightTitle = createElWithClasses("span", ["fr-title"]);
        lineHeightTitle.textContent = "Line-height";

        // fontColorWrapper
        const fontColorWrapper = createElWithClasses("div", [
          "fr-wrapper",
          "font-color-wrapper",
        ]);
        const fontColorData = createElWithClasses("span");
        const fontColorDot = createElWithClasses("span", ["fr-color-dot"]);
        const fontColorDataWithDot = createElWithClasses("span", ["fr-color-content"]);
        fontColorDataWithDot.appendChild(fontColorDot);
        fontColorDataWithDot.appendChild(fontColorData);


        const fontHEXColorData = createElWithClasses("span");
        const color = `${getComputedStyle(element).color}`;
        const hexColor = getRGB(color);
        const fontColorTitle = createElWithClasses("span", ["fr-title"]);
        fontColorTitle.textContent = "Font-color";

        // маска
        const mask = createElWithClasses("div", ["fr-popup-mask"]);

        function getRGB(color) {
          const startOfrgb = color.indexOf("(") + 1;
          const endOfRgb = color.indexOf(")");
          const rgb = color.slice(startOfrgb, endOfRgb).split(",");
          const r = Number(rgb[0]);
          const g = Number(rgb[1]);
          const b = Number(rgb[2]);
          return rgbToHex(r, g, b);
        }

        function rgbToHex(r, g, b) {
          const hex =
            "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          return hex;
        }

        popup.classList.add("font-radar-popup");

        // fontSizeWrapper
        fontSizeData.textContent = `${getComputedStyle(element).fontSize}`;
        // fontWeightWrapper
        fontWeightData.textContent = `${getComputedStyle(element).fontWeight}`;
        //fontFamilyWrapper
        fontFamilyData.textContent = `${getComputedStyle(element).fontFamily}`;
        //fontColorWrapper
        fontColorData.textContent = color;
        fontColorDot.style.backgroundColor = color;
        fontHEXColorData.textContent = hexColor;
        // lineHeightWrapper
        lineHeightData.textContent = `${getComputedStyle(element).lineHeight}`;

        // Добавляю заголовки
        lineHeightWrapper.appendChild(lineHeightTitle);
        fontColorWrapper.appendChild(fontColorTitle);
        fontFamilyWrapper.appendChild(fontFamilyTitle);
        fontWeightWrapper.appendChild(fontWeightTitle);
        fontSizeWrapper.appendChild(fontSizeTitle);

        // Добавляю данные о шрифтах
        lineHeightWrapper.appendChild(lineHeightData);
        fontColorWrapper.appendChild(fontHEXColorData);
        fontColorWrapper.appendChild(fontColorDataWithDot);
        fontFamilyWrapper.appendChild(fontFamilyData);
        fontWeightWrapper.appendChild(fontWeightData);
        fontSizeWrapper.appendChild(fontSizeData);

        // Добавляю контейнеры с заголовками и данными в попап
        popup.appendChild(mask);
        popup.appendChild(fontFamilyWrapper);
        popup.appendChild(fontColorWrapper);
        popup.appendChild(fontWeightWrapper);
        popup.appendChild(fontSizeWrapper);
        popup.appendChild(lineHeightWrapper);

        // popup.setAttribute('draggable', true)

        // console.log(this)
        rootElement.appendChild(popup);
        return popup;
      }

      function removePopup(rootElement) {
        const previousPopup = document.querySelector(".font-radar-popup");
        if (previousPopup) {
          rootElement.removeChild(previousPopup);
        }
      }

      if (element.textContent !== "") {
        removePopup(this.rootElement);
        createPopup(this.rootElement);
      }

      function addClasses(element, classes) {
        classes.forEach((elClass) => {
          element.classList.add(elClass);
        });
      }

      function createElWithClasses(tagName, classes = []) {
        const el = document.createElement(tagName);
        addClasses(el, classes);
        return el;
      }
    },
    onMouseMove(evt) { },
  };

  FRApp.init();
}
function init() {
  createApp();
  window.FRApp.start();
}
function destroy() {
  window.FRApp.stop();
}
