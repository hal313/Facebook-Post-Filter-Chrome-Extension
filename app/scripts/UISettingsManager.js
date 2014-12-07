/*global jQuery:false */
/*global console:false */
/*global TemplateManager:false */

// TODO: Make singleton
// TODO: Make a jquery plugin
// TODO: Use logger instead of console

// DEPS: jQuery, TemplateManager

var UISettingsManager = function(templateManager) {
    'use strict';

    var _templateManager = templateManager || new TemplateManager();

    var _get$UIComponent = function(name) {
        var $uiComponent = jQuery('[data-setting-name=' + name + ']');
        var elementCount = $uiComponent.length;
        var returnValue = $uiComponent;

        if (0 === elementCount) {
            console.warn('No UI elements found for', name);
            returnValue = null;
        } else if (1 < elementCount) {
            console.warn('Multiple UI elements found for', name);
            returnValue = null;
        }

        return returnValue;
    };
    var _onNoMatching$UIComponent = function(name, value) {
        console.warn('Could not manipulate setting', name, value, 'because no matching UI element is present in the DOM');
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
    var _populateUserSpecifiedSettings = function(settings) {
        jQuery.each(settings, function(name, value) {
            if ('boolean' === typeof value) { //
                _populateBoolean$UIComponent(name, value);
            } else if (jQuery.isArray(value)) {
                var $root = _get$UIComponent(name);
            if (null !== $root) {
                jQuery.each(value, function(index, arrayValue) {
                        // The template name is stored as a data attribute (template-name)
                        // The element to append to is the root
                        var $keyElement;
                        var $valueElement;
                        var keyName;
                        var valueName;

                        // Create the new element by getting the template and processing it
                        var $newElement;

                        $newElement = jQuery(_templateManager.get($root.data('template-name')).process());

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
                } else {
                    _onNoMatching$UIComponent(name, value);
                }
            } else if (jQuery.isNumeric(value)) {
                _populateNumeric$UIComponent(name, value);
            } else if ('string' === typeof value) {
                _populateString$UIComponent(name, value);
            } else {
                // This is an error, log it
                console.error('Unknown setting type', name, value, typeof value);
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
            var $arrayElements = $uiComponent.find('[data-setting-array-id]');
            var array = [];

            // For each element in the ui array elements, get the key and value and put into an array
            $arrayElements.each(function(index, arrayElement) {
                var $arrayElement = jQuery(arrayElement);
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
            console.warn('Unknown data type for setting', name, returnValue);
            returnValue = $uiComponent.val();
        }

        return returnValue;
    };

    // This gets the settings FROM THE PAGE
    var _getUserSpecifiedSettings = function() {
        var settings = {};

        jQuery('[data-setting-name]').each(function(index, item) {
            // Get the element
            var $item = jQuery(item);

            // Get the setting name
            var name = $item.data('setting-name');

            // Extract the value from the UI component
            var value = _getFrom$UIComponent($item);
            settings[name] = value;
        });

        return settings;
    };

    return {
        getUserSpecifiedSettings: _getUserSpecifiedSettings,
        populateUserSpecifiedSettings: _populateUserSpecifiedSettings

    };
};