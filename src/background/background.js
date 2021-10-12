// состояние приложения в разных вкладках
// {
//   [tabId]: true | false
// }
let appStarted = {}

// при старте браузера расширение выключено
chrome.runtime.onStartup.addListener(() => {
  setInactiveIcon()
})

// при установке расширения оно сначала выключено
chrome.runtime.onInstalled.addListener(() => {
  setInactiveIcon()
})

// при переключении на другой таб, проверяем, было ли там включено расширение
// синхронизируем состояние с иконкой
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (isAppStarted(activeInfo.tabId)) {
    setActiveIcon()
  } else {
    setInactiveIcon()
  }
})

// после загрузки страницы, проверяем, было ли включено расширение
// если да, то стартуем приложение
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    if (isAppStarted(tabId)) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: start,
      })
    }
  }
})

chrome.action.onClicked.addListener((tab) => {
  toggleStartStop(tab.id)
})

function start() {
  window.FRApp.start()
}

function stop() {
  window.FRApp.stop()
}

function toggleStartStop(tabId) {
  if (isAppStarted(tabId)) {
    stopApp(tabId)

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: stop,
    })

    setInactiveIcon()
  } else {
    startApp(tabId)

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: start,
    })

    setActiveIcon()
  }
}

function isAppStarted(tabId) {
  return appStarted[tabId] === true
}

function startApp(tabId) {
  return (appStarted[tabId] = true)
}

function stopApp(tabId) {
  return (appStarted[tabId] = false)
}

function setInactiveIcon() {
  chrome.action.setIcon({ path: '/images/inactive.png' })
}

function setActiveIcon() {
  chrome.action.setIcon({ path: '/images/active.png' })
}
