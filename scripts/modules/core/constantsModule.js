/*global angular */
'use strict';

var app = angular.module('material.constants', ['material']);

app.constant('backend', {
    url: appConfig.url,
});

app.constant('serviceModules', {
    'inventory': 'inventory',
    'products': 'products',
    'images': 'images'
});

app.constant('serviceCollections', {
    'INVENTORY': 'inventory',
    'METRICS': 'metrics',
    'COUNT': 'count',
    'VIEW': 'view',
    'SERVICES': 'services',
    'FPS1': 'fps1',
    'DISPATCH': 'dispatch',
    'SCAN': 'scan',
    'PRODUCTS': 'products',
    'SEARCH': 'search',
    'FIQ1': 'fiq1',
    'START': 'start',
    'REASONS': 'reasons',
    'CREATE': 'create',
    'QC': 'qc',
    'PUTAWAY': 'putaway',
    'TASKEXECUTIONS': 'taskexecutions',
    'NEXTTASKS': 'nexttasks',
    'IMS': 'ims',
    'LOCATIONS': 'locations',
    'UID': 'uid',
    'LEVELS': 'levels',
    'MOVE': 'move',
    'STOREHOUSE': 'storehouse',
    'STOREHOUSES': 'storehouses',
    'LEVELTYPES': 'leveltypes',
    'TYPES': 'types',
    'ATTRIBUTES': 'attributes',
    'COUNTRIES': 'countries',
    'CHILDREN': 'children',
    'VALIDATECODE': 'validatecode',
    'VALIDATELEVELCODE': 'validatelevelcode',
    'PICK': 'pick',
    'PACK': 'pack',
    'CANCEL': 'cancel',
    'SHIPPINGPROVIDER': 'shippingprovider',
    'FINALIZE': 'finalize',
    'QCFAIL': 'qcfail',
    'UNASSIGN': 'unassign',
    'SID': 'sid',
    'ASSIGN': 'assign',
    'SECTIONS': 'sections',
    'SERVICEHISTORY': 'servicehistory',
    'INVENTORYSID': 'inventorySid',
    'TASKS': 'tasks',
    'TASK': 'task',
    'EXPORT': 'export',
    'DOWNLOAD': 'download',
    'ROLES': 'roles',
    'USERS': 'users',
    'DEPARTMENTS': 'departments',
    'LOCATION': 'location',
    'RESOURCES': 'resources',
    'PERMISSIONS': 'permissions',
    'FILTERS': 'filters',
    'BARCODES': 'barcodes',
    'PRINT': 'print',
    'STATES': 'states',
    'RIQ': 'riq',
    'RIQL': 'riql',
    'PACKAGE': 'package',
    'LABEL': 'label',
    'MEMBERS': 'members',
    'FRONTEND': 'frontend',
    'IMV1': 'imv1',
    'UNIT': 'unit',
    'FINISH': 'finish',
    'COUNTS': 'counts'
});

app.constant('dashServColls', {
    'PUTAWAY': 'PUTAWAY',
    'TASK': 'task',
    'TASKSTATES': 'taskStates',
    'PENDINGINPROGRESS': 'PENDING,IN_PROGRESS',
    'PENDING': 'PENDING',
    'INPROGRESS': 'IN_PROGRESS',
    'PICK': 'PICK',
    'PACK': 'PACK',
    'DISPATCH': 'DISPATCH',
    'BEFORE': 'before',
    'AFTER': 'after'
})

app.service('baseUrl', function(backend) {
    this.concatQuery = function(queryParams) {
        var concatenator = '?';
        var queryString = '';
        angular.forEach(queryParams, function(queryP, i) {
            if (i > 0 && queryParams[0].value != null) {
                concatenator = '&';
            }
            if (queryP.value || queryP.value === 0) {
                queryString += concatenator + queryP.queryParam + '=' + queryP.value;
            }
        });
        return queryString;
    };

    this.buildUrl = function(collections, queryParams) {
        var collectionsString = '';
        angular.forEach(collections, function(col, i) {
            if (i > 0) {
                collectionsString += '/';
            }

            collectionsString += col.collection;

            if (col.value) {
                collectionsString += '/' + col.value;
            }
        });

        collectionsString += this.concatQuery(queryParams);
        return collectionsString;
    };

    this.getUrl = function(module, collections, queryParams, isHostedOnSG) {
        var collectionsString = this.buildUrl(collections, queryParams);
        return backend.url + module + collectionsString;
    };

    this.getAcl = function(collections, queryParams) {
        var collectionsString = this.buildUrl(collections, queryParams);

        return backend.url + backend.stargate + backend.acl + collectionsString;
    };
});

