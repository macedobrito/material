/*global angular */
'use strict';

angular.module('material.router', ['material']).config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.when('', ['$state', function($state) {
        $state.go('home');
    }]);
    $urlRouterProvider.when('/', ['$state', function($state) {
        if (!$state.current.name) {
            $state.go('home');
        } else {
            $state.go('home');
        }
    }]);
    //Deal with trailing slash
    // $urlRouterProvider.rule(function($injector, $location) {
    //     var path = $location.path(),
    //         search = $location.search();
    //
    //     if (path[path.length - 1] === '/') {
    //         if (jQuery.isEmptyObject(search)) {
    //             return path.slice(0, -1);
    //         } else {
    //             var params = [];
    //             angular.forEach(search, function(v, k) {
    //                 params.push(k + '=' + v);
    //             });
    //             return path.slice(0, -1) + '?' + params.join('&');
    //         }
    //     }
    // });
    $stateProvider
        .state('home', {
            url: '/',
            controller: 'homeController',
            controllerAs: 'homeCtrl',
            templateUrl: 'scripts/modules/core/views/page.html',
            data: {
                name: 'TITLE.LANDINGPAGE'
            }
        })
});
