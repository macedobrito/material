/* global angular */
'use strict';

angular.module('material.directives').directive('productCard', function() {
    return {
        restrict: 'E',
        templateUrl: 'scripts/directives/product-card/views/productCard.html',
        scope: {
            card: '=',
            showRemoveButton: '@',
            removeFunction: '&',
            showCardButton: '@',
            showCardFunction: '&',
            index:'@'
        }
    };
});
