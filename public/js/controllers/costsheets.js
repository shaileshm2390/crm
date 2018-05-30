'use strict';

var app = angular.module('mean.costsheets').controller('CostSheetsController', ['$scope', '$stateParams', 'Global', 'CostSheets', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, CostSheets, $state, $window, $http, $sce) {
    $scope.global = Global;

    $scope.stringToObject = function (strObj, doSort) {
        if (typeof doSort == 'undefined') doSort = false;
        var sortedObj = {}
        var obj = angular.fromJson(strObj);
        if (doSort) {            
            Object.keys(obj)
                .sort()
                .forEach(function (v, i) {
                    sortedObj[v] = obj[v];
                });
        }
        return (doSort) ? sortedObj : obj;
    }
    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByRfqId = function () {
        $http.get("/rfq/costsheets/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.costsheets = response.data;
            }, function (error) {
               // console.log(error, $stateParams.rfqId);
            });
    };

}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});