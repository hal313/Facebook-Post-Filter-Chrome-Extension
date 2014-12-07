var UISettingsManager = function(templateManager) {

// TODO: Break out into ui package/jquery plugin
// TODO: Take selector? Or not...
    var _get$UIComponent = function(name) {
        var $uiComponent = $('[data-setting-name=' + name + ']');
        var elementCount = $uiComponent.length;
        var returnValue = $uiComponent;

        if (0 === elementCount) {
            console.warn('no elements found for', name);
            returnValue = null;
        } else if (1 < elementCount) {
            console.warn('multiple elements found for', name);
            returnValue = null;
        }

        return returnValue;
    };
    var _onNoMatching$UIComponent = function(name, value) {
        console.warn('could not populate setting', name, value, 'because there was no ui element');
    };
    var _populateString$UIComponent = function(name, value) {
        var $uiComponent = _get$UIComponent(name);
        if (null !== $uiComponent) {
            $uiComponent.val(value);
        } else {
            _onNoMatching$UIComponent(name, value);
        }
    };
    var _populateBoolean$UIComponent = function(name, value) {
        // See if the setting is a checkbox
        var $item = _get$UIComponent(name);
        if (null !== $item) {
            if ('checkbox' === $item[0].type) {
                $item.prop('checked', value);
            } else {
                _populateString$UIComponent(name, value);
            }
        } else {
            _onNoMatching$UIComponent(name, value);
        }
    };
    var _populateNumeric$UIComponent = function(name, value) {
        _populateString$UIComponent(name, value);
    };
// For each setting, attempt to find a ui component that matches and populate it based on formatting rules
    var populateUserSpecifiedSettings = function(settings) {
        $.each(settings, function(name, value) {
            if ('boolean' === typeof value) { //
                _populateBoolean$UIComponent(name, value);
            } else if ($.isArray(value)) {
                var $root = _get$UIComponent(name);
                $.each(value, function(index, arrayValue) {
                    // The template name is stored as a data atribute (template-name)
                    // The element to append to is the root
                    var $keyElement;
                    var $valueElement;
                    var keyName;
                    var valueName;

                    // Create the new element
//                        var $newElement = $(templateManager.get($root.data('template-name')).process([{regex: 'regex-id', replacement: regexItemCount++}]));
//                        var $newElement = $(templateManager.get($root.data('template-name')).process([{regex: 'regex-id', replacement: _getNextRegexId}]));
                    var $newElement = $(templateManager.get($root.data('template-name')).process());

                    // Append the new element
                    $root.append($newElement);

                    // Set the key and value for the new element
                    //
                    // Get the key and value elements
                    $keyElement = $newElement.find('[data-setting-array-key]');
                    $valueElement = $newElement.find('[data-setting-array-value]');
                    // Get the values from the elements (the array indices)
                    keyName = $keyElement.data('setting-array-key');
                    valueName = $valueElement.data('setting-array-value');
                    //
                    // Set the values
                    $keyElement.val(arrayValue[keyName]);
                    $valueElement.val(arrayValue[valueName]);
                });
            } else if ($.isNumeric(value)) {
                _populateNumeric$UIComponent(name, value)
            } else if ('string' === typeof value) {
                _populateString$UIComponent(name, value)
            } else {
                // This is an error, log it
                console.error('unknown setting type', name, value, typeof value);
            }
        });
    };


// Gets user specified settings from the UI and returns a settings object
    var _getFrom$UIComponent = function($uiComponent) {
        var name = $uiComponent.data('setting-name');
        var returnValue = $uiComponent.val();

        if ('boolean' === $uiComponent.data('setting-type') || 'checkbox' === $uiComponent[0].type) {
            if ('checkbox' === $uiComponent[0].type) {
                returnValue = $uiComponent.is(':checked');
            } else {
                returnValue = 'true' === $uiComponent.val().toLowerCase();
            }
        } else if ('number' === $uiComponent.data('setting-type') || 'number' === $uiComponent[0].type) {
            returnValue = parseInt($uiComponent.val());
        } else if ('string' === $uiComponent.data('setting-type') || 'text' === $uiComponent[0].type) {
            returnValue = $uiComponent.val();
        } else if ('array' === $uiComponent.data('setting-type')) {
            // TODO: SET based on array key/value
            // TODO: SET based on type (use data-setting-type)
            var $arrayElements = $uiComponent.find('[data-setting-array-id]');
            var array = [];
            $arrayElements.each(function(index, arrayElement) {
                var $arrayElement = $(arrayElement);
                var id = $arrayElement.data('setting-array-id');
                // TODO: Check for only one!
                var $keyElement = $arrayElement.find('[data-setting-array-key]');
                var $valueElement = $arrayElement.find('[data-setting-array-value]');
                var keyName = $keyElement.data('setting-array-key');
                var key = $keyElement.val();
                var valueName = $valueElement.data('setting-array-value');
                var value = $valueElement.val();
                var keyValidate = $keyElement.data('setting-array-key-validate');
                var item = {};
                item[keyName] = key;
                item[valueName] = value;

                // Skip if the key is empty and empty:ignore is specified
                if (0 !== key.trim().length || 'empty:ignore' !== keyValidate) {
                    array.push(item);
                }
            });
            returnValue = array;
        } else {
            console.warn('unknown data type for setting', name, value);
            returnValue = $uiComponent.val();
        }

        return returnValue;
    };

// This gets the settings FROM THE PAGE
    var getUserSpecifiedSettings = function() {
        var settings = {};
        $('[data-setting-name]').each(function(index, item) {
            var $item = $(item);
            var name = $item.data('setting-name');
            var value = _getFrom$UIComponent($item);
            settings[name] = value;
        });
        return settings;
    };

    return {
        getUserSpecifiedSettings: getUserSpecifiedSettings,
        populateUserSpecifiedSettings: populateUserSpecifiedSettings

    };
};