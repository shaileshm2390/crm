'use strict';

angular.module('mean.costsheets').controller('CostSheetsController', ['$scope', '$stateParams', 'Global', 'CostSheets', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, CostSheets, $state, $window, $http, $sce) {
    $scope.global = Global;

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    //$scope.findOneByRfqId = function () {
    //    $http.get("/rfqs/" + $stateParams.rfqId)
    //        .then(function (response) {
    //            $scope.rfq = response.data;
    //        }, function (error) {
    //            console.log(error, $stateParams.rfqId);
    //        });
    //};

}]);