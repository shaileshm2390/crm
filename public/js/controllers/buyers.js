'use strict';

angular.module('mean.buyers').controller('BuyersController', ['$scope', '$stateParams', 'Global', 'Buyers', '$state', '$window', '$http', function ($scope, $stateParams, Global, Buyers, $state, $window, $http) {
    $scope.global = Global;

    $scope.create = function () {
        var buyer = new Buyers({
            name: this.name,
            email: this.email,
            contact: this.contact,
            CustomerId: $stateParams.customerId
        });

        buyer.$save(function (response) {
            $window.location.href = '/customer/' + $stateParams.customerId;
        });

        this.name = "";
        this.email = "";
        this.contact = "";
        this.CustomerId = "";
    };

    $scope.find = function () {
        $http.get("/buyers/" + $stateParams.customerId)
            .then(function (response) {
                $scope.buyers = response.data;
            }, function (response) {
                console.log(error, $stateParams.customerId);
            });
    };

}]);