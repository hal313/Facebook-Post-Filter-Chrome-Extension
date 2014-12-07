// TODO: Make singleton

var TemplateManager = function(defaultResolverMap) {

    // Load the templates
    var templateCache = [];

    var _hasLoaded = false;

    var _load = function() {
        // Get all the scripts
        var $scripts = $('script');

        // Add each template into the cache
        $scripts.each(function(index, script) {
            var $script;
            var name;
            var content;

            // Check to see if the script tyoe is 'text/template'
            if ('text/template' === script.type) {
                $script = $(script);
                name = $script.data('name').trim();
                content = script.innerHTML.trim();

                if (0 !== name.length) {
                    templateCache[name] = content;
                } else {
                    // Output warning (no name)
                    console.warn('Template has no name');
                }
            }
        });

        _hasLoaded = true;
    };

    var _raw = function(templateName, template) {
        return template;
    };

    var _process = function(templateName, template, resolverMap) {
        var processedTemplateString = template;

        var _resolverMap = [];

        if (defaultResolverMap && defaultResolverMap[templateName]) {
            $.each(defaultResolverMap[templateName], function(index, resolver) {
                _resolverMap.push(resolver);
            });
        }

        if (resolverMap) {
            $.each(resolverMap, function(index, resolver) {
                _resolverMap.push(resolver);
            });
        }
console.log('resolvermap', _resolverMap);
        if (0 !== _resolverMap.length) {
            $.each(_resolverMap, function(index, resolver) {
                // TODO: Regex caching?
                var regex = new RegExp('{' + resolver.regex + '}', 'gi');
console.log('', resolver.regex);
                var replacement = resolver.replacement;
                // We allow functions for the replacement!
                if ($.isFunction(resolver.replacement)) {
                    replacement = resolver.replacement();
                }
                processedTemplateString = processedTemplateString.replace(regex, replacement);
            });
        }

        return processedTemplateString;
    };

    var _get = function(name) {
        // return templateCache[name];
        var rawTemplate;

        if (!_hasLoaded) {
            _load();
        }

        rawTemplate = templateCache[name];

        return {
            process: function(resolverMap) {
                return _process(name, rawTemplate, resolverMap);
            },
            raw: function() {
                return _raw(name, rawTemplate);
            }
        };
    }

    return {
        load: _load,
        //reload: _load,
        get: _get
        //remove: // TODO: Implement remove?
        //add: // TODO: Implement add?
    };

};