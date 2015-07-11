define(['jquery', '../dist/js/select2.full'], function ($, select2) {
    $('select.search_options').select2({hint: true, hint_matcher: true});
});

