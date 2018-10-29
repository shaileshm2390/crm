﻿'use strict';

var app = angular.module('mean.rfqs').controller('RfqsController', ['$scope', '$stateParams', 'Global', 'Rfqs', '$state', '$window', '$http', '$sce', '$location', function ($scope, $stateParams, Global, Rfqs, $state, $window, $http, $sce, $location) {
    $scope.global = Global;
    $scope.validatePermission = false;
    $scope.globalCheckFeasibility = true;
    $scope.currentUrl = $location.url();

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

    $scope.RemoveSpaceFromKey = function (arr) {
        // Iterate over array
        arr.forEach(function (e, i) {
            // Iterate over the keys of object
            Object.keys(e).forEach(function (key) {

                // Copy the value
                var val = e[key],
                  newKey = key.replace(/\s+/g, '').replace(/\//g,'');

                // Remove key-value from object
                delete arr[i][key];

                // Add value with new key
                arr[i][newKey] = val;
            });
        });
        return arr;
    };
    

    $scope.findOneByRfqId = function () {
        $http.get("/rfqs/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.rfq = response.data;
                var currentUrl = "customer/" + $scope.rfq.Buyer.CustomerId + "/buyer/" + $scope.rfq.BuyerId + "/rfq/" + $scope.rfq.id;
                if (window.location.href.indexOf(currentUrl) > -1) {
                    for (var index = 0; index < $scope.rfq.RfqImages.length; index++) {
                        if ($scope.rfq.RfqImages[index].imagePath.indexOf(".pdf") > -1) {
                            $scope.rfq.RfqImages[index].displayPath = '/img/pdf.png';
                        } else {
                            $scope.rfq.RfqImages[index].displayPath = $scope.rfq.RfqImages[index].imagePath;
                        }
                    }
                    if ($scope.rfq.CostSheets.length > 0) {
                        $scope.rfq.LatestCostsheet = $scope.rfq.CostSheets[$scope.rfq.CostSheets.length - 1];
                        $scope.rfq.LatestCostsheet.data = JSON.parse($scope.rfq.LatestCostsheet.data)
                        var costSheetData = $scope.RemoveSpaceFromKey($scope.rfq.LatestCostsheet.data);
                        var RawMaterial = new Array(), Conversion = new Array(), HtSt = new Array();
                        $.each(costSheetData, function (key, data) {
                            if (data.hasOwnProperty('RawMaterial')) {
                                RawMaterial.push(data);
                            } else if (data.hasOwnProperty('Operation')) {
                                Conversion.push(data);
                            }
                            else if (data.hasOwnProperty('HTST')) {
                                HtSt.push(data);
                            } else if (data.hasOwnProperty("PercentageRMCost")) {
                                $scope.rfq.LatestCostsheet.PercentageRMCost = data.PercentageRMCost;
                                $scope.rfq.LatestCostsheet.ProfitonRMCost = data.ProfitonRMCost;
                                $scope.rfq.LatestCostsheet.PercentageConversionCost = data.PercentageConversionCost;
                                $scope.rfq.LatestCostsheet.ProfitonConversionCost = data.ProfitonConversionCost;
                            } else if (data.hasOwnProperty("Total")) {
                                $scope.rfq.LatestCostsheet.Total = data.Total;
                            }
                        });
                        $scope.rfq.LatestCostsheet.RawMaterial = RawMaterial;
                        $scope.rfq.LatestCostsheet.Conversion = Conversion;
                        $scope.rfq.LatestCostsheet.HtSt = HtSt;
                    }

                    $scope.validatePermission = true;
                    if ($scope.rfq.HandoverSubmitted !== null && $scope.rfq.HandoverSubmitted.id != null && $scope.rfq.DeveloperHandovers != null && $scope.rfq.DeveloperHandovers.length > 0) {
                        var testDate = new Date();
                        var onlydate = new Date($scope.rfq.HandoverSubmitted.createdAt.split("T")[0]);
                        $scope.ExpectedLeadDate = testDate.setDate(onlydate.getDate() + ($scope.rfq.DeveloperHandovers[0].expectedLeadTime * 7));
                    }
                } else {
                    window.location.href = currentUrl;
                }
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