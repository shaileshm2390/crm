'use strict';

var app = angular.module('mean.samplesubmissions').controller('SampleSubmissionsController', ['$scope', '$location', '$stateParams', 'Global', 'SampleSubmissions', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, SampleSubmissions, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;

    $scope.Status = ["Drawing", "Release for Development", "Uploaded Sample"];

    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var samplesubmission = new SampleSubmissions({
            status: this.selectedStatus,
            imagesString: this.imagesString,
            RfqId: $stateParams.rfqId
        });
        samplesubmission.$save(function (response) {
            //$state.go('departments');
            //$http.get("/samplesubmissions/" + samplesubmission.id).then(function (response) {
            //    console.log("updated data  -->  " + JSON.stringify(response));
            //    $scope.updatedSample = JSON.stringify(response.data);

            //    $state.go('sampleSubmission');
            //    var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //    //watchdog calling
            //    commonCtrl.create({ message: "New sample submission is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedSample });
            //});
        });

        this.status = "";
        this.imagesString = "";
        this.sampleStatus = "";
    };

    $scope.remove = function (samplesubmission) {
        var deleteSamplesubmission = $window.confirm('Are you absolutely sure you want to delete?');

        if (deleteSamplesubmission) {
            //get previous data from URL
            $http.get("/samplesubmissions/" + samplesubmission.id).then(function (response) {
                $scope.previousSample = JSON.stringify(response.data);

                if (samplesubmission) {
                    samplesubmission.$remove();

                    for (var i in $scope.samplesubmissions) {
                        if ($scope.samplesubmissions[i] === samplesubmission) {
                            $scope.samplesubmissions.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.samplesubmission.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Purchase order " + samplesubmission.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousSample,
                    updatedData: ""
                });
                $window.location.href = "/samplesubmission";
            });
        }
    };

    $scope.update = function () {
        var samplesubmission = $scope.samplesubmission;
        if (!samplesubmission.updated) {
            samplesubmission.updated = [];
        }

        //get previous data from URL
        $http.get("/samplesubmissions/" + samplesubmission.id).then(function (response) {
            $scope.previousSample = JSON.stringify(response.data);
        });

        samplesubmission.updated.push(new Date().getTime());

        samplesubmission.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })

            ///get updated data from URL
            $http.get("/samplesubmissions/" + samplesubmission.id).then(function (response) {
                $scope.updatedSample = JSON.stringify(response.data);

                $state.go('samplesubmissions');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "Purchase order " + purchaseorder.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousSample, updatedData: $scope.updatedSample });
            });

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        Samplesubmissions.query(function (samplesubmissions) {
            $scope.samplesubmissions = samplesubmissions;

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findExceptAdmin = function () {
        Samplesubmissions.query(function (samplesubmissions) {
            for (var i in samplesubmissions) {
                if (samplesubmissions[i].name === 'Admin') {
                    samplesubmissions.splice(samplesubmissions[i], 1);
                }
            }
            $scope.samplesubmissions = samplesubmissions;
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    //$scope.findOne = function () {
    //    Samplesubmissions.get({
    //        samplesubmissionId: $stateParams.samplesubmissionId
    //    }, function (purchaseorder) {
    //        $scope.samplesubmission = samplesubmission;
    //    }, function (error) {
    //        console.log(error);
    //        $window.location.href = "/signin";
    //    });
    //};

    $scope.findOne = function () {
        $http.get("/rfq/samplesubmissions/" + $stateParams.rfqId).then(function (response) {

            $scope.samplesubmission = response.data;    

        });
    };

    $scope.deleteImage = function (id) {
        if ($window.confirm("Are you sure to delete this image")) {
            $http.delete('/samplesubmissionimages/' + id).then(function (response) {
                $scope.previousSampleSubmissionImage = JSON.stringify(response.data);
                var sampleSubmissionID = response.data.SamplesubmissionId;
                $http.get("/samplesubmissionimages/" + sampleSubmissionID).then(function (response) {

                    $state.reload();

                    var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                    //watchdog calling
                    commonCtrl.create({ message: "Sample-submission image with id " + id + " is deleted.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousSampleSubmissionImage, updatedData: "" });
                });
            });
            return false;
        }
    }

    $scope.getAllSampleStatus = function()
    {
        $http.get('/samplestatus').then(function (response) {
            $scope.sampleStatusData = response.data;
            if ($scope.sampleStatusData.length) {
                $scope.targetdate = $scope.sampleStatusData[$scope.sampleStatusData.length - 1].targetDate;
            }
        });
    }

}]);
