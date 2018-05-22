'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.buyercomments').factory("Buyercomments", ['$resource', function ($resource) {
    return $resource('buyercomments/:buyerId', {
        buyerId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);