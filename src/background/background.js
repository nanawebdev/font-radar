let appStarted = {}

function isAppStarted(tabId) {
  return appStarted[tabId] === true
}

function startApp(tabId) {
  return (appStarted[tabId] = true)
}

function stopApp(tabId) {
  return (appStarted[tabId] = false)
}

function setIcon(tabId) {
  if (isAppStarted(tabId)) {
    chrome.action.setIcon({ path: '/images/logo128.png' })
  } else {
    chrome.action.setIcon({ path: '/images/inactive.png' })
  }
}

chrome.runtime.onStartup.addListener(() => {
  console.log('startup')
  chrome.action.setIcon({ path: '/images/inactive.png' })
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('installed')
  chrome.action.setIcon({ path: '/images/inactive.png' })
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  setIcon(activeInfo.tabId)
})

chrome.action.onClicked.addListener((tab) => {
  console.log('on icon click', appStarted)
  console.log(chrome)
  if (isAppStarted(tab.id)) {
    stopApp(tab.id)

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: stop,
    })
  } else {
    startApp(tab.id)

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: start,
    })
  }

  setIcon(tab.id)
})

function start() {
  window.FRApp.start()
}

function stop() {
  window.FRApp.stop()
}
