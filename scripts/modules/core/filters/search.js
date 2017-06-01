var app = angular.module('material.filters');
app.filter('search', function() {
	return function(array , input, filters) {
		var fs = [];
		var validateIsEqual = function (finalElement, input , element){
			if (finalElement.toUpperCase().indexOf(input.toUpperCase()) >= 0) {
				fs.push(element);
			}
		};
		if(input && input.length){
			angular.forEach(array, function(element) {
				angular.forEach(filters, function(filter) {
					var finalElement = element[filter];
					if(filter.indexOf('.')>=0){
						var splitedFilter = filter.split('.');
						finalElement = element[splitedFilter[0]][splitedFilter[1]];
					}
					if(typeof input === 'object'){
						angular.forEach(input, function(inputFilter) {
							validateIsEqual(finalElement, inputFilter, element);
						})
					}else{
						validateIsEqual(finalElement, input , element);
					}
				});
			});
		} else {
			fs = array;
		}
		return fs;
	};
});
