/*global angular */
'use strict';

var app = angular.module('material');

app.controller('stateManagerController', function($rootScope, utilsService, $state, stateManagerScope) {
    var init = -1;
    stateManagerScope.stateStacks = JSON.parse(sessionStorage.getItem('stateStacks'));

    stateManagerScope.saveOnCache = function() {
        sessionStorage.setItem("stateStacks", JSON.stringify(stateManagerScope.stateStacks));
    };

    stateManagerScope.resetStack = function() {
        stateManagerScope.stateStacks = [];
        stateManagerScope.saveOnCache();
    };

    if (!stateManagerScope.stateStacks) {
        stateManagerScope.resetStack();
    }

    stateManagerScope.$on('resetStack', function() {
        stateManagerScope.resetStack();
    });

    stateManagerScope.$on('saveStack', function(event, state) {
        stateManagerScope.saveState(state, null, state.params);
    });

    $rootScope.$on('$viewContentLoaded', function() {
        if (init >= 0) {
            if (stateManagerScope.stateStacks.length) {
                stateManagerScope.foundController = false;
                stateManagerScope.controllerToFind = stateManagerScope.$$nextSibling.$$childTail.$$prevSibling;
                stateManagerScope.resolveController('toState');
                angular.forEach(stateManagerScope.stateStacks, function(state, index) {
                    if (state.name === stateManagerScope.toState.name) {
                        stateManagerScope.stateStacks = stateManagerScope.stateStacks.slice(0, index);
                        if (state.cantRestoreTouched) {
                            stateManagerScope.alertCantRestore(stateManagerScope.toState);
                        } else if (!state.keepAlert) {
                            swal.close();
                        }
                        for (var key in state) {
                            if (key !== 'stateParams' || state.cantRestoreTouched) {
                                stateManagerScope.foundController[key] = state[key];
                            }
                        }
                    }
                });
                if (stateManagerScope.toState.stateManager) {
                    if (!stateManagerScope.toState.stateManager.keepAlert && !stateManagerScope.toState.stateManager.restoreBlocked) {
                        swal.close();
                    }
                }
            }
            if (!stateManagerScope.validateModuleTransition(stateManagerScope.toState, stateManagerScope.fromState)) {
                stateManagerScope.resetStack();
            }
        }
    });

    stateManagerScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
        stateManagerScope.controllerToFind = stateManagerScope.controllerToFind.$$childTail;
        if (stateManagerScope.stateStacks.length && toParams) {
            angular.forEach(stateManagerScope.stateStacks, function(state) {
                if (state.stateParams.id == toState.controllerAs) {
                    angular.forEach(state.stateParams, function(value, attr) {
                        toParams[attr] = value;
                    })
                }
            });
        }
        stateManagerScope.toState = toState;
        stateManagerScope.fromState = fromState;
        stateManagerScope.saveOnCache();
    });

    stateManagerScope.findController = function(direction) {
        stateManagerScope.keepGoing = true;
        angular.forEach(stateManagerScope.controllerToFind, function(value, attr) {
            if (stateManagerScope.keepGoing) {
                if (typeof value !== 'function' && attr.indexOf('$') === -1 && attr === stateManagerScope[direction].controllerAs || (stateManagerScope.toState.abstract && stateManagerScope.toState.controllerAs === attr)) {
                    stateManagerScope.foundController = stateManagerScope.controllerToFind;
                    stateManagerScope.keepGoing = false;
                }
            }
        });
        return stateManagerScope.foundController;
    };

    stateManagerScope.resolveController = function(direction) {
        if (!stateManagerScope.findController(direction)) {
            if (stateManagerScope.controllerToFind.$$childTail) {
                stateManagerScope.controllerToFind = stateManagerScope.controllerToFind.$$childTail;
                stateManagerScope.resolveController(direction);
            }
        }
    };

    stateManagerScope.validateModuleTransition = function(from, to) {
        var fromSplitted = from.name.split('.');
        var toSplitted = to.name.split('.');
        return (fromSplitted[1] === toSplitted[1] || to.abstract);
    };

    stateManagerScope.findControllerByState = function(ctrl1) {
        return ctrl1.name === stateManagerScope.ctrlToFindDuplicated;
    };

    stateManagerScope.alertCantRestore = function(toState) {
        swal(utilsService.alertStyles('', toState.stateManager.blockInfo.message, 'warning', toState.stateManager.blockInfo.action1.message, null, toState.stateManager.blockInfo.action2.message, null, true, false), function(isConfirm) {
            if (isConfirm) {
                $state.go(toState.stateManager.blockInfo.action1.path);
                swal.close();
            } else {
                $state.go(toState.stateManager.blockInfo.action2.path);
            }
        });
    };

    stateManagerScope.saveState = function(toState, fromState, toParams) {
        var stateDirection, stateIndexOnStack, stateDirectionText, params;
        if (fromState) { // if it's a self state saving
            stateDirection = fromState;
            stateDirectionText = 'fromState';
        } else {
            stateDirection = toState;
            stateManagerScope.controllerToFind = stateManagerScope.$$nextSibling.$$childTail.$$prevSibling;
            stateManagerScope.foundController = false;
            stateManagerScope.ctrlToFindDuplicated = toState.name;
            stateDirectionText = 'toState';
        }
        stateIndexOnStack = stateManagerScope.stateStacks.findIndex(stateManagerScope.findControllerByState); // find position of current controller on stack

        stateManagerScope.resolveController(stateDirectionText); // Find current controller
        params = toParams;
        params.id = toState.controllerAs;
        if (stateIndexOnStack < 0) { // if controller it's not on stack than add it
            stateManagerScope.stateStacks.push({
                name: stateDirection.name,
                stateParams: params
            });
            stateIndexOnStack = stateManagerScope.stateStacks.length - 1;
        } else {
            stateManagerScope.stateStacks[stateIndexOnStack].stateParams = params; // otherwise just update the stateParams
        }
        angular.forEach(stateManagerScope.foundController, function(value, attr) { // iterate each attribute of current contoller and save it on stack
            if (stateDirection.stateManager.keepAlert) { // validate if on current controller starts with an swal alert
                stateManagerScope.stateStacks[stateIndexOnStack]['keepAlert'] = stateDirection.stateManager.keepAlert; //if so, save that info on stack
            }
            if (typeof value !== 'function' && attr.indexOf('$') === -1) {
                stateManagerScope.stateStacks[stateIndexOnStack][attr] = value;
            }
        });
        stateManagerScope.saveOnCache();
    };

    stateManagerScope.transitionIsValid = function(toState, toParams) {
        var hasPermission,
            currentStoreHouse = userSelectedStoreHouse.getStoreHouse();
        if (toParams.targetId) {
            if (toParams.targetId.indexOf('id') >= 0) {
                toParams.targetId = toParams[toParams.targetId];
            }
        } else if (currentStoreHouse) {
            toParams.targetId = currentStoreHouse.sid;
        }
        var permission = (!toState.permissionTarget) ? toState.permission : (toState.permission + ':' + toParams.targetId);
        if ($rootScope.userInfo.acl) {
            hasPermission = authorizationService.userHasPermission($rootScope.userInfo.acl.permissions, permission);
        } else {
            aclServices.getFlatUserPermissions($rootScope.userInfo.sid).then(function(permissionsData) {
                $rootScope.userInfo.acl = permissionsData;
                hasPermission = authorizationService.userHasPermission($rootScope.userInfo.acl.permissions, permission);
            });
        }
        return hasPermission;
    };

    stateManagerScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
        init++;
        stateManagerScope.controllerToFind = stateManagerScope.$$nextSibling.$$childTail.$$prevSibling;
        stateManagerScope.foundController = false;
        stateManagerScope.fromState = fromState;
        if (toState.storehouseRequired) {
            var currentStoreHouse = userSelectedStoreHouse.getStoreHouse();
            if (!currentStoreHouse) {
                event.preventDefault();
                var page = toState.name.split('home.')
                $state.go('home.empty', {
                    page: page[1],
                    selectSh: true,
                    ready: true
                });
            }
        }
        if (toState.permission && !stateManagerScope.transitionIsValid(toState, toParams) && !$rootScope.userInfo.acl.admin) {
            event.preventDefault();
            $state.go('404');
        } else {
            if (init) {
                if (stateManagerScope.controllerToFind.$$childTail) {
                    for (var i = 0; i < stateManagerScope.stateStacks.length; i++) {
                        var state = stateManagerScope.stateStacks[i];
                        if (state.name === toState.name) {
                            if (toState.stateManager.restoreBlocked) {
                                stateManagerScope.alertCantRestore(toState);
                                state.cantRestoreTouched = true;
                            }
                        }
                    }
                    if (toState.stateManager) {
                        stateManagerScope.ctrlToFindDuplicated = fromState.name;
                        // stateManagerScope.saveState(toState, fromState, toParams);

                    }
                    stateManagerScope.saveOnCache();
                }
            }
        }
    });
});
