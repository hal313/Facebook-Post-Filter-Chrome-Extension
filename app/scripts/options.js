/*global jQuery:false */
/*global TemplateManager:false */
/*global SettingsManager:false */
/*global UISettingsManager:false */

// TODO: Use SettingsManager callbacks

(function() {
    'use strict';

    // At load time
    jQuery(function() {

        var _getNextRegexId = function() {
            if (!_getNextRegexId.seed) {
                _getNextRegexId.seed = 0;
            }
            return _getNextRegexId.seed++;
        };

        var _defaultSettings = {
            'regexes': [
                {
                    'regex': '\\bcat\\b|\\bkittens\\b|\\bkitty\\b',
                    'name': 'Hello Kitty!'
                },
                {
                    'regex': '\\bfeet\\b|\\bbeach\\b|\\bocean\\b|\\bsand\\b',
                    'name': 'Feet in the sand'
                },
                {
                    'regex': '\\bbabies\\b|\\binfant\\b|\\bkids\\b',
                    'name': 'Babies'
                }
            ],
            'show-header': true,
            'show-name-in-header': true,
            'feed-item-selector': '._4-u2.mbm._5jmm._5pat._5v3q',
            'feed-item-remove-limit': 25
        };

        // Pass in a default resolver map, keyed by the template name
        var templateManager = new TemplateManager({'regex-template': [{regex: 'regex-id', replacement: _getNextRegexId}]});
        var settingsManager = new SettingsManager(_defaultSettings);
        var uiSettingsManager = new UISettingsManager(templateManager);

        // Load the settings
        settingsManager.load(uiSettingsManager.populateUserSpecifiedSettings);

        jQuery('.js-add-template-text').click(function() {
            // TODO: Validate args
            // TODO: Validate templates exist

            var $this = jQuery(this);
            var $target = jQuery($this.data('target'));

            // Process the template
            var templateContent = templateManager.get($this.data('template-name')).process();

            // Add the template
            $target.append(jQuery(templateContent));
        });

        jQuery('#js-regex-container').on('click', '.js-remove-button', function() {
            jQuery(jQuery(this).data('target-selector')).remove();
        });

        // Kick off the 'save settings' flow
        jQuery('#js-save-button').click(function() {
            settingsManager.save(uiSettingsManager.getUserSpecifiedSettings(), function() {
                settingsManager.load(function(settings) {
                    jQuery("#js-regex-container").empty();
                    uiSettingsManager.populateUserSpecifiedSettings(settings);
                    jQuery('#js-settings-saved-modal').modal({keyboard: true});
                });
            });
        });

        // Open the reset modal (which may kick off the 'reset settings' flow)
        jQuery('#js-reset-button').click(function() {
            jQuery('#js-settings-confirm-reset-modal').modal({keyboard: true});
        });

        // Kick off the 'reset settings' flow (reset, confirm, reload)
        jQuery('#js-confirm-reset-button').click(function() {
            // Reset the settings and close the modal
            settingsManager.clear(function() {
                settingsManager.save(settingsManager.getDefaultSettings(), function() {
                    // Add a listener to reload the user settings hen the success dialog is shown
                    jQuery('#js-settings-confirm-reset-modal').one('hidden.bs.modal', function() {
                        settingsManager.load(function(settings) {
                            // Empty the array container
                            jQuery("#js-regex-container").empty();
                            uiSettingsManager.populateUserSpecifiedSettings(settings);
                        });
                    });

                    // Hide the confirm modal
                    jQuery('#js-settings-confirm-reset-modal').modal('hide');

                    // Show the reset modal
                    jQuery('#js-settings-reset-modal').modal({keyboard: true});
                });
            });

        });

    });

})();