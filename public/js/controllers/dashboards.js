'use strict';

var app = angular.module('mean.dashboards').controller('DashboardsController', ['$scope', '$location', '$stateParams', 'Global', 'Dashboards', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Dashboards, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;
    $scope.status = "";

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
                            $scope.myRfqs[index].customStatus = "Prepare costsheet";
                        }
                        else if (!$scope.myRfqs[index].CostSheets.some(function (o) { return o["status"] === "approved"; })) {
                            $scope.myRfqs[index].customStatus = "Costsheet under approval";
                        } else if (!$scope.myRfqs[index].PurchaseOrders.some(function (o) { return o["status"] === "completed"; })) {
                            $scope.myRfqs[index].customStatus = "Purchase order haven't received yet";
                        }
                    }
                }, function (error) {
                    console.log(error, $stateParams.buyerId);
                });
        }
    }

}]);