(function() {
    'use strict';


    // At load time
    $(function() {

        // TODO: Push selector? Set the default settings?
        // TODO: Store in seperate file?
        // TODO: Support array for regexes
        // TODO: Validate settings before save

        // TODO: This will need to be in scope of a lot
        var _getNextRegexId = function() {
            if (!_getNextRegexId.seed) {
                _getNextRegexId.seed = 0;
            }
            return _getNextRegexId.seed++;
        };

        // Pass in a default resolver map, keyed by the template name
        var templateManager = new TemplateManager({'regex-template': [{regex: 'regex-id', replacement: _getNextRegexId}]});
        var settingsManager = new SettingsManager();
        var uiSettingsManager = new UISettingsManager(templateManager);


//        // TODO: Break out into ui package/jquery plugin
//        // TODO: Take selector? Or not...
//        var _get$UIComponent = function(name) {
//            var $uiComponent = $('[data-setting-name=' + name + ']');
//            var elementCount = $uiComponent.length;
//            var returnValue = $uiComponent;
//
//            if (0 === elementCount) {
//                console.warn('no elements found for', name);
//                returnValue = null;
//            } else if (1 < elementCount) {
//                console.warn('multiple elements found for', name);
//                returnValue = null;
//            }
//
//            return returnValue;
//        };
//        var _onNoMatching$UIComponent = function(name, value) {
//            console.warn('could not populate setting', name, value, 'because there was no ui element');
//        };
//        var _populateString$UIComponent = function(name, value) {
//            var $uiComponent = _get$UIComponent(name);
//            if (null !== $uiComponent) {
//                $uiComponent.val(value);
//            } else {
//                _onNoMatching$UIComponent(name, value);
//            }
//        };
//        var _populateBoolean$UIComponent = function(name, value) {
//            // See if the setting is a checkbox
//            var $item = _get$UIComponent(name);
//            if (null !== $item) {
//                if ('checkbox' === $item[0].type) {
//                    $item.prop('checked', value);
//                } else {
//                    _populateString$UIComponent(name, value);
//                }
//            } else {
//                _onNoMatching$UIComponent(name, value);
//            }
//        };
//        var _populateNumeric$UIComponent = function(name, value) {
//            _populateString$UIComponent(name, value);
//        };
//        // Gets user specified settings from the UI and returns a settings object
//        var _getFrom$UIComponent = function($uiComponent) {
//            var name = $uiComponent.data('setting-name');
//            var returnValue = $uiComponent.val();
//
//            if ('boolean' === $uiComponent.data('setting-type') || 'checkbox' === $uiComponent[0].type) {
//                if ('checkbox' === $uiComponent[0].type) {
//                    returnValue = $uiComponent.is(':checked');
//                } else {
//                    returnValue = 'true' === $uiComponent.val().toLowerCase();
//                }
//            } else if ('number' === $uiComponent.data('setting-type') || 'number' === $uiComponent[0].type) {
//                returnValue = parseInt($uiComponent.val());
//            } else if ('string' === $uiComponent.data('setting-type') || 'text' === $uiComponent[0].type) {
//                returnValue = $uiComponent.val();
//            } else if ('array' === $uiComponent.data('setting-type')) {
//                // TODO: SET based on array key/value
//                // TODO: SET based on type (use data-setting-type)
//                var $arrayElements = $uiComponent.find('[data-setting-array-id]');
//                var array = [];
//                $arrayElements.each(function(index, arrayElement) {
//                    var $arrayElement = $(arrayElement);
//                    var id = $arrayElement.data('setting-array-id');
//                    // TODO: Check for only one!
//                    var $keyElement = $arrayElement.find('[data-setting-array-key]');
//                    var $valueElement = $arrayElement.find('[data-setting-array-value]');
//                    var keyName = $keyElement.data('setting-array-key');
//                    var key = $keyElement.val();
//                    var valueName = $valueElement.data('setting-array-value');
//                    var value = $valueElement.val();
//                    var keyValidate = $keyElement.data('setting-array-key-validate');
//                    var item = {};
//                    item[keyName] = key;
//                    item[valueName] = value;
//
//                    // Skip if the key is empty and empty:ignore is specified
//                    if (0 !== key.trim().length || 'empty:ignore' !== keyValidate) {
//                        array.push(item);
//                    }
//                });
//                returnValue = array;
//            } else {
//                console.warn('unknown data type for setting', name, value);
//                returnValue = $uiComponent.val();
//            }
//
//            return returnValue;
//        };
//
//        // For each setting, attempt to find a ui component that matches and populate it based on formatting rules
//        var populateUserSpecifiedSettings = function(settings) {
//            $.each(settings, function(name, value) {
//                if ('boolean' === typeof value) { //
//                    _populateBoolean$UIComponent(name, value);
//                } else if ($.isArray(value)) {
//                    var $root = _get$UIComponent(name);
//                    $.each(value, function(index, arrayValue) {
//                        // The template name is stored as a data atribute (template-name)
//                        // The element to append to is the root
//                        var $keyElement;
//                        var $valueElement;
//                        var keyName;
//                        var valueName;
//
//                        // Create the new element
////                        var $newElement = $(templateManager.get($root.data('template-name')).process([{regex: 'regex-id', replacement: regexItemCount++}]));
////                        var $newElement = $(templateManager.get($root.data('template-name')).process([{regex: 'regex-id', replacement: _getNextRegexId}]));
//                        var $newElement = $(templateManager.get($root.data('template-name')).process());
//
//                        // Append the new element
//                        $root.append($newElement);
//
//                        // Set the key and value for the new element
//                        //
//                        // Get the key and value elements
//                        $keyElement = $newElement.find('[data-setting-array-key]');
//                        $valueElement = $newElement.find('[data-setting-array-value]');
//                        // Get the values from the elements (the array indices)
//                        keyName = $keyElement.data('setting-array-key');
//                        valueName = $valueElement.data('setting-array-value');
//                        //
//                        // Set the values
//                        $keyElement.val(arrayValue[keyName]);
//                        $valueElement.val(arrayValue[valueName]);
//                    });
//                } else if ($.isNumeric(value)) {
//                    _populateNumeric$UIComponent(name, value)
//                } else if ('string' === typeof value) {
//                    _populateString$UIComponent(name, value)
//                } else {
//                    // This is an error, log it
//                    console.error('unknown setting type', name, value, typeof value);
//                }
//            });
//        };
//        // This gets the settings FROM THE PAGE
//        var getUserSpecifiedSettings = function() {
//            var settings = {};
//            $('[data-setting-name]').each(function(index, item) {
//                var $item = $(item);
//                var name = $item.data('setting-name');
//                var value = _getFrom$UIComponent($item);
//                settings[name] = value;
//            });
//            return settings;
//        };

        // Load the settings
        settingsManager.load(uiSettingsManager.populateUserSpecifiedSettings);

        $('.js-add-template-text').click(function() {
            // TODO: Validate args
            // TODO: Validate templates exist

            var $this = $(this);
            var $target = $($this.data('target'));

            // Process the template
//            var templateContent = templateManager.get($this.data('template-name')).process([{'regex': 'regex-id', 'replacement': _getNextRegexId}]);
//            var templateContent = templateManager.get($this.data('template-name')).process([{'regex': 'regex-id', 'replacement': regexItemCount++}]);
            var templateContent = templateManager.get($this.data('template-name')).process();

            // Add the template
            $target.append($(templateContent));
        });

        $('#js-regex-container').on('click', '.js-remove-button', function() {
            $($(this).data('target-selector')).remove();
        });

        // Kick off the 'save settings' flow
        $('#js-save-button').click(function() {
            // TODO: Merge with default settings?
            settingsManager.save(uiSettingsManager.getUserSpecifiedSettings(), function() {
                // TODO: Redraw the form after save
//                $("#js-regex-container").empty();
//                uiSettingsManager.populateUserSpecifiedSettings(settings);
                $('#js-settings-saved-modal').modal({keyboard: true});
            });
        });

        // Open the reset modal (which may kick off the 'reset settings' flow)
        $('#js-reset-button').click(function() {
            $('#js-settings-confirm-reset-modal').modal({keyboard: true});
        });

        // Kick off the 'reset settings' flow (reset, confirm, reload)
        $('#js-confirm-reset-button').click(function() {
            // Reset the settings and close the modal
            settingsManager.clear(function() {
                settingsManager.save(settingsManager.getDefaultSettings(), function() {
                    // Add a listener to reload the user settings hen the success dialog is shown
                    $('#js-settings-confirm-reset-modal').one('hidden.bs.modal', function() {
                        settingsManager.load(function(settings) {
                            // Empty the array container
                            $("#js-regex-container").empty();
                            uiSettingsManager.populateUserSpecifiedSettings(settings);
                        });
                    });

                    // Hide the confirm modal
                    $('#js-settings-confirm-reset-modal').modal('hide');

                    // Show the reset modal
                    $('#js-settings-reset-modal').modal({keyboard: true});
                });
            });

        });

    });

})();