'use strict';

var app = angular.module('mean.dashboards').controller('DashboardsController', ['$scope', '$location', '$stateParams', 'Global', 'Dashboards', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', '$sce', function ($scope, $location, $stateParams, Global, Dashboards, $state, $window, $filter, $controller, $rootScope, $http, $sce) {
    $scope.global = Global;
    $scope.status = "";

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.find = function () {
        if (typeof $window.user != 'undefined') {
            $http.get("/dashboards/getSiteSummary")
                .then(function (response) {
                    $scope.siteSummary = response.data;
                }, function (error) {
                    console.log(error);
                });
        }
    };

    $scope.findOpenRfq = function () {
        if (typeof $window.user != 'undefined') {
            $http.get("/dashboards/getOpenRfq")
                .then(function (response) {
                    $scope.rfqs = response.data;
                }, function (error) {
                    console.log(error, $stateParams.buyerId);
                });
        }
    };

    $scope.findMyRfq = function () {

        if (typeof $window.user != 'undefined') {
            $http.get("/dashboards/getMyRfq")
                .then(function (response) {
                    $scope.myRfqs = response.data;
                    //customStatus
                    for (var index = 0; index < $scope.myRfqs.length; index++) {
                        if (!$scope.myRfqs[index].CostSheets.length) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-info' href='/rfq/" + $scope.myRfqs[index].id + "/costsheet/prepare'>Prepare Cost Sheet</a>";

                        }
                        else if (!$scope.myRfqs[index].CostSheets.some(function (o) { return o["status"].toLowerCase() === "approved"; })) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/costsheet/approval'>Waiting for Cost Sheet Approval</a>";

                        } else if (!$scope.myRfqs[index].Quotations.length) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/quotation/short'>Waiting for Short Quotation</a>";

                        } else if (!$scope.myRfqs[index].PurchaseOrders.length) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-danger' href='/rfq/" + $scope.myRfqs[index].id + "/purchaseorder'>Waiting for PO</a>";

                        } else if (!$scope.myRfqs[index].PurchaseOrders.some(function (o) { return o["status"].toLowerCase() === "complete"; })) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/purchaseorder'>Waiting for PO approval</a>";

                        }
                        else {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-success' href='customer/" + $scope.myRfqs[index].Buyer.CustomerID + "/buyer/" + $scope.myRfqs[index].BuyerID + "/rfq/" + $scope.myRfqs[index].id + "'>Completed</a>";
                        }

                        if ($scope.myRfqs[index].Samplesubmissionimages.length > 0 && $scope.myRfqs[index].Samplesubmissions.length == 0) {
                            $scope.myRfqs[index].customStatus += "&nbsp; <br /><a class='btn btn-warning m-t-5' href='rfq/" + $scope.myRfqs[index].id + "/samplesubmission'>" + $scope.myRfqs[index].Samplesubmissionimages[0].operation + " drawing completed</a>";
                        }
                        else if ($scope.myRfqs[index].Samplesubmissions.length) {
                            $scope.myRfqs[index].customStatus += "&nbsp; <br /><a class='btn btn-success m-t-5' href='rfq/" + $scope.myRfqs[index].id + "/samplesubmission'>" + $scope.myRfqs[index].Samplesubmissions[0].stage + " " + $scope.myRfqs[index].Samplesubmissions[0].stageProcess + " completed</a>";
                        }
                    }
                }, function (error) {
                    console.log(error);
                });
        }
    };

    $scope.assignToMeRfq = function (rfqId) {
        $http.put('/rfqs/' + rfqId, { UserId: $window.user.id, id: rfqId }).then(function (response) {
            $scope.findOpenRfq();
            $scope.findMyRfq();
        });
    };

}]);