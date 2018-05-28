/// <reference path="../../../config/sequelize.js" />
'use strict';

var app = angular.module('mean.purchaseorders').controller('PurchaseordersController', ['$scope', '$location', '$stateParams', 'Global', 'Purchaseorders', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Purchaseorders, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;


    $scope.Status = ["Complete", "Pending", "Open"];

    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        console.log("create method.");
        var purchaseorder = new Purchaseorders({
           // image: this.image,
            status: this.selectedStatus,
            RfqId: $stateParams.rfqId
        });
        console.log("parameter -->  " + $stateParams.rfqId);
        //db.purchaseorder.update(purchaseorder);
        purchaseorder.$save(function (response) {
            //$state.go('departments');
            //$http.get("/purchaseorders/" + purchaseorder.id).then(function (response) {
            //    console.log("updated data  -->  " + JSON.stringify(response));
            //    $scope.updatedOrder = JSON.stringify(response.data);

            //    $state.go('createPurchaseOrder');
            //    var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

            //    //watchdog calling
            //    commonCtrl.create({ message: "New purchase order is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedOrder });
            //});
        });

        // this.image = "";
        
        this.status = "";
        console.log("status  -->  " + this.status);
    };

    $scope.remove = function (purchaseorder) {
        var deletePurchaseorder = $window.confirm('Are you absolutely sure you want to delete?');

        if (deletePurchaseorder) {
            //get previous data from URL
            $http.get("/purchaseorders/" + purchaseorder.id).then(function (response) {
                $scope.previousOrder = JSON.stringify(response.data);


                if (purchaseorder) {
                    purchaseorder.$remove();

                    for (var i in $scope.purchaseorders) {
                        if ($scope.purchaseorders[i] === purchaseorder) {
                            $scope.purchaseorders.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.purchaseorder.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Purchase order " + purchaseorder.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousOrder,
                    updatedData: ""
                });
                $window.location.href = "/purchaseorder";
            });
        }
    };

    $scope.update = function () {
        var purchaseorder = $scope.purchaseorder;
        if (!purchaseorder.updated) {
            purchaseorder.updated = [];
        }

        //get previous data from URL
        $http.get("/purchaseorders/" + purchaseorder.id).then(function (response) {
            console.log("previous data  -->  " + JSON.stringify(response));
            $scope.previousOrder = JSON.stringify(response.data);
        });

        purchaseorder.updated.push(new Date().getTime());

        purchaseorder.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })

            ///get updated data from URL
            $http.get("/purchaseorders/" + purchaseorder.id).then(function (response) {
                console.log("updated data  -->  " + JSON.stringify(response));
                $scope.updatedOrder = JSON.stringify(response.data);


                $state.go('purchaseorders');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "Purchase order " + purchaseorder.id + " is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousOrder, updatedData: $scope.updatedOrder });
            });

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        Purchaseorders.query(function (purchaseorders) {
            $scope.purchaseorders = purchaseorders;

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findExceptAdmin = function () {
        Purchaseorders.query(function (purchaseorders) {
            for (var i in purchaseorders) {
                if (purchaseorders[i].name === 'Admin') {
                    purchaseorders.splice(purchaseorders[i], 1);
                }
            }
            $scope.purchaseorders = purchaseorders;
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        Purchaseorders.get({
            purchaseorderId: $stateParams.purchaseorderId
        }, function (purchaseorder) {
            $scope.purchaseorder = purchaseorder;
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

}]);
