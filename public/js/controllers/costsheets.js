'use strict';

var app = angular.module('mean.costsheets').controller('CostSheetsController', ['$scope', '$stateParams', 'Global', 'CostSheets', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, CostSheets, $state, $window, $http, $sce) {
    $scope.global = Global;
    $scope.partId = $stateParams.partId; 

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByRfqId = function () {
        $http.get("/rfq/costsheets/" + $stateParams.rfqId + "?partId=" + $stateParams.partId)
            .then(function (response) {
                $scope.costsheets = response.data;
            }, function (error) {
            });
    };

    $scope.findApprovedCostSheetByRfqId = function () {
        $http.get("/rfq/costsheets/approved/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.costsheet = response.data;
            }, function (error) {
            });
    };

}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});