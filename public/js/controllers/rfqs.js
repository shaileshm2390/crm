'use strict';

var app = angular.module('mean.rfqs').controller('RfqsController', ['$scope', '$stateParams', 'Global', 'Rfqs', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, Rfqs, $state, $window, $http, $sce) {
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

    $scope.displaySampleSubmission = function (rfq) {
        if (typeof (rfq) != "undefined") {
             return rfq.CostSheets.length && rfq.CostSheets.some(function (o) { return o['status'] == 'approved' });
        }
        return false;
    };

    $scope.displayReceivePO = function (rfq) {
        if (typeof (rfq) != "undefined") {            
            return rfq.Quotations.length;
        }
        return false;
    };

    $scope.isPoReceived = function (rfq) {
        if (typeof (rfq) != "undefined" && typeof (rfq.PurchaseOrders) != 'undefined') {     
            return rfq.PurchaseOrders.length && rfq.PurchaseOrders.some(function (o) { return o['status'] == "Completed" });
        }
        return false;
    };

    $scope.assignToMeRfq = function (rfqId) {
        $http.put('/rfqs/' + rfqId, { UserId: $window.user.id, id: rfqId }).then(function (response) {
            $scope.findOneByRfqId();
        });
    };

}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});