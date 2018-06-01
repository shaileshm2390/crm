'use strict';

angular.module('mean.buyers').controller('BuyersController', ['$scope', '$stateParams', 'Global', 'Buyers', '$state', '$window', '$http', '$rootScope', '$controller', '$location', function ($scope, $stateParams, Global, Buyers, $state, $window, $http, $rootScope, $controller, $location) {
    $scope.global = Global;

    var url = "//freegeoip.net/json/";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        console.log("in angular's create buyer");
        var buyer = new Buyers({
            name: $scope.buyer.name,
            email: $scope.buyer.email,
            contact: $scope.buyer.contact,
            CustomerId: $stateParams.customerId
        });
        $http.post("/buyers", buyer).then(function (response) {
                $scope.updatedBuyer = JSON.stringify(response.data);

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New Buyer is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedBuyer });

                $window.location.href = "/customer/" + $stateParams.customerId;
             });
          }, function (error) {
            console.log(error);
            $scope.errorMessage = error;


        $scope.buyer.name = "";
        $scope.buyer.email = "";
        $scope.buyer.contact = "";        
    };

    $scope.remove = function (buyer) {
        var deleteBuyer = $window.confirm('Are you absolutely sure you want to delete?');
        
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
                            $window.location.href = "/customer/" + $stateParams.customerId;
         
                        }, function (error) {
                            console.log(error);
                            $scope.errorMessage = error;
                        });
                    }
                });
           // $window.location.href = "/customer/" + $stateParams.customerId;
        }
    };

    $scope.update = function () {
        var buyer = $scope.buyer;
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

                    $window.location.href = "/customer/" + $stateParams.customerId + "/buyer/" + $stateParams.buyerId;
               
            }, function (error) {
                console.log(error);
                $window.location.href = "/signin";
            });
        });
    };

    $scope.find = function () {
        $http.get("/buyers/" + $stateParams.customerId)
            .then(function (response) {
                $scope.buyers = response.data;
            }, function (error) {
                console.log(error, $stateParams.customerId);
            });
    };

    $scope.findOne = function () {     
        $http.get("/buyers/edit/" + $stateParams.buyerId)
            .then(function (response) {
                $scope.buyer = response.data;
            }, function (error) {
                console.log(error, $stateParams.buyerId);
            });
    };

}]);