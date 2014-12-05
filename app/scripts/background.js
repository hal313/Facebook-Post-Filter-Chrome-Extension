'use strict';

// Listen for installs
chrome.runtime.onInstalled.addListener(function (details) {
  //console.log('previousVersion', details.previousVersion);
});

//chrome.storage.sync.get(function(settings) {
//    console.log('background page got', settings);
//});

//chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//    if (request.method == "getSettings") {
//        chrome.storage.sync.get(function(settings) {
//            console.log('background page got', settings);
//            sendResponse(settings);
//        });
//    } else {
//        sendResponse({});
//    }
//});