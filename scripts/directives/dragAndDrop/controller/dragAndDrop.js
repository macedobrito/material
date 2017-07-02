/*global angular */
'use strict';
angular.module('material.directives').directive('dragAndDrop', function() {
    return {
        restrict: 'AE',
        scope: {
            object: '=',
            abc: '@'
        },
        controller: "dragAndDropController",
        link: function(scope, element, attr) {
            element[0].ondragover = () => {
                element.addClass('drag-style')
                return false;

            };

            element[0].ondragleave = () => {
                element.removeClass('drag-style');
                return false;
            };

            element[0].ondragend = () => {
                element.removeClass('drag-style');
                return false;
            };

            element[0].ondrop = (e) => {
                e.preventDefault();
                element.removeClass('drag-style');
                for (let f of e.dataTransfer.files) {
                  scope.object.url = f.path;
                    console.log('File(s) you dragged here: ', f.path)
                }

                return false;
            };
        }
    };
}).controller('dragAndDropController', ['$scope', function($scope) {
  console.log($scope)
}]);
