(function() {

    'use strict';

    angular.module('material')
        .factory('interceptor', interceptor);


    function interceptor(
        $q,
        $injector,
        $rootScope
    ) {
        function showError(data) {
            toastService = $injector.get('toastService');

            var code;
            if (data.code != undefined && data.code != null) {
                code = data.code;
            } else {
                code = data.status;
            }

            if(code){
                if (code < 600) {
                    toastService.error(translate.instant('ERROR.' + code + '.DESCRIPTION'));
                } else {
                    toastService.error(translate.instant('ERRORS.' + code));
                }
            }else{
                toastService.error(translate.instant('GENERALERROR'));
            }
        };

        var state, toastService, userInfo, translate;

        var intercept = {
            'request': function(config) {
                // Check if the url is to Inventory or StarManager
                var isTenantSelected = config.url.indexOf('/gw/inventory') > -1 || config.url.indexOf('/gw/starmanager') > -1;

                // Get storehouse sid from cache
                if (isTenantSelected && localStorage.getItem('currentStoreHouse') != null) {
                    var storehouse = JSON.parse(localStorage.getItem('currentStoreHouse'));
                    if (storehouse != null && storehouse.sid != null) {
                        config.headers['X-Node'] = storehouse.sid;
                    }
                }
                return config;
            },
            'responseError': function(rejection) {
                    switch (rejection.status) {
                        case 401:
                            state = $injector.get('$state');
                            translate = $injector.get('$translate');
                            userInfo =  $injector.get('userInfo');
                            userInfo.logout();
                            break;
                        case 403:
                            state = $injector.get('$state');
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            state.go('home.landingPage');
                            break;
                        case 400:
                            state = $injector.get('$state');
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            break;
                        case 404:
                            state = $injector.get('$state');
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            break;
                        case 409:
                            state = $injector.get('$state');
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            break;
                        case 500:
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            state = $injector.get('$state');
                            break;
                        case 503:
                            translate = $injector.get('$translate');
                            showError(rejection.data);
                            state = $injector.get('$state');
                            break;
                        case 0:
                        case -1:
                            if (!$rootScope.online) {
                                state = $injector.get('$state');
                                state.go('home.landingPage');
                            } else {
                                state = $injector.get('$state');
                                state.go('503');
                                break;
                            }
                    }

                return $q.reject(rejection);
            }
        };

        return intercept;
    }

})();
