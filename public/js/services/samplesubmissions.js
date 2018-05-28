'use strict';
//samplesubmissions service used for samplesubmissions REST endpoint
angular.module('mean.samplesubmissions').factory("SampleSubmissions", ['$resource', function ($resource) {
    return $resource('samplesubmissions/:samplesubmissionId', {
        samplesubmissionsId: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);