'use strict';

angular.module('mean.customercomments').controller('CustomercommentsController', ['$scope', '$stateParams', 'Global', 'Customercomments', '$state', '$window', '$http', '$rootScope', '$controller', '$location', function ($scope, $stateParams, Global, Customercomments, $state, $window, $http, $rootScope, $controller, $location) {
    $scope.global = Global;
    $scope.userId = $window.user.id;

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var customercomment = new Customercomments({
            comment: this.comment,          
            UserId: user.id, // user is global variable
            CustomerId: $stateParams.customerId
        });

        customercomment.$save(function (response) {
                $scope.updatedCustomerComment = JSON.stringify(response);

                $scope.find();

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New customer comment is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.updatedCustomerComment });
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
                console.log(response, $stateParams.customerId);
            });
    };

}]);