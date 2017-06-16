/*global angular */
'use strict';

var app = angular.module('material');
app.controller('productsController', function($scope, $mdDialog) {
    var productController = $scope;
    productController.openCreateDialog = function(ev) {
        $mdDialog.show({
                controller: createProductCrontroller,
                templateUrl: 'scripts/modules/core/views/createProduct.html',
                parent: angular.element(document.body),
                multiple: true,
                targetEvent: ev,
                clickOutsideToClose: true,
                skipHide: true,
                preserveScope: true,
                onRemoving: function(event, removePromise) {
                    console.log(event, removePromise);
                },
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    function createProductCrontroller($scope, $mdDialog, $translate, $timeout, $rootScope) {
        $timeout(function() {
            const myModule = require('./scripts/modules/core/dragAndDrop');
        });

        $scope.nextTab = function() {
            var forms = [];
            angular.forEach($scope.editProduct, function(form, name) {
                console.log(form)
                if (name.indexOf('formly_') === 0) {
                    forms.push(form);
                }
            });
            $scope.selectedIndex++;
        }
    }
});
