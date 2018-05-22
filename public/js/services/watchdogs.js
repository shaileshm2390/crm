'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.watchdogs').factory("Watchdogs", ['$resource', function ($resource) {
    return $resource('watchdogs/:watchdogId', {
        watchdogId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);