﻿'use strict';

angular.module('mean.buyers').controller('BuyersController', ['$scope', '$stateParams', 'Global', 'Buyers', '$state', '$window', '$http', '$rootScope', '$controller', '$location', function ($scope, $stateParams, Global, Buyers, $state, $window, $http, $rootScope, $controller, $location) {
    $scope.global = Global;
    $scope.imagesString = '';
    $scope.message = "";

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        $scope.message = "Loading.. Please wait..!!";

        var buyer = new Buyers({
            name: $scope.buyer.name,
            email: $scope.buyer.email,
            contact: $scope.buyer.contact,
            CustomerId: $stateParams.customerId,
            imagesString: this.imagesString
        });
        $http.post("/buyers", buyer).then(function (response) {
                $scope.updatedBuyer = JSON.stringify(response.data);

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New Buyer is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedBuyer });
                $scope.message = "";
                $scope.buyer.name = "";
                $scope.buyer.email = "";
                $scope.buyer.contact = "";
                $window.location.href = "/customer/" + $stateParams.customerId;
                
             });
          }, function (error) {
            console.log(error);
            $scope.errorMessage = error;
            $scope.message = "";
    };

    $scope.remove = function (buyer) {
        var deleteBuyer = $window.confirm('Are you absolutely sure you want to delete?');
        $scope.message = "Loading.. Please wait..!!";
        if (deleteBuyer) {
            
                $http.get("/buyers/edit/" + buyer.id).then(function (response) {
                    var previousBuyer = JSON.stringify(response.data);
                    
                    if (buyer) {
                        $http.delete("/buyers/edit/" + buyer.id, buyer).then(function (response) {

                            for (var i in $scope.buyers) {
                                if ($scope.buyers[i] === buyer) {
                                    $scope.buyers.splice(i, 1);
                                }
                            }
                            var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                            //watchdog calling
                            commonCtrl.create({ message: "Buyer is deleted", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: previousBuyer, updatedData: "" });
                            $scope.message = "";
                            $window.location.href = "/customer/" + $stateParams.customerId;
         
                        }, function (error) {
                            console.log(error);
                            $scope.message = "";
                            $scope.errorMessage = error;
                        });
                    }
                });
           // $window.location.href = "/customer/" + $stateParams.customerId;
        }
    };

    $scope.update = function () {
        var buyer = $scope.buyer;
        $scope.message = "Loading.. Please wait..!!";
        $scope.buyer.imagesString = $scope.imagesString;
        if (!buyer.updated) {
            buyer.updated = [];
        }
        $http.get("/buyers/edit/" + $stateParams.buyerId).then(function (response) {
            $scope.previousBuyer = JSON.stringify(response.data);

            buyer.updated.push(new Date().getTime());
            $http.put("/buyers/edit/" + $stateParams.buyerId, buyer)
                .then(function (response) {

                    $scope.updatedBuyer = JSON.stringify(response.data);
                    var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                    //watchdog calling
                    commonCtrl.create({ message: "Buyer with id " + $stateParams.buyerId + " is updated", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: $scope.previousBuyer, updatedData: $scope.updatedBuyer });
                    $scope.message = "";
                    $window.location.href = "/customer/" + $stateParams.customerId + "/buyer/" + $stateParams.buyerId;
               
            }, function (error) {
                console.log(error);
                $scope.message = "";
                $window.location.href = "/signin";
            });
        });
    };

    $scope.find = function () {
        $scope.message = "Loading.. Please wait..!!";
        $http.get("/buyers/" + $stateParams.customerId)
            .then(function (response) {
                $scope.buyers = response.data;
                $scope.message = "";
            }, function (error) {
                console.log(error, $stateParams.customerId);
                $scope.message = "";
            });
    };

    $scope.findOne = function () {
        $scope.message = "Loading.. Please wait..!!";
        $http.get("/buyers/edit/" + $stateParams.buyerId)
            .then(function (response) {
                $scope.buyer = response.data;
                $scope.message = "";
            }, function (error) {
                console.log(error, $stateParams.buyerId);
                $scope.message = "";
            });
    };

}]);