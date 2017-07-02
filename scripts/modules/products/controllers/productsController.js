/*global angular */
'use strict';

var app = angular.module('material');
var $ = require('./bower_components/jquery/dist/jquery.js');
app.controller('productsController', function($scope, $mdDialog, productService) {
    var productController = $scope;
    $scope.editProduct = {
        photos: []
    }
    productController.getProducts = function() {
        productService.getProducts().then(function(response) {
            productController.products = response.data.content;
            console.log(productController.products)
        })
    };

    productController.openCreateDialog = function(product) {
        if (product) {
            $scope.editProduct = angular.copy(product);
            $scope.editing = true;
        } else {
            $scope.editing = false;
        }
        $mdDialog.show({
            locals: {
                productController: $scope.editProduct,
                editing: $scope.editing,
                parentScope: $scope
            },
            controller: createProductCrontroller,
            templateUrl: 'scripts/modules/core/views/createProduct.html',
            parent: angular.element(document.body),
            multiple: true,
            clickOutsideToClose: true,
            skipHide: true,
            preserveScope: true,
            onRemoving: function(event, removePromise) {
                $scope.editProduct = {photos:[]};
            },
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };

    function createProductCrontroller($scope, $rootScope, $mdDialog, $translate, $timeout, productService, productController, editing, imageService, $q, toastService, parentScope) {

        $scope.createProductScope = productController;
        $scope.editing = editing;
        $timeout(function() {
            $scope.forms = []
            angular.forEach($scope.editProduct, function(form, name) {
                $scope.forms.push(form)
            })
            setTimeout(function() {
                $('#name').focus();
            }, 600)
        });

        $scope.uploadImage = function() {
            document.getElementById('upload-file').click();
        }

        $rootScope.$on('color-picker-closed', function(event, args) {
            // productController.openCreateDialog();
        });

        $scope.insertLinkImage = function() {
            $scope.createProductScope.photos.push({
                url: null,
                name: $scope.createProductScope.photos.length,
                type: 'link'
            });
            $scope.curentImage = $scope.createProductScope.photos[0];
            $scope.updateCanvas($scope.curentImage);
        }

        function convertToDataURLviaCanvas(photo, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.getElementById('drag-file-' + photo.name);
                console.log(canvas)
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat);
                callback(dataURL);
                canvas = null;
            };
            img.src = photo.url;
        }

        $scope.processImage = function(photo) {
            var deferred = $q.defer();
            if (photo) {
                if (photo.url) {
                    var fileNameArray = photo.url.split('/');
                    var fileName = fileNameArray[fileNameArray.length - 1]
                    imageService.postImage(photo.base64, fileName).then(function(response) {
                        $scope.imagesPosted++;
                        photo.id = response.data.id;
                        if ($scope.imagesPosted === $scope.createProductScope.photos.length) {
                            deferred.resolve();
                        }
                    });
                }
            }
            return deferred.promise;
        }


        $scope.$watchCollection('curentImage.url', function(url) {
            if (url) {
                $scope.updateCanvas($scope.curentImage);
            }
        })

        $scope.updateCanvas = function(photo) {
            if (photo) {
                if (photo.url && !photo.id) {
                    convertToDataURLviaCanvas(photo, function(base64Img) {
                        photo.base64 = base64Img;
                    });
                }
            }
        }

        $scope.$watch('photoIndex', function(photoIndex) {
            $timeout(function() {
                if (photoIndex != undefined && photoIndex >= 0) {
                    $scope.getImage($scope.createProductScope.photos[photoIndex]);
                }
            }, 600)
        })

        //If image already exists in database then load it
        $scope.getImage = function(photo) {
            if (photo) {
                $scope.curentImage = photo;
                if (photo.id) { // if is in database then id must exist
                    imageService.getImage(photo.id).then(function(response) {
                        var img = new Image();
                        img.crossOrigin = 'Anonymous';
                        img.onload = function() {
                            var canvas = document.getElementById('drag-file-' + photo.name);
                            var ctx = canvas.getContext('2d');
                            canvas.height = this.height;
                            canvas.width = this.width;
                            ctx.drawImage(this, 0, 0);
                            canvas = null;
                        };
                        img.src = 'data:image/png;base64,i' + response.data + 'g==';
                    })
                }
            }
        }

        $scope.showDeletePhoto = function(photo) {
            photo.showDelete = true;
        }

        $scope.hideDeletePhoto = function(photo) {
            photo.showDelete = false;
        }

        $scope.deletePhoto = function(index) {
            $scope.createProductScope.photos.splice(index, 1)
        }


        $scope.formSubmmit = function() {
            var formIndex = -1,
                keepGoing = true;
            angular.forEach($scope.editProduct, function(form, name) {
                if (keepGoing) {
                    formIndex++;
                    if (form.$valid && $scope.selectedIndex < $scope.forms.length - 1) {
                        $scope.selectedIndex = formIndex + 1;
                    } else if (!form.$valid) {
                        $scope.selectedIndex = formIndex;
                        keepGoing = false;
                    }
                }
            });
            $scope.imagesPosted = 0;
            //TODO this functions are identical must be merged into a single function
            if (keepGoing && $scope.selectedIndex == $scope.forms.length - 1 && !$scope.editing) {

                angular.forEach($scope.createProductScope.photos, function(photo, index) {
                    $scope.processImage(photo, index).then(function() {
                        angular.forEach($scope.createProductScope.photos, function(photo, index) {
                            photo.base64 = '';
                        })
                        productService.createProduct($scope.createProductScope.name, $scope.createProductScope.reference, $scope.createProductScope.color, $scope.createProductScope.haulPrice, $scope.createProductScope.sellPrice, $scope.createProductScope.photos).then(function(product) {
                            $mdDialog.hide();
                            toastService.success('Product created');
                            parentScope.getProducts();
                        })
                    });
                })
            } else if (keepGoing && $scope.selectedIndex == $scope.forms.length - 1 && $scope.editing) {
                angular.forEach($scope.createProductScope.photos, function(photo, index) {
                    $scope.processImage(photo, index).then(function() {
                        angular.forEach($scope.createProductScope.photos, function(photo, index) {
                            photo.base64 = '';
                        })
                        productService.updateProduct($scope.createProductScope).then(function(product) {
                            $mdDialog.hide();
                            toastService.success('Product updated');
                            parentScope.getProducts();
                        })
                    });
                })
            }
        }
    }
    productController.getProducts();
});
