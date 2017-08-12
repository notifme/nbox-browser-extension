/* global chrome */

chrome.runtime.onInstalled.addListener(function (object) {
  if (chrome.runtime.OnInstalledReason.INSTALL === object.reason) {
    chrome.tabs.create({url: 'https://nbox.notif.me?ref=crxbg&installed=1'});
  }
});
