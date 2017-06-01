/*global angular */
'use strict';

var app = angular.module('material');
app.controller('homeController', function($scope, $mdDialog) {
    $mdDialog.show(
        $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('This is an alert title')
            .textContent('You can specify some description text in here.')
            .ariaLabel('Alert Dialog Demo')
            .ok('Got it!')
            .targetEvent(null)
    );
});
