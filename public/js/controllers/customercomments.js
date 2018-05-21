'use strict';

angular.module('mean.customercomments').controller('CustomercommentsController', ['$scope', '$stateParams', 'Global', 'Customercomments', '$state', '$window', '$http', function ($scope, $stateParams, Global, Customercomments, $state, $window, $http) {
    $scope.global = Global;

    $scope.create = function () {
        var customercomment = new Customercomments({
            comment: this.comment,          
            UserId: user.id, // user is global variable
            CustomerId: $stateParams.customerId
        });

        customercomment.$save(function (response) {
            $window.location.href = '/customer/' + $stateParams.customerId;
        });

        this.comment = "";
        this.UserId = "";
        this.CustomerId = "";

    };

    $scope.find = function () {    
        $http.get("/customercomments/" + $stateParams.customerId)
            .then(function (response) {
                $scope.customercomments = response.data;
            }, function (response) {
                console.log(error, $stateParams.customerId);
            });
    };

}]);