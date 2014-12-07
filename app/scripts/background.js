/*global chrome:false */

(function() {
    'use strict';

    // Listen for installs
    chrome.runtime.onInstalled.addListener(function (details) {
        //console.log('previousVersion', details.previousVersion);
    });

})();