var fabric = require('./bower_components/fabric/dist/all.min.js')
angular.module('material', [
  'ngMaterial', 'mdColorPicker', 'ui.router', 'material.router', 'pascalprecht.translate', 'flow',
  'material.directives', 'material.services', 'material.constants'
]).run(function($rootScope, $controller) {

})

.config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('WMT-purple', {
        '50': '#fdfbfd',
        '100': '#e4c8e0',
        '200': '#d2a2ca',
        '300': '#bb72af',
        '400': '#b15da3',
        '500': '#a14e94',
        '600': '#8c4481',
        '700': '#783a6e',
        '800': '#63305b',
        '900': '#4f2648',
        'A100': '#fdfbfd',
        'A200': '#e4c8e0',
        'A400': '#b15da3',
        'A700': '#783a6e',
        'contrastDefaultColor': 'light'
    });
    $mdThemingProvider.theme('default')
        .primaryPalette('purple')
        .accentPalette('purple');
}).config(function(flowFactoryProvider) {
    flowFactoryProvider.defaults = {singleFile: true};
});
