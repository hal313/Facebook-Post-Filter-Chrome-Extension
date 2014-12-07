// TODO: Make singleton

var SettingsManager = function() {

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
            }

        ],
        'show-header': true,
        'show-name-in-header': true,
        // TODO: Validate this is being used after being changed
        'feed-item-selector': '._4-u2.mbm._5jmm._5pat._5v3q',
        'feed-item-remove-limit': 25
    };

    var _getDefaultSettings = function() {
        return _defaultSettings;
    };

    var _load = function(callback) {
        chrome.storage.sync.get(_getDefaultSettings(), function(settings){
            if ($.isFunction(callback)) {
                callback(settings);
            }
        });
    };

    var _save = function(settings, callback) {
        chrome.storage.sync.set(settings, function() {
            if($.isFunction(callback)) {
                callback();
            }
        });
    };

    var _clear = function(callback) {
        chrome.storage.sync.clear(function() {
            chrome.storage.sync.set(_getDefaultSettings(), callback);
        });
    };

    return {
        getDefaultSettings: _getDefaultSettings,
        load: _load,
        save: _save,
        clear: _clear
    };

};