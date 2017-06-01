var app = angular.module('material.filters');
app.filter('timeConvert', function() {
    return function(array) {
    	array = (Date.parse(array));
    	return array;
    };
});
