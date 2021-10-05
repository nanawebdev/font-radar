import './popup-style.css'
import { FRApp } from './../app'

const extStarter = document.getElementById('fr-starter')

let isStarted = false

extStarter.addEventListener('click', async () => {
  console.log('extStarter')

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  extStarter.textContent = isStarted ? 'Start' : 'Stop'
  const fn = isStarted ? destroy : init
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: fn,
  })
  isStarted = !isStarted
})

function createApp() {
  if (window.FRApp) {
    return
  }
  window.FRApp = FRApp

  FRApp.init()
}

function init() {
  createApp()
  window.FRApp.start()
}

function destroy() {
  window.FRApp.stop()
}
