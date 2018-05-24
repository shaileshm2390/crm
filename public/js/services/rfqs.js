'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.rfqs').factory("Rfqs", ['$resource', function ($resource) {
    return $resource('rfqs/edit/:rfqId', {
        rfqId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);