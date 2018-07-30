/// <reference path="../../../config/sequelize.js" />
'use strict';

var app = angular.module('mean.sampleinspectionreports').controller('SampleInspectionReportsController', ['$scope', '$location', '$stateParams', 'Global', 'SampleInspectionReports', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, SampleInspectionReports, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;


    $scope.Status = ["Ok", "Not ok"];

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var sampleInspectionReport = new SampleInspectionReports({
            status: this.selectedStatus,
            report: this.report,
            RfqId: $stateParams.rfqId
        });
        sampleInspectionReport.$save(function (response) {
            this.status = "";
            this.report = "";
        });
        
    };
   
    $scope.findOne = function () {
        $http.get("/rfq/sampleInspectionReports/" + $stateParams.rfqId).then(function (response) {
            $scope.sampleInspectionReports = response.data;
        });
    };

    $scope.deleteImage = function (id) {
        if ($window.confirm("Are you sure to delete this image")) {
            $http.delete('/sampleInspectionReports/image/' + id).then(function (response) {
                $scope.previousPOImage = JSON.stringify(response.data);
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "Sample Inspection report image with id " + id + " is deleted.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousPOImage, updatedData: "" });

                $scope.findOne();
            });
            return false;
        }
    };

}]);
