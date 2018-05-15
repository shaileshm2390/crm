"use strict";
angular.module('mean', ['ngCookies', 'ngResource', 'ui.router', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.auth', 'mean.departments', 'mean.users', 'satellizer', 'angularFblogin'])
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