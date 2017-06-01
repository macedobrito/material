/*global angular */
'use strict';

function config($translateProvider) {
    $translateProvider
        .useStaticFilesLoader({
            prefix: 'scripts/modules/i18n/locale-',
            suffix: '.json'
        })
        .fallbackLanguage('en')
        .preferredLanguage('en')
        .useSanitizeValueStrategy('escapeParameters');
}

angular.module('WMT.translations', ['WMT']).config(config);

angular.$inject = ['$translateProvider'];
