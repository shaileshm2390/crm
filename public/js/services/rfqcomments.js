'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.rfqcomments').factory("Rfqcomments", ['$resource', function ($resource) {
    return $resource('rfqcomments/:rfqId', {
        rfqId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);