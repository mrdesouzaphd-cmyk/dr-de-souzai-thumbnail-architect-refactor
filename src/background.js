/**
 * src/background.js – MV3 service worker background script.
 * Opens the side panel when the extension action is clicked.
 * @module background
 */

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error('[background] sidePanel error', err));

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id }).catch(() => {});
});
