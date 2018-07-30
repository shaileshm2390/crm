'use strict';
angular.module('mean.sampleinspectionreports').factory("SampleInspectionReports", ['$resource', function ($resource) {
    return $resource('sampleinspectionreports/:sampleinspectionreportId', {
        sampleinspectionreportId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);