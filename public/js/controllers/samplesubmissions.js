﻿'use strict';

var app = angular.module('mean.samplesubmissions').controller('SampleSubmissionsController', ['$scope', '$location', '$stateParams', 'Global', 'SampleSubmissions', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, SampleSubmissions, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;


    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
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

    $scope.findOne = function () {
        $http.get("/rfq/samplesubmissions/" + $stateParams.rfqId).then(function (response) {
            $scope.TotalSubmissionCost = 0;
            $scope.samplesubmission = response.data;
            if (response.data.length > 0) {
                for (var index = 0; index < response.data.length; index++) {
                    $scope.TotalSubmissionCost += parseFloat(response.data[index].cost);
                }
                $scope.TotalSubmissionCost = $scope.TotalSubmissionCost.toFixed(2);
            }
        });
    };

    $scope.findSampleSubmissionImages = function () {    
        $http.get("/samplesubmissionimages/rfqId/" + $stateParams.rfqId).then(function (response) {
            for (var index = 0; index < response.data.length; index++) {
                if (response.data[index].imagePath.indexOf(".pdf") > -1) {
                    response.data[index].displayPath = '/img/pdf.png';
                } else if (response.data[index].imagePath.indexOf(".xls") > -1) {
                    response.data[index].displayPath = '/img/excel.png';
                } else {
                    response.data[index].displayPath = response.data[index].imagePath;
                }
            }
            $scope.samplesubmissionimages = response.data;
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

    //$scope.getSampleSubmissionImages = function () {
    //    $http.get('/samplestatus/rfq/' + $stateParams.rfqId).then(function (response) {
    //                $scope.sampleStatusData = response.data;          
    //                if ($scope.sampleStatusData.length) {
    //                    var currDate;
    //                    angular.forEach($scope.sampleStatusData, function (data, key) {
    //                        currDate = new Date();
    //                        if ((data.status == "To do" && new Date(data.startDate) < currDate) || (data.status == "In progress" && new Date(data.targetDate) < currDate)) {
    //                            data.performance = "Overdue";
    //                        } else if (data.status == "Completed" && new Date(data.targetDate) >= new Date(data.updatedAt)) {
    //                            data.performance = "Before time";
    //                        } else if (data.status == "Completed" && new Date(data.targetDate) == new Date(data.updatedAt)) {
    //                            data.performance = "On time";
    //                        } else if (data.status == "Completed" && new Date(data.targetDate) <= new Date(data.updatedAt)) {
    //                            data.performance = "After time";
    //                        } else {
    //                            data.performance = "-"
    //                        }
    //                    });
    //                }
    //            });
    //}

    //$scope.getAllSampleStatus = function () {
    //    $http.get('/samplestatus/rfq/' + $stateParams.rfqId).then(function (response) {
    //        $scope.sampleStatusData = response.data;          
    //        if ($scope.sampleStatusData.length) {
    //            var currDate;
    //            angular.forEach($scope.sampleStatusData, function (data, key) {
    //                currDate = new Date();
    //                if ((data.status == "To do" && new Date(data.startDate) < currDate) || (data.status == "In progress" && new Date(data.targetDate) < currDate)) {
    //                    data.performance = "Overdue";
    //                } else if (data.status == "Completed" && new Date(data.targetDate) >= new Date(data.updatedAt)) {
    //                    data.performance = "Before time";
    //                } else if (data.status == "Completed" && new Date(data.targetDate) == new Date(data.updatedAt)) {
    //                    data.performance = "On time";
    //                } else if (data.status == "Completed" && new Date(data.targetDate) <= new Date(data.updatedAt)) {
    //                    data.performance = "After time";
    //                } else {
    //                    data.performance = "-"
    //                }
    //            });
    //        }
    //    });
    //}

    //$scope.updateStatus = function (id, status) {
    //    if ($window.confirm("Are you sure to change status to " + status)) {
    //        $http.get('/samplestatus/' + id).then(function (response) {
    //            console.log(response.data);
    //            $scope.previousSampleStatus = JSON.stringify(response.data);
    //            $http.put("/samplestatus/" + id, { status: status, UserId: user.id }).then(function (response) {
    //                $scope.getAllSampleStatus();
    //                $http.get('/samplestatus/' + id).then(function (updatedData) {
                    
    //                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });
    //                //watchdog calling                 
    //                    commonCtrl.create({
    //                        message: "Sample status with id " + id + " is updated to " + status,
    //                        ipAddress: $rootScope.ip,
    //                        pageUrl: $location.url(),
    //                        userId: user.id,
    //                        previousData: $scope.previousSampleStatus,
    //                        updatedData: JSON.stringify(updatedData.data)
    //                    });
    //                });
                    
    //            });
    //        });
    //        return false;
    //    }
    //};

}]);
