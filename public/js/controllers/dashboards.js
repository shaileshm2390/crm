'use strict';

var app = angular.module('mean.dashboards').controller('DashboardsController', ['$scope', '$location', '$stateParams', 'Global', 'Dashboards', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', '$sce', function ($scope, $location, $stateParams, Global, Dashboards, $state, $window, $filter, $controller, $rootScope, $http, $sce) {
    $scope.global = Global;
    $scope.status = "";

    $scope.trustAsHtml = function (html) {
        return $sce.trustAsHtml(html);
    }

    //$scope.find = function () {
    //    if (typeof $window.user !== 'undefined') {
    //        $http.post("/dashboards/getSiteSummary")
    //            .then(function (response) {
    //                $scope.siteSummary = response.data;
    //            }, function (error) {
    //                console.log(error);
    //            });
    //    }
    //};

    $scope.findOpenRfq = function () {
        if (typeof $window.user !== 'undefined') {
            $http.get("/dashboards/getOpenRfq")
                .then(function (response) {
                    $scope.rfqs = response.data;
                }, function (error) {
                    console.log(error, $stateParams.buyerId);
                });
        }
    };

    $scope.findMyRfq = function () {

        if (typeof $window.user !== 'undefined') {
            $http.get("/dashboards/getMyRfq")
                .then(function (response) {
                    $scope.myRfqs = response.data;
                    //customStatus
                    for (var index = 0; index < $scope.myRfqs.length; index++) {
                        
                        if (!$scope.myRfqs[index].RfqParts.length) {
                            $scope.myRfqs[index].customStatus = "<a class='btn btn-warning' href='/customer/" + $scope.myRfqs[index].Buyer.CustomerId + "/buyer/" + $scope.myRfqs[index].Buyer.id + "/rfq/" + $scope.myRfqs[index].id +"'>Check Feasibility</a>";

                        } else {
                            $scope.myRfqs[index].customStatus = "<table class='table table-hover'><thead><tr><th>Part Name</th><th>Status</th></tr></thead ><tbody>"
                        }

                        for (var partIndex = 0; partIndex < $scope.myRfqs[index].RfqParts.length; partIndex++) {

                            $scope.myRfqs[index].customStatus += "<tr><td>" + $scope.myRfqs[index].RfqParts[partIndex].partName + "</td><td>"

                            if (!$scope.myRfqs[index].RfqParts[partIndex].CostSheets.length) {

                                $scope.myRfqs[index].customStatus += "<a class='btn btn-info' href='/rfq/" + $scope.myRfqs[index].id + "/costsheet/prepare/" + $scope.myRfqs[index].RfqParts[partIndex].id  +"'>Prepare Cost Sheet</a>";

                            }
                            else if (!$scope.myRfqs[index].RfqParts[partIndex].CostSheets.some(function (o) { return o["status"] !== null && o["status"].toLowerCase() === "approved"; })) {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/costsheet/approval/" + $scope.myRfqs[index].RfqParts[partIndex].id +"'>Waiting for Cost Sheet Approval</a>";

                            } else if (!$scope.myRfqs[index].Quotations.length) {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/quotation/short'>Waiting for Short Quotation</a>";

                            } else if (!$scope.myRfqs[index].PurchaseOrders.length) {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-danger' href='/rfq/" + $scope.myRfqs[index].id + "/purchaseorder'>Waiting for PO</a>";

                            } else if (!$scope.myRfqs[index].PurchaseOrders.some(function (o) { return o["status"] !== null && o["status"].toLowerCase() === "complete"; })) {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-warning' href='/rfq/" + $scope.myRfqs[index].id + "/purchaseorder'>Waiting for PO approval</a>";

                            }
                            else {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-success' href='rfq/" + $scope.myRfqs[index].id + "/purchaseorder'>PO Completed</a>";
                            }

                            if ($scope.myRfqs[index].RfqParts[partIndex].Samplesubmissionimages.length > 0 && $scope.myRfqs[index].RfqParts[partIndex].Samplesubmissions.length == 0) {
                                $scope.myRfqs[index].customStatus += "&nbsp; <br /><a class='btn btn-warning m-t-5' href='rfq/" + $scope.myRfqs[index].id + "/samplesubmission/" + $scope.myRfqs[index].RfqParts[partIndex].id +"'>" + $scope.myRfqs[index].RfqParts[partIndex].Samplesubmissionimages[0].operation + " drawing completed</a>";
                            }
                            else if ($scope.myRfqs[index].RfqParts[partIndex].Samplesubmissions.length) {
                                $scope.myRfqs[index].customStatus += "&nbsp; <br /><a class='btn btn-success m-t-5' href='rfq/" + $scope.myRfqs[index].id + "/samplesubmission/" + $scope.myRfqs[index].RfqParts[partIndex].id +"'>" + $scope.myRfqs[index].RfqParts[partIndex].Samplesubmissions[0].stage + " " + $scope.myRfqs[index].RfqParts[partIndex].Samplesubmissions[0].stageProcess + " completed</a>";
                            }

                            if ($scope.myRfqs[index].HandoverSubmitted != null && $scope.myRfqs[index].RfqParts[partIndex].DeveloperHandovers.length == 0) {
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-success' href='/rfq/" + $scope.myRfqs[index].id + "/samplesubmission/" + $scope.myRfqs[index].RfqParts[partIndex].id +"'>Handover to developer</a>";
                            }
                            else if ($scope.myRfqs[index].HandoverSubmitted != null && $scope.myRfqs[index].RfqParts[partIndex].DeveloperHandovers.length) {
                               // var testDate = new Date();
                                var todayDate = new Date();
                               // var onlydate = new Date($scope.myRfqs[index].HandoverSubmitted.createdAt.split("T")[0]);
                                var expectedLeadDate = new Date($scope.myRfqs[index].RfqParts[partIndex].DeveloperHandovers[0].expectedLeadTime);

                                var cssClass = "";
                                if (expectedLeadDate.getTime() < todayDate.getTime()) {
                                    cssClass = "danger";
                                } else if (expectedLeadDate.getTime() == todayDate.getTime()) {
                                    cssClass = "warning";
                                } else {
                                    cssClass = "success";
                                }
                                expectedLeadDate = expectedLeadDate.getDate() + "-" + (expectedLeadDate.getMonth() + 1) + "-" + expectedLeadDate.getFullYear();
                                $scope.myRfqs[index].customStatus += "<a class='btn btn-" + cssClass + "' href='/rfq/" + $scope.myRfqs[index].id + "/developerhandover/" + $scope.myRfqs[index].RfqParts[partIndex].id +"'>Expected Lead date: " + expectedLeadDate + "</a>";
                            }
                            $scope.myRfqs[index].customStatus += "</td></tr>"
                        }
                        if ($scope.myRfqs[index].RfqParts.length) {
                            $scope.myRfqs[index].customStatus += "</tbody></table>"
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