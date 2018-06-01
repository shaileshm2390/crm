'use strict';

var app = angular.module('mean.purchaseorderimages').controller('PurchaseorderimagesController', ['$scope', '$location', '$stateParams', 'Global', 'Purchaseorderimages', '$state', '$window', '$filter', '$controller', '$rootScope', '$http', function ($scope, $location, $stateParams, Global, Purchaseorderimages, $state, $window, $filter, $controller, $rootScope, $http) {
    $scope.global = Global;


    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        console.log("create method.");
        var Purchaseorderimage = new Purchaseorderimages({
            imagePath: this.imagePath,
            //status: this.selectedStatus
        });

        Purchaseorderimage.$save(function (response) {
            //$state.go('departments');
            $http.get("/Purchaseorderimages/" + Purchaseorderimage.id).then(function (response) {
                console.log("updated data  -->  " + JSON.stringify(response));
                $scope.updatedImageOrder = JSON.stringify(response.data);

                $state.go('createPurchaseOrder');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New purchase order image is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedImageOrder });
            });
        });

        // this.image = "";

        this.imagePath = "";
        console.log("status  -->  " + this.imagePath);
    };

    $scope.remove = function (purchaseorderimage) {
        console.log("in angular's destroy!!!!");
        var deletePurchaseorderimage = $window.confirm('Are you absolutely sure you want to delete?');

        if (deletePurchaseorderimage) {
            //get previous data from URL
            $http.get("/purchaseorders/" + purchaseorderimage.id).then(function (response) {
                $scope.previousImageOrder = JSON.stringify(response.data);


                if (purchaseorderimage) {
                    purchaseorderimage.$remove();

                    for (var i in $scope.purchaseorderimages) {
                        if ($scope.purchaseorderimages[i] === purchaseorderimage) {
                            $scope.purchaseorderimages.splice(i, 1);
                        }
                    }
                }
                else {
                    $scope.purchaseorderimage.$remove();
                }

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({
                    message: "Purchase order " + purchaseorder.id + " is deleted",
                    ipAddress: $rootScope.ip,
                    pageUrl: $location.url(),
                    userId: user.id,
                    previousData: $scope.previousImageOrder,
                    updatedData: ""
                });
                $window.location.href = "/purchaseorder";
            });
        }
    };

    $scope.update = function () {
        var purchaseorderimage = $scope.purchaseorderimage;
        if (!purchaseorderimage.updated) {
            purchaseorderimage.updated = [];
        }

        //get previous data from URL
        $http.get("/purchaseorders/" + purchaseorderimage.id).then(function (response) {
            console.log("previous data  -->  " + JSON.stringify(response));
            $scope.previousImageOrder = JSON.stringify(response.data);
        });

        purchaseorderimage.updated.push(new Date().getTime());

        purchaseorderimage.$update(function () {
            //$state.go('viewDepartment', { departmentId: department.id })

            ///get updated data from URL
            $http.get("/purchaseorders/" + purchaseorderimage.id).then(function (response) {
                console.log("updated data  -->  " + JSON.stringify(response));
                $scope.updatedImageOrder = JSON.stringify(response.data);


                $state.go('purchaseorders');
                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "Purchase order image is updated.", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousImageOrder, updatedData: $scope.updatedImageOrder });
            });

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.find = function () {
        Purchaseorderimages.query(function (purchaseorderimages) {
            $scope.purchaseorderimages = purchaseorderimages;

        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findExceptAdmin = function () {
        Purchaseorderimages.query(function (purchaseorderimages) {
            for (var i in purchaseorderimages) {
                if (purchaseorderimages[i].name === 'Admin') {
                    purchaseorderimages.splice(purchaseorderimages[i], 1);
                }
            }
            $scope.purchaseorderimages = purchaseorderimages;
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

    $scope.findOne = function () {
        Purchaseorderimages.get({
            purchaseorderimageId: $stateParams.purchaseorderimageId
        }, function (purchaseorderimage) {
            $scope.purchaseorderimage = purchaseorderimage;
        }, function (error) {
            console.log(error);
            $window.location.href = "/signin";
        });
    };

}]);
