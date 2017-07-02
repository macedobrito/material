/*global angular */
'use strict';
var app = angular.module('material.services');
app.factory('productService', function($http, $q, baseUrl, serviceModules, serviceCollections) {
    return {
        getProducts: function() {
            var deferred = $q.defer();
            var promise = $http({
                method: 'GET',
                url: baseUrl.getUrl(
                    serviceModules.products
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
        createProduct: function(name, reference, color, haulPrice, sellPrice, photos) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'POST',
                url: baseUrl.getUrl(
                    serviceModules.products
                ),
                data: {
                  name:name,
                  reference: reference,
                  color: (color) ? color:null,
                  haulPrice: haulPrice,
                  sellPrice: sellPrice,
                  photos: photos
                }
            }).then(function(data) {
                deferred.resolve(data);
                return deferred.promise;
            }, function() {
                deferred.reject;
                return deferred.promise;
            });
            return deferred.promise;
        },
        updateProduct: function(product) {
            var deferred = $q.defer();
            var promise = $http({
                method: 'PUT',
                url: baseUrl.getUrl(
                    serviceModules.products, [{collection:'', value:product._id}]
                ),
                data: product
            }).then(function(data) {
                deferred.resolve(data);
                return deferred.promise;
            }, function() {
                deferred.reject;
                return deferred.promise;
            });
            return deferred.promise;
        }
    };
});
