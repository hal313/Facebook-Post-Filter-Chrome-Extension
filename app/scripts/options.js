(function() {
    'use strict';

    // TODO: Store in seperate file?
    // TODO: Clear?

    // TODO: Support array for regexes!
    var _defaults = {
        'regex': 'cat',
        'name': 'The Cat',
        'show-header': true,
        'show-name-in-header': true
    };

    var _saveSetings = function() {
        var settings = $.extend({}, _defaults);

        $('[data-setting-name]').each(function(index, item) {
            var $item = $(item);
            var name = $item.data('setting-name');
            var value = $item.val();

            console.log('name', name, 'value', value);
            if ('checkbox' === $item[0].type) {
                console.log('checkbox!');
                settings[name] = $item.is(':checked');
            } else {
                settings[name] = value;
            }
        });

        chrome.storage.sync.set(settings, function() {
            $('#js-settings-saved-modal').modal({keyboard: true});
        });
    };

    var _loadSettings = function() {
        chrome.storage.sync.get(_defaults, function(settings){
            var _settings = $.extend({}, _defaults, settings);

            $('[data-setting-name]').each(function(index, item) {
                var $item = $(item);
                var name = $item.data('setting-name');
                var value = _settings[name];

                if ('checkbox' === $item[0].type) {
                    $item.prop('checked', value);
                } else {
                    $item.val(settings[name]);
                }

            });

        });
    };

    $(function() {

        // Load the settings
        _loadSettings();

        $('#js-save-button').click(function() {
            _saveSetings();
        });
    });

})();
