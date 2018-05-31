'use strict';

angular.module('mean.buyercomments').controller('BuyercommentsController', ['$scope', '$stateParams', 'Global', 'Buyercomments', '$state', '$window', '$http', function ($scope, $stateParams, Global, Buyercomments, $state, $window, $http) {
    $scope.global = Global;
    $scope.userId = $window.user.id;

    $scope.create = function () {
        var buyercomment = new Buyercomments({
            comment: this.comment,          
            UserId: user.id, // user is global variable
            BuyerId: $stateParams.buyerId
        });

        buyercomment.$save(function (response) {
            $scope.find();
        });

        this.comment = "";
        this.UserId = "";
        this.BuyerId = "";

    };

    $scope.find = function () {    
        $http.get("/buyercomments/" + $stateParams.buyerId)
            .then(function (response) {
                $scope.buyercomments = response.data;
            }, function (response) {
                console.log(error, $stateParams.buyerId);
            });
    };

}]);