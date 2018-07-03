'use strict';

angular.module('mean.rfqcomments').controller('RfqcommentsController', ['$scope', '$stateParams', 'Global', 'Rfqcomments', '$state', '$window', '$http', '$controller', '$rootScope', '$location', function ($scope, $stateParams, Global, Rfqcomments, $state, $window, $http, $controller, $rootScope, $location) {
    $scope.global = Global;
    $scope.userId = $window.user.id;

    var url = "http://api.ipstack.com/check?access_key=a0a80aaea559ceb4d5ebacc03c30f6d3";
    $http.get(url).then(function (response) {
        $rootScope.ip = response.data.ip;
    });

    $scope.create = function () {
        var rfqcomment = new Rfqcomments({
            comment: this.comment,
            UserId: user.id, // user is global variable
            RfqId: $stateParams.rfqId
        });

        rfqcomment.$save(function (response) {
                
                $scope.NewRfqComments = JSON.stringify(response);

                $scope.find();

                var commonCtrl = $controller('WatchdogsController', { $scope: $scope });

                //watchdog calling
                commonCtrl.create({ message: "New Rfq Comments is created", ipAddress: $rootScope.ip, pageUrl: $location.url(), userId: user.id, previousData: "", updatedData: $scope.NewRfqComments });
            });

        this.comment = "";
        this.UserId = "";
        this.RfqId = "";
        
    };

    $scope.find = function () {
        $http.get("/rfqcomments/" + $stateParams.rfqId)
            .then(function (response) {
                $scope.rfqcomments = response.data;
            }, function (response) {
                console.log(response, $stateParams.rfqId);
            });
    };

}]);