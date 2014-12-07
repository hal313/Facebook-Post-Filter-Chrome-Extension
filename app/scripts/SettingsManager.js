/*global jQuery:false */
/*global chrome:false */

// TODO: Make singleton
// TODO: Safe callbacks
// DEPS: jQuery

var SettingsManager = function() {
    'use strict';

    // TODO: Load in separate file?
    var _defaultSettings = {
        'regexes': [
            {
                'regex': 'cat|kittens|kitty',
                'name': 'Feline'
            },
            {
                'regex': 'feet',
                'name': 'Feet'
            },
            {
                'regex': 'babies|infant|kids',
                'name': 'Babies'
            }
        ],
        'show-header': true,
        'show-name-in-header': true,
        'feed-item-selector': '._4-u2.mbm._5jmm._5pat._5v3q',
        'feed-item-remove-limit': 25
    };

    var _getDefaultSettings = function() {
        return _defaultSettings;
    };

    var _load = function(successCallback, errorCallback) {
        chrome.storage.sync.get(_getDefaultSettings(), function(settings){
            if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                errorCallback();
            } else if (jQuery.isFunction(successCallback)) {
                successCallback(settings);
            }
        });
    };

    var _save = function(settings, successCallback, errorCallback) {
        chrome.storage.sync.set(settings, function() {
            if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                errorCallback();
            } else if(jQuery.isFunction(successCallback)) {
                successCallback();
            }
        });
    };

    var _clear = function(successCallback, errorCallback) {
        chrome.storage.sync.clear(function() {
            if (chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                errorCallback();
            } else {
                chrome.storage.sync.set(_getDefaultSettings(), function() {
                    if(chrome.runtime.lastError && jQuery.isFunction(errorCallback)) {
                        errorCallback();
                    } else if(jQuery.isFunction(successCallback)) {
                        successCallback();
                    }
                });
            }
        });
    };

    return {
        getDefaultSettings: _getDefaultSettings,
        load: _load,
        save: _save,
        clear: _clear
    };

};