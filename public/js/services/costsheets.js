'use strict';
//Customers service used for cutomers REST endpoint
angular.module('mean.costsheets').factory("CostSheets", ['$resource', function ($resource) {
    return $resource('costsheets/:costsheetId', {
        costsheetId: '@id'
    }, {
            update: {
                method: 'PUT'
            }
        });
}]);