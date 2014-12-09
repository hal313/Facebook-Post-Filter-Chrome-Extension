/*global jQuery:false */
/*global chrome:false */
/*global console:false */
/*global MutationObserver:false */

// TODO: Use logger instead of console
// TODO: Get the post type and allow filtering by type, author, etc.
// TODO: Advanced config for hidden text (show match?)
// TODO: Add jshintrc
// TODO: Write tests for this package and all github packages
// TODO: Build correctly
// TODO: Get a new icon
// TODO: Get grunt debug working
// TODO: Use less
// TODO: Use global/typeof window !== "undefined" ? window : this in packages
// TODO: Minimize CSS
// TODO: Add jsdoc
// TODO: README.md files for all github packages
// TODO: Update other chrome extensions with github packages
// TODO: Add 'click to show/click to hide'
// TODO: Do I need /bower.json?
// TODO: Remove from bitbucket

(function() {
    'use strict';

    chrome.storage.sync.get(function(settings) {

        // Get the feed items from the page
        var extractFeedItems = function() {
            return jQuery(settings['feed-item-selector']);
        };

        // Extract the user content from the feed item
        var extractText = function(feedItem) {
            return jQuery(feedItem).find('.userContent').first()[0].innerText;
        };

        // Determine if the text matches
        var isMatch = function(text, matcher) {
            // TODO: Cache the regexes!
            return new RegExp(matcher, 'i').test(text);
        };

        // Get the regexes to use (from the settings)
        var getRegexes = function() {
            return settings.regexes;
        };

        var removedItemsLimit = settings['feed-item-remove-limit'];

        var removeFeedItem = function($feedItem, text, regex) {
            var removed = false;

            // Check to see if the limit has been reached
            if (0 !== removedItemsLimit) {

                // Check to see if the item has been processed
                if (!$feedItem.data('removed')) {

                    // Mark this item as processed
                    $feedItem.data('removed', true);

                    // Create a new item
                    // TODO: CLOSURE!
                    // TODO: Add dismiss button to header

                    // Hide the feed item
                    // TODO: .fadeOut() instead? (as option)
                    $feedItem.fadeOut();
//                    $feedItem.hide();

                    // Insert the new item
                    if (!!settings['show-header']) {
                        // TODO: New option for hidden header text?
                        var headerText = 'Hidden';
                        if (!!settings['show-name-in-header']) {
                            headerText += ' [' + regex.name + ']';
                        }
                        var $newItem = jQuery('<div class="removed content-hidden">' + headerText + '</div>');

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

                    removed = true;
                }
            }

            return removed;
        };

        // On load, start the replacements
        jQuery(function() {

            var totalRemovedItemsCount = 0;

            // Register an observer for the DOM
            var observer = new MutationObserver(function(/*mutations, observer*/) {

                var startTime = new Date().getTime();
                var iterationRemovedItemsCount = 0;

                // Get the feed items
                var $feedItems = extractFeedItems();

                // For each feed item, determine if it needs to be replaced
                $feedItems.each(function(index, feedItem) {
                    // Get as a jQuery object
                    var $feedItem = jQuery(feedItem);

                    // Get the text
                    var text = extractText($feedItem);

                    // Test against all regular expressions
                    jQuery.each(getRegexes(), function(i, regex) {
                        // If it matches, remove it
                        if (isMatch(text, regex.regex)) {
                            if(removeFeedItem($feedItem, text, regex)) {
                                iterationRemovedItemsCount++;
                                totalRemovedItemsCount++;
                            }
                        }
                    });
                });
                console.log('-', new Date().getTime() - startTime, 'ms', iterationRemovedItemsCount, totalRemovedItemsCount);
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

})();