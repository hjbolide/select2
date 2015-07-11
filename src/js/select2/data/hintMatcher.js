define([
    '../utils',
    '../diacritics',
    './matcher',
    'jquery'
], function (Utils, DIACRITICS, TextMatcher, $) {
    function HintMatcher (options) {
        HintMatcher.__super__.constructor.call(this, options);
    }

    Utils.Extend(HintMatcher, TextMatcher);

    HintMatcher.prototype.shouldSkipMatch = function (params) {
        return false;
    };

    HintMatcher.prototype.match = function (params, data) {
        if ($(data.element).data('hidden')) {
            return null;
        }
        return data;
    };

    return HintMatcher;
});
