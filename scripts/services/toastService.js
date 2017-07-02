/*global angular */
'use strict';

var app = angular.module('material.services');

app.factory('toastService', function ($mdToast) {
    var canShow = false, firstTime = true;

    function showToastMessage(message, templateUrl) {
        var toast = $mdToast.build(
            {
                templateUrl: templateUrl,
                hideDelay: 3000,
                position: 'top right',
                controller: function ($scope) {
                    $scope.closeToast = function () {
                        $mdToast.hide(toast)
                    };
                    this.message = message;
                },
                controllerAs: 'toast'
            }
        );
        if(canShow || firstTime) {
            firstTime = false;
            canShow = false;
            $mdToast.show(toast).then(function () {
                canShow = true;
            });
        }
    }

    return {
        success: function (message) {
            var templateUrl = 'scripts/modules/core/views/toast-success.html';
            showToastMessage(message, templateUrl);
        },
        error: function (message) {
          var templateUrl = 'scripts/modules/core/views/toast-error.html';
          showToastMessage(message, templateUrl);
        },
        info: function (message) {
          var templateUrl = 'scripts/modules/core/views/toast-info.html';
          showToastMessage(message, templateUrl);
        }
    };
});
