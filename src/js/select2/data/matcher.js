define([
    '../utils',
    '../diacritics',
    'jquery'
], function (Utils, DIACRITICS, $) {
    function stripDiacritics (text) {
        function match (a) {
            return DIACRITICS[a] || a;
        }

        return text.replace(/[^\u0000-\u007E]/g, match);
    }

    function TextMatcher (options) {
        this.options = options || {};
    }

    TextMatcher.prototype.shouldSkipMatch = function (params) {
        return $.trim(params.term) === '';
    };

    TextMatcher.prototype.matcher = function (params, data) {
        if (this.shouldSkipMatch(params)) {
            return data;
        }

        // Do a recursive check for options with children
        if (data.children && data.children.length > 0) {
            // Clone the data object if there are children
            // This is required as we modify the object to remove any non-matches
            var match = $.extend(true, {}, data);

            // Check each child of the option
            for (var c = data.children.length - 1; c >= 0; c--) {
                var child = data.children[c];

                var matches = this.matcher(params, child);

                // If there wasn't a match, remove the object in the array
                if (matches == null) {
                    match.children.splice(c, 1);
                }
            }

            // If any children matched, return the new object
            if (match.children.length > 0) {
                return match;
            }

            // If there were no matching children, check just the plain object
            return this.matcher(params, match);
        }

        return this.match(params, data);
    };

    TextMatcher.prototype.match = function (params, data) {
        var original = stripDiacritics(data.text).toUpperCase();
        var term = stripDiacritics(params.term).toUpperCase();
        if (original.indexOf(term) > -1) {
            return data;
        }

        return null;
    };
    return TextMatcher;
});
