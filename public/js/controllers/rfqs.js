'use strict';

var app = angular.module('mean.rfqs').controller('RfqsController', ['$scope', '$stateParams', 'Global', 'Rfqs', '$state', '$window', '$http', '$sce', function ($scope, $stateParams, Global, Rfqs, $state, $window, $http, $sce) {
    $scope.global = Global;
    $scope.validatePermission = false;
    $scope.globalCheckFeasibility = true;

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
               // if ($scope.isFeasible($scope.rfq)) {
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
           //     } else {
                 //   window.location.href = "/";
           //     }
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

    $scope.isFeasible = function (rfq) {
        if ($scope.globalCheckFeasibility) {
            if (typeof (rfq) != "undefined") {
                return rfq.feasiblity == 1;
            }
            return false;
        } else {
            return true;
        }
    };

}]);

app.filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});