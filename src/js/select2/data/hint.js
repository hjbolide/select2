define([
    './select',
    '../utils',
    'jquery'
], function (SelectAdapter, Utils, $) {
    function HintAdapter ($element, options) {
        HintAdapter.__super__.constructor.call(this, $element, options);
    }

    Utils.Extend(HintAdapter, SelectAdapter);

    HintAdapter.prototype.select = function (data) {
        var self = this;

        data.selected = true;

        var $elem = $(data.element);

        // If data.element is a DOM node, use it instead
        if ($elem.is('option')) {
            data.element.selected = true;
            $elem.data('hidden', true);

            this.$element.trigger('change');

            return;
        }

        if (this.$element.prop('multiple')) {
            this.current(function (currentData) {
                var val = [];

                data = [data];
                data.push.apply(data, currentData);

                for (var d = 0; d < data.length; d++) {
                    var id = data[d].id;

                    if ($.inArray(id, val) === -1) {
                        val.push(id);
                    }
                }

                self.$element.val(val);
                self.$element.trigger('change');
            });
        } else {
            var val = data.id;

            this.$element.val(val);
            this.$element.trigger('change');
        }
    };

    HintAdapter.prototype.unselect = function (data) {
        var self = this;

        if (!this.$element.prop('multiple')) {
            return;
        }

        data.selected = false;

        var $elem = $(data.element);

        if ($elem.is('option')) {
            data.element.selected = false;
            $elem.data('hidden', false);

            this.$element.trigger('change');

            return;
        }

        this.current(function (currentData) {
            var val = [];

            for (var d = 0; d < currentData.length; d++) {
                var id = currentData[d].id;

                if (id !== data.id && $.inArray(id, val) === -1) {
                    val.push(id);
                }
            }

            self.$element.val(val);

            self.$element.trigger('change');
        });
    };

    HintAdapter.prototype.query = function (params, callback) {
        var data = [];
        var self = this;

        var $options = this.$element.children();

        $options.each(function () {
            var $option = $(this);

            if (!$option.is('option') && !$option.is('optgroup')) {
                return;
            } else if ($option.data('hidden')) {
                return;
            }

            var option = self.item($option);
            if (params && params.term) {
                $.each(option.children, function (i, m) {
                    m.text = Utils.capitalize(m.id) + ': ' + params.term;
                });
            }
            var matches = self.matches(params, option);

            if (matches != null) {
                data.push(matches);
            }
        });

        callback({
            results: data
        });
    };

    return HintAdapter;
});
