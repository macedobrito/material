/*global angular */
'use strict';
var app = angular.module('material.services');
app.factory('imageService', function($http, $q, baseUrl, serviceModules, serviceCollections) {
    return {
        postImage: function(image, name) {
            var deferred = $q.defer();
            var formData = new FormData();
            formData.append('file', image);
            formData.append('name', name);
            //TODO change to baseUrl
            $http.post('http://localhost:3000/api/file', formData, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(function(data) {
                deferred.resolve(data);
                return deferred.promise;
            });
            return deferred.promise;
        },
        getImage: function(id) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: baseUrl.getUrl(
                    serviceModules.images, [{collection:'', value:id}]
                )
            }).then(function(data) {
                deferred.resolve(data);
                return deferred.promise;
            }, function() {
                deferred.reject;
                return deferred.promise;
            });
            return deferred.promise;
        },
    };
});
