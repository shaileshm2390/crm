'use strict';

var app = angular.module('mean.costsheets').controller('CostSheetsController', ['$scope', '$stateParams', 'Global', 'CostSheets', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, CostSheets, $state, $window, $http, $sce) {
    $scope.global = Global;

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByRfqId = function () {
        $http.get("/rfq/costsheets/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.costsheets = response.data;
                if ($scope.costsheets.length > 0) {
                    for (var indexOuter = 0; indexOuter < $scope.costsheets.length; indexOuter++) {
                            $scope.costsheets[indexOuter].data = JSON.parse($scope.costsheets[indexOuter].data);
                    }
                }
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