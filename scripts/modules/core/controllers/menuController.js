/*global angular */
'use strict';

var app = angular.module('material');
app.controller('menuController', function($scope, $state) {
  var menuCtrl = this
  menuCtrl.menus = [
    {
      name: 'Products',
      state: 'home.products'
    },
    {
      name: 'Inventory',
      state: 'home.inventory'
    }
  ];

  menuCtrl.navigate = function(page){
    $state.go(page);
  }

});
