'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.customercomments').factory("Customercomments", ['$resource', function ($resource) {
    return $resource('customercomments/:customerId', {
        customerId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);