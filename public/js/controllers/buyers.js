'use strict';

angular.module('mean.buyers').controller('BuyersController', ['$scope', '$stateParams', 'Global', 'Buyers', '$state', '$window', '$http', function ($scope, $stateParams, Global, Buyers, $state, $window, $http) {
    $scope.global = Global;

    $scope.create = function () {
        var buyer = new Buyers({
            name: $scope.buyer.name,
            email: $scope.buyer.email,
            contact: $scope.buyer.contact,
            CustomerId: $stateParams.customerId
        });
        $http.post("/buyers", buyer)
            .then(function (response) {
                $window.location.href = "/customer/" + $stateParams.customerId;
            }, function (error) {
                console.log(error);
                $scope.errorMessage = error;
            });

        $scope.buyer.name = "";
        $scope.buyer.email = "";
        $scope.buyer.contact = "";        
    };

    $scope.remove = function (buyer) {
        var deleteBuyer = $window.confirm('Are you absolutely sure you want to delete?');
        if (deleteBuyer) {
            if (buyer) {
                $http.delete("/buyers/edit/" + buyer.id, buyer)
                    .then(function (response) {
                        $window.location.href = "/customer/" + $stateParams.customerId;
                    }, function (error) {
                        console.log(error);
                        $scope.errorMessage = error;
                    });

                for (var i in $scope.buyers) {
                    if ($scope.buyers[i] === buyer) {
                        $scope.buyers.splice(i, 1);
                    }
                }
            }
            $window.location.href = "/customer/" + $stateParams.customerId;
        }
    };

    $scope.update = function () {
        var buyer = $scope.buyer;
        if (!buyer.updated) {
            buyer.updated = [];
        }
        buyer.updated.push(new Date().getTime());
        $http.put("/buyers/edit/" + $stateParams.buyerId, buyer)
            .then(function (response) {
                $window.location.href = "/customer/" + $stateParams.customerId + "/buyer/" + $stateParams.buyerId;
            }, function (error) {
                console.log(error);
                $window.location.href = "/signin";
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
                console.log(response.data);
                $scope.buyer = response.data;
            }, function (error) {
                console.log(error, $stateParams.buyerId);
            });
    };

}]);