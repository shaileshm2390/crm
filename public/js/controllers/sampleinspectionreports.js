/// <reference path="../../../config/sequelize.js" />
'use strict';

var app = angular.module('mean.sampleinspectionreports').controller('SampleInspectionReportsController', ['$scope', '$location', '$stateParams', 'Global', 'SampleInspectionReports', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, SampleInspectionReports, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;


    $scope.Status = ["Ok", "Not ok", "Await"];

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
            //if (response.data[index].imagePath.indexOf(".pdf") > -1) {
            //    response.data[index].displayPath = '/img/pdf.png';
            //} else if (response.data[index].imagePath.indexOf(".xls") > -1) {
            //    response.data[index].displayPath = '/img/excel.png';
            //} else {
            //    response.data[index].displayPath = response.data[index].imagePath;
            //}

            for (var outerindex = 0; outerindex < response.data.length; outerindex++) {
                for (var index = 0; index < response.data[outerindex].SampleInspectionReportImages.length; index++) {
                    if (response.data[outerindex].SampleInspectionReportImages[index].imagePath.indexOf(".pdf") > -1) {
                        response.data[outerindex].SampleInspectionReportImages[index].displayPath = '/img/pdf.png';
                    } else if (response.data[outerindex].SampleInspectionReportImages[index].imagePath.indexOf(".xls") > -1) {
                        response.data[outerindex].SampleInspectionReportImages[index].displayPath = '/img/excel.png';
                    } else {
                        response.data[outerindex].SampleInspectionReportImages[index].displayPath = response.data[outerindex].SampleInspectionReportImages[index].imagePath;
                    }
                }
            }
            console.log(response.data);
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
