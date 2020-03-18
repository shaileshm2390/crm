"use strict";
angular.module('mean', ['ngCookies', 'ngResource', 'ui.router', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.auth', 'mean.departments', 'mean.customers', 'mean.customercomments', 'mean.buyercomments', 'mean.users', 'mean.buyers', 'mean.rfqs', 'satellizer', 'angularFblogin', 'mean.watchdogs', 'mean.rfqcomments', 'mean.purchaseorders', 'mean.purchaseorderimages', 'mean.samplesubmissions', 'mean.costsheets', 'mean.dashboards', 'mean.rawmaterials', 'mean.conversions', 'mean.htsts', 'mean.packingAndForwardings', 'mean.sampleinspectionreports', 'mean.sampleinspectionreportimages','autocompleteApp'])
.config(function ($authProvider) {

    $authProvider.twitter({
        url: '/auth/twitter',
        authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
        redirectUri:  'http://localhost:3000/auth/twitter/callback',
        oauthType: '1.0',
        popupOptions: { width: 495, height: 645 }
    });

    $authProvider.google({
        clientId: 'your google client id here', // google client id
        url: '/auth/google',
        redirectUri: 'http://localhost:3000/auth/google/callback'
    });

});

angular.module('mean.system', []);
angular.module('mean.departments', []);
angular.module('mean.users', []);
angular.module('mean.auth', []);
angular.module('mean.customers', []);
angular.module('mean.customercomments', []);
angular.module('mean.buyercomments', []);
angular.module('mean.buyers', []);
angular.module('mean.watchdogs', []);
angular.module('mean.rfqs', []);
angular.module('mean.rfqcomments', []);
angular.module('mean.purchaseorders', []);
angular.module('mean.purchaseorderimages', []);
angular.module('mean.samplesubmissions', []);
angular.module('mean.costsheets', []);
angular.module('mean.dashboards', []);
angular.module('mean.rawmaterials', []);
angular.module('mean.conversions', []);
angular.module('mean.htsts', []);
angular.module('mean.packingAndForwardings', []);
angular.module('mean.sampleinspectionreports', []);
angular.module('mean.sampleinspectionreportimages', []);
angular.module('autocompleteApp', []);