app.service('pathBuilder', function() {
    this.build = function(rootFolder, file, folders) {
        var folderCollection = '';
        angular.forEach(folders, function(folder, i) {
            folderCollection += '/' + folder;
            if (file && i == folders.length - 1) {
                folderCollection += '/';
            }
        });
        if (!folderCollection) {
            file = '/' + file;
        }
        return rootFolder + folderCollection + file;
    };
})

app.constant('locationsConstants', {
    maxWidth: 5
});

app.constant('permissionsMap', {
    TASK: ['TASK_INBOUND', 'TASK_MOVEMENT', 'TASK_OUTBOUND', 'TASK_PICK', 'TASK_PACK', 'TASK_DISPATCH', 'CYCLE_COUNT', 'TASK_CYCLE_COUNT',
        'CYCLE_COUNT_PROJECT_CREATION'
    ],
    ADMIN: ['ADMIN_PRODUCT', 'ADMIN_STOREHOUSE', 'STOREHOUSE_MANAGEMENT', 'LOCATION_MANAGEMENT', 'LOCATION_CREATION', 'LOCATION_EDITION',
        'LOCATION_EXPORT', 'LOCATION_MASS_IMPORT', 'LOCATION_VIEW_ONLY', 'LOCATION_TYPE_MANAGEMENT', 'ADMIN_USERS', 'ADMIN_USER_CREATION',
        'ADMIN_USER_MANAGEMENT', 'ADMIN_ROLES', 'ADMIN_CREATE_ROLES', 'ADMIN_EDIT_ROLES', 'ADMIN_TASK_DASHBOARD', 'ADMIN_EXPORT_TASKS',
        'ADMIN_INVENTORY_DASHBOARD'
    ]
});

app.constant('colors', {
    greenDark: '#009688',
    green: '#4CAF50',
    greenLight: '#8BC34A',
    yellowBright: '#CDDC39',
    brown: '#4A4A4A',
    blue: '#3F51B5',
    blueLight: '#2196F3',
    blueLighter: '#00BCD4',
    brownLight: '#795548',
    brownDark: '#B47136',
    orange: '#FF9800',
    orangeLight: '#EDBE3F',
    metal: '#607D8B',
    redDark: '#F44336',
    red: '#E91E63',
    yellow: '#FFEB3B'

});

app.constant('folders', {
    imagesRoot: '../images',
});

app.constant('icons', {
    movement: 'movement-icon.svg',
    outbound: 'outbound-icon.svg',
    inbound: 'inbound-icon.svg'
});

app.constant('permissions', {
    //ADMIN
    masterInventory: 'ADMIN_INVENTORY_OVERVIEW',
    dashBoard: 'ADMIN_TASK_DASHBOARD',
    users: 'ADMIN_USERS',
    roles: 'ADMIN_ROLES',
    products: 'ADMIN_PRODUCT',
    storehouses: 'ADMIN_STOREHOUSE',
    storehouseManagement: 'STOREHOUSE_MANAGEMENT',
    locationTypeManagement: 'LOCATION_TYPE_MANAGEMENT',
    locationViewOnly: 'LOCATION_VIEW_ONLY',
    locationCreation: 'LOCATION_CREATION',
    locationEdition: 'LOCATION_EDITION',
    locationExport: 'LOCATION_EXPORT',
    locationImport: 'LOCATION_IMPORT',
    //TASK
    outbound: 'TASK_OUTBOUND',
    inbound: 'TASK_INBOUND',
    movement: 'TASK_MOVEMENT',
    pack: 'TASK_PACK',
    pick: 'TASK_PICK',
    dispatch: 'TASK_DISPATCH',
    cycleCount: 'TASK_CYCLE_COUNT'
});

app.constant('storehouseTypes', {
    hub: 2,
    warehouse: 1
});

app.constant('idle', {
    idle: 1800,
    timeout: 30,
    interval: 2
});

app.service('variablesTreatment', function() {
    this.sanitizeFloat = function(val) {
        return parseFloat(val.replace(/,/g, '.'));
    }
});

app.service('userSelectedStoreHouse', function() {
    this.getStoreHouse = function() {
        return JSON.parse(localStorage.getItem('currentStoreHouse'));
    };
});
