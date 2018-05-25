'use strict';

angular.module('mean.rfqs').controller('RfqsController', ['$scope', '$stateParams', 'Global', 'Rfqs', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, Rfqs, $state, $window, $http, $sce) {
    $scope.global = Global;

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    $scope.findByBuyer = function () {
        $http.get("/buyersrfqs/" + $stateParams.buyerId)
            .then(function (response) {
                $scope.rfqs = response.data;
            }, function (error) {
                console.log(error, $stateParams.buyerId);
            });
    };

    

    $scope.findOneByRfqId = function () {
        $http.get("/rfqs/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.rfq = response.data;
            }, function (error) {
                console.log(error, $stateParams.rfqId);
            });
    };

}]);