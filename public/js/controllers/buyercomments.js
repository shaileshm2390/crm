'use strict';

angular.module('mean.buyercomments').controller('BuyercommentsController', ['$scope', '$stateParams', 'Global', 'Buyercomments', '$state', '$window', '$http', '$controller', '$rootScope', '$location', function ($scope, $stateParams, Global, Buyercomments, $state, $window, $http, $controller, $rootScope, $location) {
    $scope.global = Global;
    $scope.userId = $window.user.id;

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var buyercomment = new Buyercomments({
            comment: this.comment,          
            UserId: user.id, // user is global variable
            BuyerId: $stateParams.buyerId
        });

        buyercomment.$save(function (response) {
            $http.get("/buyercomments/" + $stateParams.buyerId).then(function (response) {
                $scope.updatedBuyerComment = JSON.stringify(response.data);

                $scope.find();

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New buyercomments is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedBuyerComment });
            });
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