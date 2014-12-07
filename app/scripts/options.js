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

        // Load the settings
        settingsManager.load(uiSettingsManager.populateUserSpecifiedSettings);

        $('.js-add-template-text').click(function() {
            // TODO: Validate args
            // TODO: Validate templates exist

            var $this = $(this);
            var $target = $($this.data('target'));

            // Process the template
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