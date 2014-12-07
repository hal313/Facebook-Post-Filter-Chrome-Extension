'use strict';

// TODO: CLOSURE
// TODO: Get the post type and allow filtering by type, author, etc.
// TODO: Advanced config for hidden text (show match?)

chrome.storage.sync.get(function(settings) {

    console.log('settings', settings);

    // Get the feed items from the page
    var extractFeedItems = function() {
        return $(settings['feed-item-selector']);
    }

    // Extract the user content from the feed item
    var extractText = function(feedItem) {
        return $(feedItem).find('.userContent').first()[0].innerText;
    };

    // Determine if the text matches
    var isMatch = function(text, matcher) {
        // TODO: Cachce the match regexes!
        return new RegExp(matcher, 'i').test(text);
    };

    // Get the regexes to use (from the settings)
    var getRegexes = function() {
        return settings.regexes;
    };

    var removedItemsLimit = settings['feed-item-remove-limit'];

    // TODO: Remove 'text' and 'regex' param?
    var removeFeedItem = function($feedItem, text, regex) {
        // Check to see if the limit has been reached
        if (0 !== removedItemsLimit) {

            // Check to see if the item has been processed
            if (!$feedItem.data('removed')) {

                // Mark this item as processed
                $feedItem.data('removed', true);

                // Create a new item
                // TODO: CLOSURE!
                // TODO: Add close button?
                // TODO: Break out settings into separate object with constants

                // Fade out the pos
                // TODO: .hide() instead?
                $feedItem.fadeOut();

                // Insert the new item
                if (!!settings['show-header']) {
                    // TODO: New option for hidden text?
                    var headerText = 'Hidden';
                    if (!!settings['show-name-in-header']) {
                        headerText += ' [' + regex.name + ']';
                    }
                    var $newItem = $('<div class="removed content-hidden">' + headerText + '</div>');
                    // var $newItem = $('<div class="removed content-hidden">Hidden [' + regex.name + ']</div>');

                    // Add a click handler on the new item to toggle the feed item
                    $newItem.click(function() {
                        if ($newItem.hasClass('content-hidden')) {
                            $newItem.toggleClass('content-hidden');
                            $feedItem.fadeToggle();
                        } else {
                            $feedItem.fadeToggle(function() {
                                $newItem.toggleClass('content-hidden');
                            });
                        }
                    });

                    $feedItem.before($newItem);
                }

                // Decrement the limit counter
                removedItemsLimit--;
            }
        }
    };

    // On load, start the replacements
    $(function() {

        // Register an observer for the DOM
        var observer = new MutationObserver(function(mutations, observer) {

            // Get the feed items
            var $feedItems = extractFeedItems();

            // For each feed item, determine if it needs to be replaced
            $feedItems.each(function(index, feedItem) {
                // Get as a jQuery object
                var $feedItem = $(feedItem);

                // Get the text
                var text = extractText($feedItem);

                // Test against all regexes
                $.each(getRegexes(), function(i, regex) {
                    // If it matches, remove it
                    if (isMatch(text, regex.regex)) {
                        removeFeedItem($feedItem, text, regex);
                    }
                });
            });

        });

        // Define what element should be observed by the observer
        // and what types of mutations trigger the callback
        // TODO: Use a different root element?
        observer.observe(document, {
            subtree: true,
            childList: true
        });

    });

});

