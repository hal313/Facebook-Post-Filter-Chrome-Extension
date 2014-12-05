'use strict';

// TODO: CLOSURE
// TODO: Get the post type and allow filtering by type, author, etc.
// TODO: Advanced config for hidden text (show match?)


//chrome.runtime.sendMessage({method: "getSettings"}, function(response) {
//    console.log(response.status);
//});


chrome.storage.sync.get(function(settings) {
    // TODO: Get default objects from default file?
//    console.log('settings', settings);

    var extractFeedItems = function() {
        // TODO: Get from config/options?
        // _4-u2 mbm _5jmm _5pat _5v3q _2l4l
        // _4-u2 mbm _5jmm _5pat _5v3q _x72
        return $('._4-u2.mbm._5jmm._5pat._5v3q');
    }


    var extractText = function(feedItem) {
        return $(feedItem).find('.userContent').first()[0].innerText;
    };

    var isMatch = function(text, matcher) {
        return new RegExp(matcher, 'i').test(text);
    };

    var getRegexes = function() {
        // TODO: Get from config
//        return [
//            {regex: 'e', name: 'contains an e'},
//            {regex: 'say', name: 'contains say'}
//        ];
        return [
            {regex: settings.regex, name: settings.name}
        ];
    };

// TODO: Option (-1 is infinite)
    var removedItemsLimit = -1;

// TODO: Remove 'text' and 'regex' param
// TODO: Rename as removeFeedItem
    var handleRemove = function($feedItem, text, regex) {

        if (0 !== removedItemsLimit) {
            if (!$feedItem.data('removed')) {

                // Mark this item as processed
                $feedItem.data('removed', true);

                // Create a new item
                // TODO: CLOSURE!
                // TODO: Add close button
                // TODO: Break out settings into separate object with constants

                // Fade out the post
                $feedItem.hide();

                // Insert the new item
                if (!!settings['show-header']) {
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

    $(function() {

        // Register an observer for the DOM
        var observer = new MutationObserver(function(mutations, observer) {

            // Get the feed items
            var $feedItems = extractFeedItems();

            $feedItems.each(function(index, feedItem) {
                var $feedItem = $(feedItem);
                var text = extractText($feedItem);
                $.each(getRegexes(), function(i, regex) {
                    if (isMatch(text, regex.regex)) {
                        handleRemove($feedItem, text, regex);
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

